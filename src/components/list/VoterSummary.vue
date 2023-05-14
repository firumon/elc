<template>
  <q-card square flat>
    <q-card-section horizontal>
      <q-card-section class="col-shrink">
        <q-circular-progress :angle="cp_angle" :value="PP('SDPI',10)" :min="cp.min" :max="cp.max" :size="cp.size" :thickness="cp.thick" color="secondary" center-color="primary" class="text-white text-bold" show-value track-color="green-1" />
      </q-card-section>
      <q-card-section class="col-grow q-gutter-y-md">
        <q-linear-progress v-for="party in Parties" :key="'VSM-P'+party" size="25px" stripe :value="PP(party,0.1)" :color="PartyColors[party]">
          <div class="absolute-full flex justify-start">
            <q-badge :text-color="'white'" :label="party + ': ' + PP(party,10) + '%'" color="transparent" />
          </div>
        </q-linear-progress>
      </q-card-section>
    </q-card-section>
  </q-card>

</template>

<script setup>
import {computed, reactive} from "vue";
import {useProgressStore} from "stores/progress";
import {useCadreStore} from "stores/cadre";
import {difference} from "lodash";
import {PartyColors} from "assets/scripts/constants";

const props = defineProps(['voter'])

const progressStore = useProgressStore()
const cadreStore = useCadreStore()

const Progress = computed(() => progressStore.progress[props.voter.ID] || {})
const Parties = computed(() => difference(cadreStore.masters.party,['SDPI']))

const cp = reactive({ min:0,max:100,size:'150px',thick:0.4})
const cp_angle = computed(() => 360 * (1 - (PP('SDPI',5/cp.max))))

function PP(P,M){ return (Math.round(Progress.value[P]) || 0) * M }
</script>
