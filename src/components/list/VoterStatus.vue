<template>
    <q-btn-toggle v-model="status" toggle-color="secondary" :options="statusOptions" padding="md" spread size="sm" />
</template>

<script setup>
import {computed} from "vue";
import {map} from "lodash";
import {useProgressStore} from "stores/progress";
import {useCadreStore} from "stores/cadre";
import {useSyncStore} from "stores/sync";

const props = defineProps(['voter'])
const progressStore = useProgressStore()
const cadreStore = useCadreStore()
const syncStore = useSyncStore()

const statusOptions = computed(() => [{ label:'Active',value:'Active' }].concat(map(cadreStore.masters.status,state => ({ label:state,value:state }))))
const status = computed({
  get(){ return progressStore.progress?.[props.voter.ID]?.Status || 'Active' },
  set(state){
    progressStore.updateProgress(props.voter.ID,'Status',state)
    syncStore.status(props.voter.ID,state)
  }
})
</script>
