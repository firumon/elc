<template>
    <q-btn-toggle v-model="value" toggle-color="primary" :options="options" spread />
</template>

<script setup>
import {useListStore} from "stores/list";
import {computed} from "vue";
import {filter, map} from "lodash";

const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue'])
const listStore = useListStore()

const options = computed(() => filter(map(listStore.parts,(voters,part) => ({ label:'Part '+part+' ('+(voters.length ? voters.length-1 : 0)+' Voters)',value:part,count:voters.length ? voters.length-1 : 0 })),'count'))

const value = computed({
  get(){ return props.modelValue },
  set(part){ emits('update:modelValue',parseInt(part)) }
})
</script>
