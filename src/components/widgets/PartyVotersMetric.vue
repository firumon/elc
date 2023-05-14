<template>
  <div class="row q-col-gutter-x-xs">
    <div class="col" v-for="(voters,party) in PartyVotersActive" :key="'pvm-'+party">
      <q-card class="text-center shadow-0" square bordered>
        <q-card-section class="text-bold" :class="'text-'+PartyColors[party]">{{ voters ?. length || 0 }}</q-card-section>
        <q-card-section :class="'bg-'+PartyColors[party]" class="text-white q-py-xs text-caption text-uppercase text-bold">{{ party }}</q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import {useProgressStore} from "stores/progress";
import {computed} from "vue";
import {intersection, mapValues} from "lodash";
import {PartyColors} from "assets/scripts/constants";

const progressStore = useProgressStore()
const ActiveVoters = computed(() => progressStore.status['Active'])
const PartyVoters = computed(() => progressStore.party_voters)
const PartyVotersActive = computed(() => mapValues(PartyVoters.value,voters => intersection(ActiveVoters.value,voters)))
</script>
