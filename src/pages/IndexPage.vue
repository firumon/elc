<template>
  <q-page class="flex flex-center">
    Dashboard
<!--    <template v-if="!cadreStore.synced">
      <img alt="ELC Logo" src="~assets/logo512.png" style="width: 45%">
      <div v-if="misc.error">
        <div class="text-primary text-caption text-bold">The user is not confirmed or no wards added, Please contact administrator..</div>
        <q-btn label="Logout" color="warning" padding="sm xl" @click="cadreStore.signOut()" />
      </div>
      <ChooseWard />
    </template>
    <template v-else>
      <div>Ready for dashboard!!</div>
    </template>-->
  </q-page>
</template>

<script setup>
import {useCadreStore} from "stores/cadre";
import ChooseWard from "components/ChooseWard.vue";
import {auth} from "assets/scripts/firebase-auth";
import {reactive} from "vue";


const cadreStore = useCadreStore()
const misc = reactive({ error:false,loading:false })

auth.onAuthStateChanged(user => {
  if(!user) return cadreStore.signOut()
  doSignIn({ user })
})
function doSignIn(confirm){
/*
  cadreStore.signIn(confirm).then((wards) => {
    misc.loading = false;
  }).catch(() => {
    misc.loading = false; misc.error = true;
  });
*/
}
function reload(){ location.reload() }

</script>
