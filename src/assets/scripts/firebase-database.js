import { app } from './firebase'
import { getFirestore,collection,getDoc,doc,query,where,getDocs,documentId } from "firebase/firestore";
import {map} from "lodash";

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
