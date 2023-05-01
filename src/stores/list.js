import { defineStore } from 'pinia';
import {forEach, map, zipObject} from 'lodash'

export const useListStore = defineStore('list', {
  state: () => ({
    voters: [],
    part: [],
    ready: false,
  }),
  getters: {
    parts(state){ return map(state.part,sIDs => map(sIDs,ID => state.voters[ID])) }
  },
  actions: {
    init(){
      let { list,head } = JSON.parse(localStorage.getItem('eci_cadre'));
      let data = {}, parts = [], idx = { ID:head.indexOf('ID'),PART:head.indexOf('PART'),SERIAL:head.indexOf('SERIAL'), };
      forEach(list,rec => {
        if(!rec[0]) return true;
        let i = rec[idx.ID], p = parseInt(rec[idx.PART]), s = parseInt(rec[idx.SERIAL]);
        data[i] = zipObject(head,rec);
        if(!parts[p]) parts[p] = [];
        parts[p][s] = i;
      })
      this.voters = data; this.part = parts; this.ready = true
    },
  },
});
