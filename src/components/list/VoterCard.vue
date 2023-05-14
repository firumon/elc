<template>
    <div v-if="part_has_image">&nbsp;</div>
</template>

<script setup>
import {computed} from "vue";
import {useListStore} from "stores/list";

const props = defineProps(['part','serial'])
const listStore = useListStore()

const part_has_image = computed(() => listStore.image_parts.includes(props.part))
const image = computed(() => listStore.images[props.part])
const backImage = computed(() => 'url("'+image.value+'")')
const width = computed(() => '90vw')
const height = computed(() => (parseFloat(width.value) * 0.1888040201005025) + 'vw')
const PosX = computed(() => (0 - (((props.serial - 1) % 2) * parseFloat(width.value)) ) + 'vw')
const PosY = computed(() => (0-(Math.floor((props.serial-1)/2)) * parseFloat(height.value)) + 'vw')
</script>

<style scoped>
div {
  height: v-bind(height); width: v-bind(width);
  background-repeat: no-repeat;
  background-size: 200%;
  background-image: v-bind(backImage);
  background-position-x: v-bind(PosX);
  background-position-y: v-bind(PosY);
  transition: all 0.4s ease-in-out;
}
</style>
