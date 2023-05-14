<template>
  <q-card flat square>
    <q-card-section horizontal class="justify-center items-end text-center text-bold text-caption">
      <q-card-section class="q-px-sm"><img :src="'images/up'+(UpDown['up']>49?'n':'s')+'.png'" class="block q-mb-sm" />{{ UpDown['up'] }}%</q-card-section>
      <q-card-section class="q-px-sm"><img :src="'images/dwn'+(UpDown['up']<50?'n':'s')+'.png'" class="block q-mb-sm" />{{ UpDown['down'] }}%</q-card-section>
    </q-card-section>
    <q-card-section class="bg-grey-2 text-center text-caption text-grey-5 q-py-xs text-uppercase" style="font-size: 0.65rem">Active Voters: {{ ActiveVoters }}, SDPI Voters: {{ SDPIVoters }} ({{ progressStore.relation ?. Member ?. length || 0 }} Members)</q-card-section>
  </q-card>
</template>

<script setup>
import {useProgressStore} from "stores/progress";
import {computed} from "vue";
import {intersection} from "lodash";

const progressStore = useProgressStore()
const ActiveVoters = computed(() => progressStore.status['Active'].length)
const SDPIVoters = computed(() => intersection(progressStore.party_voters['SDPI'],progressStore.status['Active']) ?. length || 0)
const UpDown = computed(() => ({
  up:(SDPIVoters.value/ActiveVoters.value*100).toFixed(2),
  down:((ActiveVoters.value-SDPIVoters.value)/ActiveVoters.value*100).toFixed(2),
}))
</script>
