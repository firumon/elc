<template>
  <q-page padding class="q-gutter-y-xs">
    <q-input square outlined v-model="search.NAME" label="Name" clearable  />
    <q-input square outlined v-model="search.PHONE" label="Phone" clearable type="number" />
    <q-input square outlined v-model="search.RELATION" label="Relation Name" clearable />
    <q-input square outlined v-model="search.ADDRESS" label="Address" clearable />
    <q-input square outlined v-model="search.ID" label="Voter ID" clearable />
    <q-btn square class="full-width" color="secondary" label="Search" padding="md sm" @click="doSearch" />
    <q-inner-loading :showing="misc.loading"><q-spinner-gears size="xl" /></q-inner-loading>
    <q-list class="q-mt-md">
      <q-item-label header class="bg-grey-4 flex justify-between items-center"><div>Search Results</div><div>{{ misc.items.length }}</div></q-item-label>
      <component :is="component" v-bind="voter" v-for="voter in misc.results" :key="voter.ID" />
    </q-list>
    <Paginate v-model="misc.results" :items="misc.items" :key="misc.items.length" />
  </q-page>
</template>

<script setup>
import {computed, reactive} from "vue";
import {every, filter, includes, map, mapKeys, mapValues, trim} from "lodash";
import {useListStore} from "stores/list";
import VoterListItem from "components/list/VoterListItem.vue";
import VoterListItemAvatar from "components/list/VoterListItemAvatar.vue";
import VoterListItemCard from "components/list/VoterListItemCard.vue";
import Paginate from "components/Paginate.vue";

const listStore = useListStore()

const search = reactive({ NAME:'',PHONE:'',RELATION:'',ADDRESS:'',ID:'' })
const criteria = computed(() => mapValues(mapKeys(filter(map(search,(val,key) => trim(val) === '' ? null : key))),key => String(search[key]).toLowerCase()))
const component = computed(() => listStore.voter_images_exist ? (listStore.card ? VoterListItemCard : VoterListItemAvatar) : VoterListItem)
const misc = reactive({ results:[],loading:false,ready:false,items:[] })
function doSearch(){
  misc.items.splice(0,misc.items.length)
  if(search.ID || search.NAME || search.PHONE || search.ADDRESS || search.RELATION){
    misc.loading = true;
    misc.items.push(...filter(listStore.voters,voter => every(criteria.value,(val,key) => includes(String(voter[key]).toLowerCase(),val))))
    misc.loading = false;
  }
}
</script>
