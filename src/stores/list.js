import { defineStore } from 'pinia';
import {forEach, keys, map, parseInt, size, zipObject} from 'lodash'

export const useListStore = defineStore('list', {
  state: () => ({
    voters: [],
    part: [],
    ready: false,
    images: {},
    width: 0,
    card: false,
  }),
  getters: {
    parts(state){ return map(state.part,sIDs => map(sIDs,ID => state.voters[ID])) },
    image_parts(state){ return map(keys(state.images),k => parseInt(k)) },
    total(state){ return size(state.voters) },
    voter_images_exist(){ return !!this.image_parts.length }
  },
  actions: {
    init(){
      let { list,head,images,width } = JSON.parse(localStorage.getItem('eci_cadre'));
      let data = {}, parts = [], idx = { ID:head.indexOf('ID'),PART:head.indexOf('PART'),SERIAL:head.indexOf('SERIAL'), };
      this.images = images; this.width = width;
      forEach(list,rec => {
        if(!rec[0]) return true;
        let i = rec[idx.ID], p = parseInt(rec[idx.PART]), s = parseInt(rec[idx.SERIAL]);
        data[i] = zipObject(head,rec); data[i]['PHONE'] = '';
        if(!parts[p]) parts[p] = [];
        parts[p][s] = i;
      })
      this.voters = data; this.part = parts; this.ready = true
    },
  },
});
