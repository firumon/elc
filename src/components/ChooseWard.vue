<template>
  <q-list class="full-width" separator>
    <q-item-label header class="text-bold bg-grey-3">Select Ward</q-item-label>
    <q-item v-for="(ward,idx) in cadreStore.wards" clickable @click="cadreStore.selectedWard(idx)" :key="'ws-'+idx">
      <q-item-section avatar>{{ idx+1 }}.</q-item-section>
      <q-item-section>{{ ward.name }}</q-item-section>
      <q-item-section side><q-icon name="forward" color="secondary" /></q-item-section>
    </q-item>
    <q-inner-loading :showing="misc.loading">
      <q-spinner-facebook size="xl" color="primary" />
    </q-inner-loading>
  </q-list>
</template>

<script setup>
import {useCadreStore} from "stores/cadre";
import {computed, reactive, watchEffect} from "vue";

const cadreStore = useCadreStore()

const misc = reactive({ loading:false })
const wards = computed(() => cadreStore.wards)
watchEffect(() => {
  if(wards.value.length === 1) {
    misc.loading = true
    cadreStore.selectedWard(0);
  }
})
</script>
