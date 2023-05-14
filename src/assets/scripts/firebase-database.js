import { app } from './firebase'
import { getFirestore,collection,getDoc,doc,query,where,getDocs,addDoc,orderBy,onSnapshot } from "firebase/firestore";
import {map, mapValues} from "lodash";

export const db = getFirestore(app)

export function user(uid){
  return new  Promise((resolve, reject) => {
    let uRef = doc(db,'users',uid)
    getDoc(uRef).then(snap => {
      if(snap.exists()){
        let { name,wards } = snap.data();
        if(!wards || !wards.length) return reject('No Wards Assigned..')
        let wardsRef = collection(db,'wards')
        let wQuery = query(wardsRef,where('name','in',wards))
        let wData = [], masters = [], mData = {}
        getDocs(wQuery).then(qSnap => {
          qSnap.forEach(doc => {
            let dData = doc.data(); wData.push(dData)
            if(!masters.includes(dData.master)) masters.push(dData.master)
          })
          let mRef = collection(db,'masters')
          let mQuery = query(mRef,where('name','in',masters))
          getDocs(mQuery).then(qSnap => {
            qSnap.forEach(doc => {
              mData[doc.id] = doc.data()
            })
            wData = map(wData,ward => Object.assign({},ward,{ master:mData[ward.master] }))
            resolve({ name,wards:wData })
          }).catch(() => reject('Masters fetch error..'))
        }).catch(() => reject('No wards details provided..'))
      } else {
        reject('No user exists..')
      }
    }).catch(() => reject('Error getting user details..'))
  })
}

export function ward_update(ward,data){
  return new Promise((resolve, reject) => {
    let col = collection(db,['wards',ward,'updates'].join('/'));
    let update_data = mapValues(data,val => val === undefined ? null : val)
    addDoc(col,update_data).then(resolve).catch(reject)
  })
}

export function subscribe_notifications(ward,lut){
  console.log('inside, subscribe_notifications',{ ward,lut })
  lut = lut || 0;
  navigator.serviceWorker.ready.then(swr => {
    console.log('inside, SW ready',{ swr })
    Notification.requestPermission().then(val => {
      console.log('inside, Notification.requestPermission',{ val })
      if(val !== 'granted') return;
      console.log({ notify:swr.showNotification })
      let col = collection(db,'wards',ward,'updates');
      let qry = query(col,where('lut','>',lut),orderBy('lut','asc'))
      onSnapshot(qry,qSnap => {
        console.log('onSnapshot',{ notify })
        qSnap.docChanges().forEach((change) => {
          console.log('qSnap',change.type,change.doc.id,change.doc.data());
          if(notify) swr.showNotification('qSnapData').then(null); else console.log('no notify')
          if(swr && swr.active) swr.active.postMessage(change.doc.data()); else console.log('no swr || swr active..')
        })
      })
    })
  }).catch((e) => console.log('Service Worker not Registered',e))
}
