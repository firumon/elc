<template>
  <q-list>
    <q-item v-for="(percent,party) in PartyPercent" :key="party">
      <q-item-section avatar class="text-bold" :class="'text-'+PartyColors[party]">{{ party }}</q-item-section>
      <q-item-section><q-item-label><q-linear-progress :value="percent/100" size="2.5rem" :color="PartyColors[party]" /></q-item-label></q-item-section>
      <q-item-section side style="width: 3.5rem;" class="text-left text-bold">{{ (percent || 100).toFixed(2) }}%</q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import {useProgressStore} from "stores/progress";
import {computed} from "vue";
import {PartyColors} from "assets/scripts/constants";


const progressStore = useProgressStore()
const PartyPercent = computed(() => progressStore.party_percent)
</script>
