<template>
  <div class="flex items-center justify-between">
    <div class="col q-mr-sm"><q-input v-model="filter" outlined label="Filter" class="full-width" clearable @clear="$emit('clear')" /></div>
    <q-btn color="primary" icon="search" size="lg" @click="$emit('search',filter)" />
  </div>
</template>

<script setup>
import {ref} from "vue";

defineEmits(['clear','search'])
const filter = ref('')
</script>

