<template>
  <div class="row q-col-gutter-x-xs">
    <div class="col" v-for="(voters,state) in status" :key="'scm-'+state">
      <q-card class="text-center shadow-0" square bordered>
        <q-card-section class="text-bold" :class="'text-'+StatusColors[state]">{{ voters ?. length || 0 }}</q-card-section>
        <q-card-section :class="'bg-'+StatusColors[state]" class="text-white q-py-xs text-caption text-uppercase text-bold">{{ state }}</q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import {useProgressStore} from "stores/progress";
import {computed} from "vue";
import {StatusColors} from "assets/scripts/constants";

const progressStore = useProgressStore()
const status = computed(() => progressStore.status)
</script>
