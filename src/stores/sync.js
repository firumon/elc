import { defineStore } from 'pinia';
import {sGet} from "assets/scripts/helpers";
import {useCadreStore} from "stores/cadre";
import {useProgressStore} from "stores/progress";
import {clone, mapKeys} from "lodash";
let cadreStore = null;//useCadreStore();
let progressStore = null;
export const useSyncStore = defineStore('sync', {
  state: () => ({
    lut: 0,
    state: {
      awaiting: {},
      delay: 0.25 * 60 * 1000,
      // delay: 1.1 * 1000,
      timeout: 0
    },
    relation: {
      awaiting: {},
      delay: 0.35 * 60 * 1000,
      // delay: 1.1 * 1000,
      timeout: 0
    },
    campaign: {
      awaiting: {},
      delay: 0.1 * 60 * 1000,
      // delay: 1.1 * 1000,
      timeout: 0
    },
  }),
  getters: {
    cadre(){ if(!cadreStore) cadreStore = useCadreStore(); return cadreStore.name },
  },
  actions: {
    doSync(args){
      if(!cadreStore) cadreStore = useCadreStore();
      return new Promise(resolve => sGet(cadreStore.link, { ...args,lut:this.lut }).then(records => {
        resolve(records);
        this.processProgress(records);
      }))
    },
    processProgress(records,clear){
      if(!progressStore) progressStore = useProgressStore()
      this.lut = parseInt(records.lut)
      progressStore.processProgress(records,clear)
    },
    status(ID,state){
      if(!this.state.awaiting.hasOwnProperty(ID)) this.state.awaiting[ID] = state;
      else this.state.awaiting[ID] = state;
      if(this.state.timeout) clearTimeout(this.state.timeout);
      this.state.timeout = setTimeout(this.syncState,this.state.delay)
    },
    syncState(){
      let awaiting = this.state.awaiting;
      if(!Object.keys(awaiting).length) return true;
      let action = 'set_status', cadre = this.cadre;
      let args = Object.assign({},{ action,cadre },awaiting)
      this.doSync(args).then(() => this.state.awaiting = new Object({}));
    },
    relate(ID,Relation){
      if(!this.relation.awaiting.hasOwnProperty(ID)) this.relation.awaiting[ID] = Relation;
      else this.relation.awaiting[ID] = Relation;
      if(this.relation.timeout) clearTimeout(this.relation.timeout);
      this.relation.timeout = setTimeout(this.syncRelation,this.relation.delay)
    },
    syncRelation(){
      let awaiting = this.relation.awaiting;
      if(!Object.keys(awaiting).length) return true;
      let action = 'add_relation', cadre = this.cadre;
      let args = Object.assign({},{ action,cadre },awaiting)
      this.doSync(args).then(() => this.relation.awaiting = new Object({}));
    },
    addCampaign(ID,Score){
      if(!this.campaign.awaiting.hasOwnProperty(ID)) this.campaign.awaiting[ID] = clone(Score);
      else this.campaign.awaiting[ID] = clone(Score);
      if(this.campaign.timeout) clearTimeout(this.campaign.timeout);
      this.campaign.timeout = setTimeout(this.syncCampaign,this.campaign.delay)
    },
    syncCampaign(){
      let awaiting = this.campaign.awaiting, IDs = Object.keys(awaiting);
      if(!IDs.length) return true;
      let action = 'add_campaign', cadre = this.cadre, id = IDs[0];
      let args = Object.assign({},{ action,cadre,id },mapKeys(awaiting[id],(s,k) => String(k).toLowerCase()))
      this.doSync(args).then(() => {
        delete this.campaign.awaiting[id];
        return this.syncCampaign()
      });
    }
  },
});
