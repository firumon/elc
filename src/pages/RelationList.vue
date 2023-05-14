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

const props = defineProps(['relation','type'])

const pStore = useProgressStore(), lStore = useListStore(), appStore = useAppStore(), route = useRoute();
const MinMax = computed(() => mapValues(route.query,toNumber))
const voters = computed(() => {
  //return mapValues(mapKeys(pStore.relation[props.relation]),ID => get(lStore.voters,ID));
  let IDs = props.type === 'Voters' ? pStore.relation[props.relation] : filter(pStore.relation[props.relation],ID => {
    let SDPI = get(pStore.progress,[ID,'SDPI']);
    return (SDPI >= MinMax.value.min && SDPI < MinMax.value.max)
  })
  return mapKeys(map(IDs,ID => get(lStore.voters,ID)),'ID')
})

function setTitle(){ appStore.setTitle(props.relation + ' Voters' + (props.type !== 'Voters' ? " (" + props.type + ")" : ''),route.name) }
setTitle(); onUpdated(setTitle);
</script>
