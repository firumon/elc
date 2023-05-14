import { defineStore } from 'pinia';
import {useSyncStore} from "stores/sync";
import {sGet} from "assets/scripts/helpers";
import {signOut} from "assets/scripts/firebase-auth";
import {camelCase} from "lodash";
// import {subscribe_notifications} from "assets/scripts/firebase-database";

let syncStore = useSyncStore()
export const useCadreStore = defineStore('cadre', {
  state: () => ({
    uid: '', name: '', phone: '',
    ward: '', link: '', masters: {},
    logged: false, synced: false,
  }),
  getters: { },
  actions: {
    init(){
      let cData = JSON.parse(localStorage.getItem('eci_cadre'));
      if(!cData){ signOut(); location.href = '/' }
      else {
        ['uid','phone','name','ward','link'].forEach(k => this[k] = cData[k]);
        ['status','relation','party'].forEach(k => this.masters[k] = cData['masters'][k])
        this.logged = true;
      }
    },
    getProgress(){
      let luts = JSON.parse(localStorage.getItem('eci_lut') || '{}'),
        campaigns = JSON.parse(localStorage.getItem('eci_campaigns') || '{}'),
        ward = this.ward;
      let records = { lut:(luts[ward] || 0),data:(campaigns[ward] || []) };
      if(!records.lut || !records.data.length){
        sGet(this.link,{ action:'get_progress' }).then(records => {
          syncStore.processProgress(records,true);
          this.synced = true;
        })
      } else {
        syncStore.processProgress(records,true);
        this.synced = true;
      }
    },
    signOut(){
      let waiting = syncStore.waiting;
      if(waiting.length > 0) {
        syncStore[camelCase(['sync',waiting[0]].join(' '))]()
        setTimeout(this.signOut,3500)
      } else {
        signOut().then(() => {
          localStorage.removeItem('eci_progress')
          localStorage.removeItem('eci_cadre')
          location.href = '/'
        })
      }
    }
  },
});
