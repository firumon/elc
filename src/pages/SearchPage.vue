<template>
  <q-page padding class="q-gutter-y-xs">
    <q-input square outlined v-model="search.NAME" label="Name" clearable  />
    <q-input square outlined v-model="search.RELATION" label="Relation Name" clearable />
    <q-input square outlined v-model="search.ADDRESS" label="Address" clearable />
    <q-input square outlined v-model="search.ID" label="Voter ID" clearable />
    <q-btn square class="full-width" color="secondary" label="Search" padding="md sm" @click="doSearch" />
    <q-inner-loading :showing="loading"><q-spinner-gears size="xl" /></q-inner-loading>
    <q-list class="q-mt-md">
      <q-item-label header class="bg-grey-4 flex justify-between"><div>Search Results</div><div>{{ results.length }}</div></q-item-label>
<!--      <q-intersection transition="flip-right">-->
        <q-item clickable @click="navigate(voter)" v-ripple v-for="voter in results" :key="voter.ID">
          <q-item-section side>
            <q-item-label>{{ voter.PART }}/{{ voter.SERIAL }}</q-item-label>
            <q-item-label caption>{{ voter.ID }}</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ voter.NAME }} ({{ voter.AGE }}), {{ voter.RELATION }}</q-item-label>
            <q-item-label caption>{{ voter.HOUSE }}/{{ voter.ADDRESS }}</q-item-label>
          </q-item-section>
          <q-item-section side><q-btn icon="forward" color="primary" rounded flat dense /></q-item-section>
        </q-item>
<!--      </q-intersection>-->
    </q-list>
  </q-page>
</template>

<script setup>
import {computed, reactive, ref} from "vue";
import {every, filter, includes, map, mapKeys, mapValues, trim} from "lodash";
import {useListStore} from "stores/list";
import {useRouter} from "vue-router";

const listStore = useListStore()
const router = useRouter()

const search = reactive({ NAME:'',RELATION:'',ADDRESS:'',ID:'' })
const criteria = computed(() => mapValues(mapKeys(filter(map(search,(val,key) => trim(val) === '' ? null : key))),key => search[key].toLowerCase()))

const results = ref([]), loading = ref(false)
function navigate({ ID }){
  router.push({ name:'voters',params:{ voterId:ID } })
}
function doSearch(){
  loading.value = true;
  results.value.splice(0,results.value.length)
  results.value.push(...filter(listStore.voters,voter => every(criteria.value,(val,key) => includes(voter[key].toLowerCase(),val))))
  loading.value = false;
}
</script>
