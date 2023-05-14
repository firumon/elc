<template>
  <q-page padding class="q-gutter-y-md">
    <SDPIUpDown />
    <StatusCountMetric />
    <div class="bg-grey-2 text-center text-caption text-grey-5 q-py-xs text-uppercase" style="font-size: 0.65rem">Party wise point percentage from done campaigns</div>
    <PartyPercentChart dense separator />
    <RelationCountMetric />
    <div class="bg-grey-2 text-center text-caption text-grey-5 q-py-xs text-uppercase" style="font-size: 0.65rem">SDPI voters from your relations</div>
    <RelationCampaignChart dense separator />
    <PartyVotersMetric />
  </q-page>
</template>

<script setup>
import {useProgressStore} from "stores/progress";
import SDPIUpDown from "components/widgets/SDPIUpDown.vue";
import PartyPercentChart from "components/widgets/PartyPercentChart.vue";
import StatusCountMetric from "components/widgets/StatusCountMetric.vue";
import RelationCountMetric from "components/widgets/RelationCountMetric.vue";
import RelationCampaignChart from "components/widgets/RelationCampaignChart.vue";
import PartyVotersMetric from "components/widgets/PartyVotersMetric.vue";

const progressStore = useProgressStore()
</script>
