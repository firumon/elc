<template>
  <q-page padding>
    <FilterList :voters="voters" />
  </q-page>
</template>

<script setup>
import {useProgressStore} from "stores/progress";
import {computed,onUpdated} from "vue";
import {useListStore} from "stores/list";
import {filter, get, map, mapKeys, mapValues, toNumber} from "lodash";
import FilterList from "components/list/FilterList.vue";
import {useAppStore} from "stores/app";
import {useRoute} from "vue-router";

const props = defineProps(['type'])

const pStore = useProgressStore(), lStore = useListStore(), appStore = useAppStore(), route = useRoute();
const MinMax = computed(() => mapValues(route.query,toNumber))
const voters = computed(() => {
  if(props.type === 'Members') return mapValues(mapKeys(pStore.relation.Member),vId => get(lStore.voters,vId))
  return mapValues(mapKeys(filter(pStore.progress,({ SDPI }) => SDPI >= MinMax.value.min && SDPI < MinMax.value.max),'ID'),({ ID }) => get(lStore.voters,ID))
})

function setTitle(){ appStore.setTitle(props.type === 'Member' ? 'SDPI Members' : ('Voters, SDPI Score: ' + props.type),route.name) }
setTitle(); onUpdated(setTitle);
</script>
