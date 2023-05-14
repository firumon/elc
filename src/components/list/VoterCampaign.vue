<template>
  <q-card flat square>
    <q-table :rows="Campaigns" :columns="columns" row-key="Time" dense title="Campaigns" no-data-label="NO CAMPAIGNS YET" table-header-class="bg-grey-2 text-bold" :loading="misc.loading" hide-pagination :pagination="{ rowsPerPage:0 }" />
    <q-card-actions align="right" v-if="Progress.Campaigns > Campaigns.length" class="bg-grey-1">
      <q-btn label="Load More" icon="refresh" color="warning" @click="getCampaigns" :loading="misc.loading" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import {computed, reactive} from "vue";
import {useProgressStore} from "stores/progress";
import {difference} from "lodash";
import {useCadreStore} from "stores/cadre";

const progressStore = useProgressStore()
const cadreStore = useCadreStore()

const props = defineProps(['voter'])

const misc = reactive({ loading:false })

const Progress = computed(() => progressStore.progress ?. [props.voter.ID] || {})
const Campaigns = computed(() => progressStore.campaigns ?. [props.voter.ID] || [])
const Parties = computed(() => difference(cadreStore.masters.party,['SDPI']))

const columns = [
  { name:'date',label:'Date',field:'Time',format: val => val ? new Date(val).toDateString() : new Date().toDateString(),align:'left' },
  { name:'cadre',label:'Cadre',field:'Cadre',align:'left' },
  { name:'p1',label:'SDPI',field:'SDPI',align:'center' },
  ...Parties.value.map((p,idx) => ({ name:'p'+(idx+2),label:p,field:p,align:'center' }))
]
function getCampaigns(){
  misc.loading = true;
  progressStore.getCampaigns(props.voter.ID).then(() => {
    misc.loading = false
  })
}
</script>
