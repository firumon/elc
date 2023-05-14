<template>
  <div class="flex justify-around" v-if="pages > 1" :class="{ 'absolute-bottom':(modelValue && modelValue.length < 5) }">
    <q-pagination v-model="page.page" :max="pages" max-pages="8" direction-links outline active-design="unelevated" active-text-color="white" :max-pages="page.maxP"/>
  </div>
</template>

<script setup>
import {computed, reactive, watch, watchEffect} from "vue";
import {size} from "lodash";
const props = defineProps(['items','modelValue'])
const emits = defineEmits(['update:modelValue'])
const page = reactive({ page:1,perPage:15 })

const pages = computed(() => Math.ceil(size(props.items)/page.perPage))
watch(() => page.page,emitResult)
watch(() => props.items, () => {
  page.page = 1;
  emitResult();
})
function emitResult(){
  emits('update:modelValue',props.items.slice((page.page-1)*page.perPage,page.page*page.perPage))
}
emitResult()
</script>
