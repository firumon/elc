import { defineStore } from 'pinia';
import {useCadreStore} from "stores/cadre";
import {sGet} from "assets/scripts/helpers";
import {difference, filter, findIndex, forEach, groupBy, includes, indexOf, keyBy, keys, map, mapKeys, mapValues, reduce, sum, sumBy, trim, uniqBy, values, zipObject} from 'lodash'
import {useListStore} from "stores/list";

const defaultProgress = { ID:'',Status:'Active',Campaigns:0,SDPI:0,UDF:0,LDF:0,NDA:0,OTH:0,Member:'',Family:'',Friend:'',Neighbour:'',Know:'',Phone:'',Time:0 }
let cadreStore = null;
let listStore = null;

export const useProgressStore = defineStore('progress', {
  state: () => ({
    head: [],
    data: [],
    headReady: false,
    campaignHead: [],
    campaignData: [],
  }),
  getters: {
    progress(state){ return state.headReady ? keyBy(map(state.data,record => zipObject(state.head,record)),'ID') : [] },
    campaigns(state) {
      return mapValues(groupBy(map(state.campaignData,data => zipObject(state.campaignHead,data)),'ID'),campaigns => uniqBy(campaigns,camp => [camp.Cadre,camp.Time].join('-')))
    },
    IDs(state){ return map(state.data,rec => rec[0]) },
    status(state){
      let idx = state.head.indexOf('Status'), sIds = mapValues(groupBy(state.data,idx),Grp => map(Grp,0));
      if(!listStore) listStore = useListStore();
      let all_voters_id = keys(listStore.voters);
      sIds['Active'] = reduce(sIds,(voters,sVoters,st) => difference(voters,st === 'Active' ? [] : sVoters),all_voters_id)
      return sIds;
    },
    relation(state){
      if(!cadreStore) cadreStore = useCadreStore()
      let cadre = cadreStore.name, check = cadre + ', ', idxS = mapValues(mapKeys(cadreStore.masters.relation),rel => state.head.indexOf(rel));
      let members = filter(map(state.data,P => trim(P[idxS['Member']]) ? P[0] : null))
      return mapValues(idxS,(idx,rel) => rel === 'Member' ? members : filter(map(state.data,P => includes(P[idx]+', ',check) ? P[0] : null)));
    },
    sdpi_members(state){
      let idx = state.head.indexOf('Member');
      return map(filter(state.data,cmp => trim(cmp[idx])),0)
    },
    party_point(state){
      if(!cadreStore) cadreStore = useCadreStore()
      let idxS = mapValues(mapKeys(cadreStore.masters.party),party => state.head.indexOf(party));
      return mapValues(idxS,idx => sumBy(state.data,idx));
    },
    total_points(state){ return sum(values(this.party_point)) },
    campaign_ids(state){ let idx = state.head.indexOf('Campaigns'); return filter(map(state.data,P => parseInt(P[idx]) ? P[0] : null)) },
    party_percent(state){
      let total = this.total_points; return mapValues(this.party_point,points => parseFloat((points/total*100).toFixed(2)));
    },
    party_voters(state){
      if(!cadreStore) cadreStore = useCadreStore()
      let idxS = mapValues(mapKeys(cadreStore.masters.party),party => state.head.indexOf(party)),
        memberIdx = state.head.indexOf('Member');
      return mapValues(idxS,(idx,party) => filter(map(state.data,P => (P[idx] >= 5 || (party === 'SDPI' && trim(P[memberIdx]))) ? P[0] : null)));
    },
  },
  actions: {
    processProgress(records,clear){
      if(clear){
        let { progress } = JSON.parse(localStorage.getItem('eci_cadre'));
        this.setHeads(progress);
        this.data.splice(0,this.data.length)
      }
      if(!records || !records.data) return;
      if(records.data.length) this.addData(records.data)
    },
    setHeads(ary){
      if(!cadreStore) cadreStore = useCadreStore()
      this.head = ary;
      this.campaignHead = ["ID","Cadre","Time"].concat(cadreStore.masters.party)
      this.headReady = true
    },
    addData(dArray){
      if(!listStore) listStore = useListStore();
      dArray.forEach(record => {
        let ID = record[0], Phone = record[this.head.indexOf('Phone')], RecPos = indexOf(this.IDs,ID);
        if(RecPos < 0) this.data.push(record)
        else this.data[RecPos] = record;
        listStore.voters[ID]['PHONE'] = Phone;
      })
    },
    getCampaigns(id){
      if(!cadreStore) cadreStore = useCadreStore()
      return new Promise(resolve => {
        sGet(cadreStore.link,{ action:'get_campaigns',id }).then(records => {
          let { head,data } = records;
          if(!this.campaignHead.length) this.campaignHead = head;
          if(data.length) forEach(data,record => this.campaignData.push(record))
          let tIdx = this.campaignHead.indexOf('Time'), delIdx = [];
          forEach(this.campaignData,(cData,idx) => { if(cData[tIdx] === 0) delIdx.unshift(idx); })
          if(delIdx.length) delIdx.forEach(idx => this.campaignData.splice(idx,1))
          resolve(data)
        })
      })
    },
    updateProgress(ID,Key,Value){
      if(this.progress.hasOwnProperty(ID)){
        if(!cadreStore) cadreStore = useCadreStore();
        let cdIdx = findIndex(this.data,dAry => dAry[0] === ID), kIdx = 0;
        let rNames = cadreStore.masters.relation, d = ', ';
        if(rNames.includes(Key) || Key === 'Unknown'){
          let cadreName = cadreStore.name, Progress = this.progress[ID];
          Value = cadreName;
          rNames.forEach(rName => {
            if(includes(d+Progress[rName]+d,d+cadreName+d)){
              let Names = filter(Progress[rName].split(d)), cnIdx = Names.indexOf(cadreName);
              if(cnIdx >= 0){
                Names.splice(cnIdx,1); let rnIdx = this.head.indexOf(rName);
                if(rnIdx > 0) this.data[cdIdx][rnIdx] = Names.join(d);
              }
            }
            if(rName === Key){
              let Names = filter(Progress[rName].split(d)); Names.push(cadreName);
              kIdx = this.head.indexOf(rName); Value = Names.join(d)
            }
          })
        } else {
          if(Key === 'Status'){
            kIdx = this.head.indexOf(Key);
          }
        }
        if(kIdx) this.data[cdIdx][kIdx] = Value;
      } else {
        if(['Active','Unknown'].includes(Key)) return;
        let dArray = this.head.map(key => {
          if(key === 'ID') return ID;
          if(key === Key) return Value;
          if(key === 'Time') return new Date().getTime();
          return defaultProgress[key]
        })
        this.data.push(dArray)
      }
      return this.progress?.[ID] || {};
    },
    addCampaign(ID,Score){
      if(!cadreStore) cadreStore = useCadreStore()
      let cData = [];
      forEach(this.campaignHead,(hd,idx) => {
        if(hd === 'ID') cData[idx] = ID;
        if(hd === 'Time') cData[idx] = 0;
        if(hd === 'Cadre') cData[idx] = cadreStore.name;
        if(Score.hasOwnProperty(hd)) cData[idx] = Score[hd]
      })
      this.campaignData.push(cData)
      return this.campaigns[ID] || {}
    }
  },
});

