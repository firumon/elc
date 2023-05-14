<template>
  <q-card class="text-center cursor-pointer" flat square bordered @click="navigate">
    <q-card-section>
      <q-img :src="image" width="24" height="24" v-if="image" />
      <span :class="'text-' + (color || 'black')" class="text-weight-bold text-h6" v-else-if="number !== undefined">{{ number }}</span>
      <q-icon :name="icon || 'people'" size="sm" :color="color" v-else />
    </q-card-section>
    <q-card-actions align="center" :class="'bg-'+(color || 'grey-3')+' text-'+(text || 'black')" class="text-weight-bold" style="font-size: 0.75rem">{{ props.label }}</q-card-actions>
  </q-card>
</template>

<script setup>
import {useRouter} from "vue-router";

const router = useRouter()
const props = defineProps(['route','label','params','icon','image','number','color','text','query'])

function navigate(){
  router.push({ name:props.route,params:props.params,query:props.query })
}
</script>
