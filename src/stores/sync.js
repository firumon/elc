import { defineStore } from 'pinia';
import {sGet} from "assets/scripts/helpers";
import {useCadreStore} from "stores/cadre";
import {useProgressStore} from "stores/progress";
import {clone, mapKeys, size, reduce, filter, keys} from "lodash";
// import {ward_update} from "assets/scripts/firebase-database";
let cadreStore = null;//useCadreStore();
let progressStore = null;

function keep(ward,lut,data) {
  let campaigns = JSON.parse(localStorage.getItem('eci_campaigns') || '{}')
  campaigns[ward] = data; localStorage.setItem('eci_campaigns',JSON.stringify(campaigns))
  let luts = JSON.parse(localStorage.getItem('eci_lut') || '{}')
  luts[ward] = lut; localStorage.setItem('eci_lut',JSON.stringify(luts))
}

export const useSyncStore = defineStore('sync', {
  state: () => ({
    lut: 0,
    state: {
      awaiting: {},
      delay: 1.3 * 1000,
      timeout: 0
    },
    phone: {
      awaiting: {},
      delay: 1.2 * 1000,
      timeout: 0
    },
    relation: {
      awaiting: {},
      delay: 1.4 * 1000,
      timeout: 0
    },
    campaign: {
      awaiting: {},
      delay: 0.1 * 1000,
      timeout: 0
    },
    delay: 0.99 * 60 * 1000, timeout: 0,
    repeat: 0, dnRepeat: 180,
    nRepeat: { 1:1,2:1,3:2,4:2,5:5,6:10,7:15,8:20,9:25,10:30,11:60,12:120,13:120,14:120,15:120 }
  }),
  getters: {
    cadre(){ if(!cadreStore) cadreStore = useCadreStore(); return cadreStore.name },
    awaiting(state){ return reduce(['state','phone','relation','campaign'],(a,sKey) => a + size(state[sKey]['awaiting']),0) },
    waiting(state){ return filter(['state','phone','relation','campaign'],sK => size(state[sK]['awaiting']) > 0) },
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
      if(!cadreStore) cadreStore = useCadreStore()
      if(records.lut) this.lut = parseInt(records.lut)
      if(records && records.data && records.data.length) {
        progressStore.processProgress(records,clear); this.repeat = 0
        keep(cadreStore.ward,this.lut,progressStore.data)
      }
      if(this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(this.getUpdates,(this.delay * (this.nRepeat[++this.repeat] || this.dnRepeat)))
/*
      if(clear){
        navigator.serviceWorker.ready.then(SWR => {
          SWR.active.addEventListener('message',SwME => {
            console.log('syncStore.. SWR OnMessage..',SwME)
            if(SwME.type === 'getUpdates') return this.getUpdates();
          })
          navigator.serviceWorker.startMessages();
          SWR.active.postMessage({ type:'init' })
        })
      }
*/
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
      this.doSync(args).then((records) => {
        this.synchronized('state',records);
        this.state.awaiting = new Object({})
      });
    },
    setPhone(ID,number){
      if(!this.phone.awaiting.hasOwnProperty(ID)) this.phone.awaiting[ID] = number;
      else this.phone.awaiting[ID] = number;
      if(this.phone.timeout) clearTimeout(this.phone.timeout);
      this.phone.timeout = setTimeout(this.syncPhone,this.phone.delay)
    },
    syncPhone(){
      let awaiting = this.phone.awaiting;
      if(!Object.keys(awaiting).length) return true;
      let action = 'set_phone', cadre = this.cadre;
      let args = Object.assign({},{ action,cadre },awaiting)
      this.doSync(args).then((records) => {
        this.synchronized('phone',records)
        this.phone.awaiting = new Object({})
      });
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
      this.doSync(args).then((records) => {
        this.synchronized('relation',records)
        this.relation.awaiting = new Object({})
      });
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
      this.doSync(args).then((records) => {
        this.synchronized('campaign',records,id)
        delete this.campaign.awaiting[id];
        return this.syncCampaign()
      });
    },
    getUpdates(){
      this.doSync({ action:'get_updates' }).then(() => null)
    },
    synchronized(item,records,id){
      let current = clone(this[item]['awaiting']), cadre = cadreStore.name, ward = cadreStore.ward, lut = records ?. lut,
        count = size(current), voters = keys(current);
      if(item === 'campaign') { count = 1; voters = [id] }
      // ward_update(ward,{ item,cadre,lut,count,voters }).then(null).catch(null)
    }
  },
});
