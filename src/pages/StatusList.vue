<template>
  <q-page padding>
    <FilterList :voters="voters" />
  </q-page>
</template>

<script setup>
import {useProgressStore} from "stores/progress";
import {computed,onUpdated} from "vue";
import {useListStore} from "stores/list";
import {map, mapKeys} from "lodash";
import FilterList from "components/list/FilterList.vue";
import {useAppStore} from "stores/app";
import {useRoute} from "vue-router";

const props = defineProps(['state'])

const pStore = useProgressStore(), lStore = useListStore(), appStore = useAppStore(), route = useRoute();
const voters = computed(() => mapKeys(map(pStore.status[props.state],vId => lStore.voters[vId]),'ID'))

function setTitle(){ appStore.setTitle(props.state === 'Shift' ? 'Shifted Voters' : (props.state + ' Voters'),route.name) }
setTitle(); onUpdated(setTitle);
</script>
