<template>
  <FilterElement @search="FilterResults" @clear="resetResult" class="q-mb-md" />
  <q-list :dense="listStore.voter_images_exist && listStore.card">
    <component :is="component" v-bind="voter" v-for="voter in display" :key="voter.ID" />
  </q-list>
  <Paginate v-model="display" :items="voters" class="q-my-md" />
</template>

<script setup>
import FilterElement from "components/FilterElement.vue";
import {computed, reactive, ref, watch} from "vue";
import {filter, includes, join, map, mapValues, pick, size, slice, values} from "lodash";
import VoterListItem from "components/list/VoterListItem.vue";
import VoterListItemAvatar from "components/list/VoterListItemAvatar.vue";
import VoterListItemCard from "components/list/VoterListItemCard.vue";
import {useListStore} from "stores/list";
import Paginate from "components/Paginate.vue";

const listStore = useListStore()
const props = defineProps(['voters'])
const search = reactive({ text:'',active:false })
const component = computed(() => listStore.voter_images_exist ? (listStore.card ? VoterListItemCard : VoterListItemAvatar) : VoterListItem)
const voter_slugs = computed(() => mapValues(props.voters,voter => join(values(pick(voter,['NAME','HOUSE','RELATION','ADDRESS','ID','PART','SERIAL'])),' ').toLowerCase()))
const voters = computed(() => search.active ? filter(map(voter_slugs.value,(slug,ID) => includes(slug,search.text) ? props.voters[ID] : null)) : map(props.voters))
const display = ref([])
function FilterResults(text){
  search.text = String(text).trim().toLowerCase();
  search.active = search.text !== '';
}
function resetResult(){ FilterResults('') }
</script>

