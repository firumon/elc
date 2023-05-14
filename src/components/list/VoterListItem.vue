<template>
  <q-item clickable @click="navigate" v-ripple>
    <q-item-section>
      <q-item-label caption>{{ PART }}/{{ SERIAL }} - {{ ID }}</q-item-label>
      <q-item-label>{{ NAME }} ({{ AGE }}), {{ RELATION }}</q-item-label>
      <q-item-label caption>{{ HOUSE }}/{{ ADDRESS }}</q-item-label>
      <q-item-label caption v-if="PHONE">{{ PHONE }}</q-item-label>
    </q-item-section>
    <q-item-section side><q-btn icon="forward" color="primary" rounded flat dense /></q-item-section>
  </q-item>
</template>

<script setup>
import {useRouter} from "vue-router";

const props = defineProps(['ID','NAME','RELATION','AGE','GENDER','HOUSE','ADDRESS','PART','SERIAL','PHONE'])
const router = useRouter()
function navigate(){
  router.push({ name:'voters',params:{ voterId:props.ID } })
}
</script>
