<template>
  <q-list>
    <q-item v-for="(dArray,relate) in metric" :key="'rcc-'+relate">
      <q-item-section avatar class="text-bold" :class="'text-'+RelationColors[relate]" style="width: 5rem">{{ relate }}</q-item-section>
      <q-item-section><q-linear-progress :color="RelationColors[relate]" size="2rem" :value="dArray[2] || 0" /></q-item-section>
      <q-item-section side style="width: 3rem">{{ dArray[1] || 0 }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import {useProgressStore} from "stores/progress";
import {computed} from "vue";
import {RelationColors} from "assets/scripts/constants";
import {filter, get, intersection, mapValues, omit} from "lodash";
import {useListStore} from "stores/list";

const progressStore = useProgressStore()
const listStore = useListStore()

const voters = computed(() => listStore.voters)
const relation = computed(() => omit(progressStore.relation,'Member'))
const active_voters = computed(() => progressStore.status ?. Active || [])

function fromActive(voters){ return intersection(active_voters.value,voters) }
function sdpiVoters(a_voters){ return filter(a_voters,voter => parseInt(get(voters.value,[voter,'SDPI']))>=5) }
const metric = computed(() => mapValues(relation.value,(voters,relate) => {
  let active = fromActive(voters), active_count = active ?. length || 0, sdpi = sdpiVoters(active), sdpi_count = sdpi ?. length || 0
  return [active_count,sdpi_count,parseFloat((sdpi_count/active_count).toFixed(2))]
}))
</script>
