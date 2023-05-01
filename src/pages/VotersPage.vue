<template>
  <q-page class="q-gutter-y-sm q-py-sm">
    <PartSwitch v-model="misc.part" class="q-mx-sm" />
    <VoterChoose :part="misc.part" v-model="misc.serial" />
    <VoterDetail :voter="voter" @to="misc.serial = $event" />
    <VoterStatus :voter="voter" />
    <VoterRelations :voter="voter" />
    <VoterSummary :voter="voter" />
    <VoterCampaign :voter="voter" />
    <AddCampaign :voter="voter" />
  </q-page>
</template>

<script setup>
import {computed, reactive} from "vue";
import {useListStore} from "stores/list";
import PartSwitch from "components/list/PartSwitch.vue";
import VoterChoose from "components/list/VoterChoose.vue";
import VoterDetail from "components/list/VoterDetail.vue";
import VoterStatus from "components/list/VoterStatus.vue";
import {useRoute} from "vue-router";
import VoterRelations from "components/list/VoterRelations.vue";
import VoterSummary from "components/list/VoterSummary.vue";
import VoterCampaign from "components/list/VoterCampaign.vue";
import AddCampaign from "components/list/AddCampaign.vue";

const listStore = useListStore()
const route = useRoute()

const misc = reactive({ part:1,serial:1 })
const voter = computed(() => listStore.parts[misc.part][misc.serial] || {})

if(route.params.voterId) {
  let { PART,SERIAL } = listStore.voters[route.params.voterId] || { PART:1,SERIAL:1 }
  misc.serial = parseInt(SERIAL); misc.part = parseInt(PART)
}
</script>
