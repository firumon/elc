<template>
  <div class="row q-col-gutter-x-xs">
    <div class="col" v-for="(voters,relate) in relation" :key="'rcm-'+relate">
      <q-card class="text-center shadow-0" square bordered>
        <q-card-section class="text-bold" :class="'text-'+RelationColors[relate]">{{ fromActive(voters) ?. length || 0 }}</q-card-section>
        <q-card-section :class="'bg-'+RelationColors[relate]" class="text-white q-py-xs text-caption text-uppercase text-bold">{{ relate }}</q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import {useProgressStore} from "stores/progress";
import {computed} from "vue";
import {RelationColors} from "assets/scripts/constants";
import {intersection, omit} from "lodash";

const progressStore = useProgressStore()
const active_voters = computed(() => progressStore.status ?. Active || [])
const relation = computed(() => omit(progressStore.relation,'Member'))
function fromActive(voters){ return intersection(active_voters.value,voters) }
</script>
