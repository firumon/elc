<template>
  <q-item clickable @click="navigate" v-ripple>
    <q-item-section avatar>
      <VoterImage :serial="SERIAL" :part="PART" />
    </q-item-section>
    <q-item-section>
      <q-item-label caption>{{ PART }}/{{ SERIAL }} &nbsp; &nbsp; {{ ID }}</q-item-label>
      <q-item-label>{{ NAME }} ({{ AGE }}), {{ RELATION }}</q-item-label>
      <q-item-label v-if="PHONE" caption class="text-black">{{ PHONE }}</q-item-label>
      <q-item-label caption>{{ HOUSE }}/{{ ADDRESS }}</q-item-label>
      <q-item-label caption>Status: {{ progress ?. Status || 'Active' }}, Campaigns: {{ progress ?. Campaigns || 0 }}</q-item-label>
    </q-item-section>
    <q-item-section side><q-btn icon="forward" color="primary" rounded flat dense /></q-item-section>
  </q-item>
</template>

<script setup>
import {useRouter} from "vue-router";
import VoterImage from "components/list/VoterImage.vue";
import {useProgressStore} from "stores/progress";
import {computed} from "vue";
import {get} from "lodash";

const props = defineProps(['ID','NAME','RELATION','AGE','GENDER','HOUSE','ADDRESS','PART','SERIAL','PHONE'])
const router = useRouter(), pStore = useProgressStore()
const progress = computed(() => get(pStore.progress,props.ID))
function navigate(){
  router.push({ name:'voters',params:{ voterId:props.ID } })
}
</script>
