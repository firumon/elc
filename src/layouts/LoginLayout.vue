<template>
  <q-layout view="hHr lpR fFr">
    <q-header>
      <q-toolbar>
        <q-toolbar-title class="text-center">Login</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="flex flex-center column q-gutter-y-sm">
        <img alt="ELC Logo" src="~assets/logo512.png" style="width: 35%">
        <div v-if="misc.status" class="text-primary text-caption text-bold">{{ misc.status }}</div>
        <template v-if="!collection.uid">
          <div class="text-h5 text-bold text-primary">Login</div>
          <q-input type="number" v-model.number="login.phone" label="Phone number" outlined input-class="text-center text-weight-bold text-primary" :readonly="misc.code" />
          <q-input type="number" v-model.number="login.code" label="OTP Code" outlined input-class="text-center text-weight-bold text-primary" v-show="misc.code" />

          <q-btn label="Sign In" color="primary" padding="sm xl" :loading="misc.loading" @click="signIn" v-if="misc.code" />
          <q-btn label="Get Code" color="primary" padding="sm xl" :loading="misc.loading" @click="getCode" v-else />
          <q-btn size="xs" flat dense label="reload" color="warning" v-if="misc.code" @click="reload" />
          <div id="container"></div>
        </template>
        <template v-else-if="!collection.ward">
          <q-list>
            <q-item-label header>Select Ward</q-item-label>
            <q-item v-for="(ward,idx) in misc.wards" clickable @click="selectedWard(idx)" :key="'ws-'+idx">
              <q-item-section side>{{ idx+1 }}</q-item-section>
              <q-item-section>{{ ward.name }}</q-item-section>
            </q-item>
          </q-list>
        </template>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {onMounted, reactive} from "vue";
import { signInWithPhoneNumber,RecaptchaVerifier } from 'firebase/auth'
import {auth} from "assets/scripts/firebase-auth";
import {user} from "assets/scripts/firebase-database";
import {sGet} from "assets/scripts/helpers";


const login = reactive({ phone:9495155550,code:null })
const misc = reactive({ loading:false,code:false,status:'',error:false,error2:false,wards:[] })
const collection = reactive({ uid:'',phone:'',name:'',ward:'',link:'',masters:{},head:[],list:[],progress:[] })

onMounted(() => {
  window.recaptchaVerifier = new RecaptchaVerifier("container", {
    'size': 'invisible',
  }, auth)
})
function getCode(){
  misc.loading = true; misc.status = 'Sending OTP to phone number!'
  signInWithPhoneNumber(auth,'+91' + login.phone,window.recaptchaVerifier).then((confirmationResult) => {
    window.confirmationResult = confirmationResult;
    misc.status = 'OTP Send successfully, Please enter Code'
    misc.code = true; misc.loading = false;
  }).catch((error) => {
    misc.status = "Error in sending SMS.. Try again later..";
    misc.loading = false;
  });
}
function signIn(){
  misc.loading = true; misc.status = ''
  window.confirmationResult.confirm(login.code)
    .then(loggedIn)
    .catch(err => {
      misc.status = 'The code entered seems invalid. Please try again'
      misc.loading = false;
    })
}
function reload(){ location.reload() }
function loggedIn({ user:{ uid,phoneNumber } }){
  misc.status = "Login Success, getting User details and wards.."
  user(uid).then(({ name,wards }) => {
    misc.status = "User details fetched successfully.."
    collection.uid = uid; collection.phone = phoneNumber;
    collection.name = name;
    misc.wards = wards;
    if(wards.length === 1) selectedWard(0)
    else {
      misc.status += " Select ward.."
      misc.loading = false;
    }
  }).catch((reason) => {
    misc.status = "Error getting details: " + reason
    misc.loading = false;
  })
}
function selectedWard(idx){
  let { name,url,master } = misc.wards[idx];
  collection.ward = name; collection.link = url; collection.masters = master
  misc.status += (' Fetching voters list of ' + name)
  sGet(collection.link,{ action:'list' }).then(records => {
    misc.status = "Received Voter List.."
    collection.head = records.head;
    collection.list = records.list
    collection.progress = ['ID','Status','Campaigns',...collection.masters.party,...collection.masters.relation,'Time']
    storeData()
  }).catch(() => {
    misc.status = "Error while fetching Voter List.."
    misc.loading = false;
  })
}

function storeData(){
  localStorage.setItem('eci_cadre',JSON.stringify(collection))
  misc.status += " Redirecting..."
  location.reload();
  misc.loading = false;
}
</script>
