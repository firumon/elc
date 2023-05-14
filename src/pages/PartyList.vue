<template>
  <q-page padding>
    <FilterList :voters="voters" />
  </q-page>
</template>

<script setup>
import {useProgressStore} from "stores/progress";
import {computed,onUpdated} from "vue";
import {useListStore} from "stores/list";
import {filter, get, mapKeys, mapValues, toNumber} from "lodash";
import FilterList from "components/list/FilterList.vue";
import {useAppStore} from "stores/app";
import {useRoute} from "vue-router";

const props = defineProps(['party','type'])

const pStore = useProgressStore(), lStore = useListStore(), appStore = useAppStore(), route = useRoute();
const MinMax = computed(() => mapValues(route.query,toNumber))
const voters = computed(() => {
  let party = props.party
  return mapKeys(mapValues(filter(pStore.progress,progress => {
    let pPoint = progress[party];
    return (pPoint >= MinMax.value.min && pPoint < MinMax.value.max)
  }),({ ID }) => get(lStore.voters,ID)),'ID')
})

function setTitle(){ appStore.setTitle(props.party + ' Voters (' + props.type + ')',route.name) }
setTitle(); onUpdated(setTitle);
</script>
