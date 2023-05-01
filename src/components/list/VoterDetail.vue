<template>
  <q-card square flat>
    <q-card-section class="bg-grey-3 text-bold flex justify-between items-center">
      <div class="text-h6 text-weight-bold">{{ voter.NAME || '--no voter--' }}</div>
      <div v-if="voter.NAME"><q-icon :name="gender[voter.GENDER]" size="sm" />/ {{ voter.AGE }}</div>
    </q-card-section>
    <q-list dense v-if="voter.NAME">
      <q-item>
        <q-item-section side><q-icon name="supervisor_account" color="secondary" /></q-item-section>
        <q-item-section><q-item-label>{{ voter.RELATION }}</q-item-label></q-item-section>
        <q-item-section side v-if="relation && relation.SERIAL"><q-btn :label="relation.SERIAL" round dense flat color="secondary" class="text-bold" @click="$emit('to',relation.SERIAL)" /></q-item-section>
      </q-item>
      <q-item>
        <q-item-section side><q-icon name="home" color="secondary" /></q-item-section>
        <q-item-section>
          <q-item-label>{{ voter.HOUSE }} / {{ voter.ADDRESS }}</q-item-label>
          <q-item-label caption>{{ voter.PART }}/{{ voter.SERIAL }} - {{ voter.ID }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script setup>
import {computed} from "vue";
import {useListStore} from "stores/list";
import {find} from "lodash";

const props = defineProps(['voter'])
const emits = defineEmits(['to'])
const gender = { M:'man',F:'woman' }
const listStore = useListStore()
const relation = computed(() => {
  let part = parseInt(props.voter.PART), serial = parseInt(props.voter.SERIAL), Relation = props.voter.RELATION.toLowerCase();
  let min = (serial - 10) < 1 ? 1 : serial - 10, max = serial + 10, list = listStore.parts[part].slice(min,max);
  return find(list,({ NAME }) => NAME.toLowerCase() == Relation)
  || find(list,({ HOUSE,AGE }) => HOUSE == props.voter.HOUSE && parseInt(AGE)>props.voter.AGE)
  || {}
})
</script>
