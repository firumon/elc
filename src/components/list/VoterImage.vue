<template>
    <div v-if="part_has_image">&nbsp;</div>
</template>

<script setup>
import {computed} from "vue";
import {useListStore} from "stores/list";

const listStore = useListStore()
const props = defineProps(['part','serial'])

const part_has_image = computed(() => listStore.image_parts.includes(props.part))
const image = computed(() => listStore.images[props.part])
const backImage = computed(() => 'url("'+image.value+'")')
const height = computed(() => (listStore.width * 0.1888040201005025) + 'px')
const width = computed(() => (parseFloat(height.value) * 0.8191489361702128) + 'px')
const offset = computed(() => listStore.width - parseFloat(width.value))
const PosX = computed(() => (0-(offset.value + (((props.serial-1)%2) * listStore.width))) + 'px')
const PosY = computed(() => (0-(Math.floor((props.serial-1)/2)) * parseFloat(height.value)) + 'px')
</script>

<style scoped>
div {
  height: v-bind(height); width: v-bind(width);
  background-repeat: no-repeat;
  background-image: v-bind(backImage);
  background-position-x: v-bind(PosX);
  background-position-y: v-bind(PosY);
  transition: all 0.1s ease-in-out;
}
</style>
