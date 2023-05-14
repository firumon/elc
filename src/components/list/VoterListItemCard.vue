<template>
  <q-item clickable @click="navigate" v-ripple>
    <q-item-section>
      <q-item-label><VoterCard :part="PART" :serial="SERIAL" /></q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import {useRouter} from "vue-router";
import VoterImage from "components/list/VoterImage.vue";
import VoterCard from "components/list/VoterCard.vue";

const props = defineProps(['ID','NAME','RELATION','AGE','GENDER','HOUSE','ADDRESS','PART','SERIAL','PHONE'])
const router = useRouter()
function navigate(){
  router.push({ name:'voters',params:{ voterId:props.ID } })
}
</script>
