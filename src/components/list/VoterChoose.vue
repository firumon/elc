<template>
  <div class="fit row no-wrap q-col-gutter-x-xs justify-between">
    <div class="text-right"><q-btn icon="remove" color="secondary" round size="lg" @click="voter(-1)" @dblclick="voter(-5)" /></div>
    <div class="col-sm-grow"><q-input type="number" outlined input-class="text-center text-bold text-secondary text-h4" v-model="value" color="secondary" /></div>
    <div class="text-left"><q-btn icon="add" color="secondary" round size="lg" @click="voter(1)" @dblclick="voter(5)" /></div>
  </div>
</template>

<script setup>
import {useListStore} from "stores/list";
import {computed, reactive, ref} from "vue";
import {filter, map} from "lodash";

const props = defineProps(['modelValue','part'])
const emits = defineEmits(['update:modelValue'])
const listStore = useListStore()

const parts = computed(() => listStore.parts)
const voters = computed(() => parts.value[props.part])
const max = computed(() => voters.value.length ? voters.value.length-1 : 0)

const value = computed({
  get(){ return props.modelValue },
  set(val){ emits('update:modelValue',parseInt(val)) }
})
function voter(pos){
  let s = parseInt(props.modelValue) + parseInt(pos), t = max.value;
  emits("update:modelValue",s > t ? 1 : (s < 1 ? t : s))
}
</script>
