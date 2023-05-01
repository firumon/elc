<template>
  <q-btn-toggle v-model="relation" toggle-color="secondary" :options="relationOptions" padding="lg xs" spread size="sm" />
  <q-list v-if="voter.NAME" separator dense>
    <q-item v-for="rName in cadreStore.masters.relation" :key="'VR-'+rName">
      <q-item-section>{{ rName }}</q-item-section>
      <q-item-section side>{{ Progress[rName] || ' ' }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import {computed} from "vue";
import {filter, includes, map} from "lodash";
import {useProgressStore} from "stores/progress";
import {useCadreStore} from "stores/cadre";
import {useSyncStore} from "stores/sync";

const props = defineProps(['voter'])
const progressStore = useProgressStore()
const cadreStore = useCadreStore()
const syncStore = useSyncStore()

const cadreName = computed(() => cadreStore.name)
const Voter = computed(() => props.voter)
const Progress = computed(() => progressStore.progress[Voter.value.ID] || {})
const relationOptions = computed(() => map(cadreStore.masters.relation,state => ({ label:state,value:state })).concat([{label:'Unknown',value:'Unknown'}]))
const relation = computed({
  get(){
    if(Progress.value.ID){
      let relations = cadreStore.masters.relation;
      for(let i=0; i<relations.length; i++){
        let relate = relations[i], rNames = ', ' + Progress.value[relate] + ',';
        if(includes(rNames,', ' + cadreName.value + ',')) return relate;
      }
    }
    return 'Unknown'
  },
  set(relate){
    progressStore.updateProgress(Voter.value.ID,relate,cadreName.value)
    syncStore.relate(Voter.value.ID,relate)
    console.log(relate)
  }
})
</script>
