<template>
  <q-card>
    <q-card-section class="text-h6 text-bold bg-grey-3">Add Campaign</q-card-section>
    <q-list dense>
      <q-item v-for="party in Parties">
        <q-item-section avatar>{{ party }}</q-item-section>
        <q-item-section><q-input type="number" :label="'S/'+PP(party,1)" v-model.number="Score[party]" outlined /></q-item-section>
        <q-item-section side><q-linear-progress style="width: 50vw" size="25px" :value="Scoring[party]" :color="PartyColors[party]" /></q-item-section>
      </q-item>
    </q-list>
    <q-card-actions align="right" class="bg-grey-3">
      <span v-show="TotalScore!==10" class="text-caption">Total points given should be 10</span><q-space />
      <q-btn label="Submit" color="teal" padding="sm xl" :disable="TotalScore!==10" :loading="loading" @click="addCampaign" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import {useProgressStore} from "stores/progress";
import {computed, reactive, ref} from "vue";
import {useCadreStore} from "stores/cadre";
import {PartyColors} from "assets/scripts/constants";
import {mapKeys, mapValues, sum, values} from "lodash";
import {useSyncStore} from "stores/sync";

const props = defineProps(['voter'])

const progressStore = useProgressStore()
const cadreStore = useCadreStore()
const syncStore = useSyncStore()

const Score = reactive({ }), loading = ref(false)
const Parties = computed(() => cadreStore.masters.party)
const Progress = computed(() => progressStore.progress ?. [props.voter.ID] || {})
const Scoring = computed(() => mapValues(mapKeys(Parties.value),party => (PP(party,0.1) + Score[party]/10)))
const TotalScore = computed(() => sum(values(Score)))

Parties.value.forEach(P => Score[P] = 0)
function PP(P,M){ return (Progress.value[P] || 0) * M }
function addCampaign(){
  loading.value = true;
  progressStore.addCampaign(props.voter.ID,Score)
  syncStore.addCampaign(props.voter.ID,Score)
  setTimeout(() => {
    Parties.value.forEach(P => Score[P] = 0)
    loading.value = false
  },2500)
}
</script>
