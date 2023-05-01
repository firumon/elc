<template>
  <q-card class="text-center cursor-pointer" flat square bordered @click="navigate">
    <q-card-section><q-icon name="people" size="sm" /></q-card-section>
    <q-card-actions align="center" class="bg-grey-3">{{ props.label }}</q-card-actions>
  </q-card>
</template>

<script setup>
import {useRouter} from "vue-router";

const router = useRouter()
const props = defineProps(['route','label'])

function navigate(){
  router.push({ name:props.route })
}
</script>
