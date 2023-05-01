import { defineStore } from 'pinia';
import {useSyncStore} from "stores/sync";
import {sGet} from "assets/scripts/helpers";
import {signOut} from "assets/scripts/firebase-auth";

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
      ['uid','phone','name','ward','link'].forEach(k => this[k] = cData[k]);
      ['status','relation','party'].forEach(k => this.masters[k] = cData['masters'][k])
    },
    getProgress(){
      sGet(this.link,{ action:'get_progress' }).then(records => {
        syncStore.processProgress(records,true);
        this.synced = true;
      })
    },
    signOut(){
      signOut().then(() => {
        localStorage.removeItem('eci_progress')
        localStorage.removeItem('eci_cadre')
        location.href = '/'
      })
    }
  },
});
