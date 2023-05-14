<template>
  <div class="row q-col-gutter-xs q-pa-xs">
    <div class="col-12 q-py-md q-px-lg bg-teal-4 text-bold text-white flex justify-between items-center"><div>{{ cadreStore.name }}</div><div v-if="listStore.voter_images_exist"><q-checkbox label="Card mode" v-model="listStore.card" dense color="primary" left-label /></div></div>
    <div class="col-xs-4 col-md-3" v-for="menu in filter(menus,['section','main'])" :key="'mm-'+menu.name"><MenuItem v-bind="menu" /></div>
    <MenuHead label="Status" />
    <div class="col-xs-4 col-md-3" v-for="(number,state) in status_menu" :key="'pm-'+state"><MenuItem :label="state" route="list_status" :number="number" :color="StatusColors[state]" text="white" :params="{ state }" /></div>
    <template v-for="relation in cadreStore.masters.relation" :key="'rm-'+relation">
      <MenuHead :label="relation" v-if="relation !== 'Member'" />
      <div v-if="relation !== 'Member'" class="col-xs-4 col-md-3" v-for="(props,label) in r_cat" :key="'rmc-'+label"><MenuItem :label="label" route="list_relation" :number="r_ext[relation] ?. [label] ?. length || 0" :color="props[2]" text="white" :params="{ relation:relation,type:label }" :query="{ min:props[0], max:props[1] }" /></div>
    </template>
    <MenuHead label="SDPI" />
    <div class="col-xs-4 col-md-3" v-for="(props,label) in sdpi_cat" :key="'sc-'+label"><MenuItem :label="label" route="list_sdpi" :number="sdpi_ext[label] ?. length || 0" :color="props[2]" text="white" :params="{ type:label }" :query="{ min:props[0],max:props[1] }" /></div>
    <MenuHead label="Parties" />
    <template v-for="party in cadreStore.masters.party" :key="'pm-'+party">
      <template v-for="(props,label) in p_cat" :key="'pmc-'+label" v-if="party !== 'SDPI'">
        <div class="col-xs-4 col-md-3"><MenuItem :label="party" route="list_party" :number="label" :params="{ party,type:label }" :query="{ min:props[0],max:props[1] }" :color="PartyColors[party]" text="white" /></div>
      </template>
    </template>
  </div>
</template>

<script setup>
import MenuHead from "components/menu/MenuHead.vue";
import MenuItem from "components/menu/MenuItem.vue";
import {StatusColors,PartyColors} from "assets/scripts/constants";
import {difference, filter, get, groupBy, keys, map, mapKeys, mapValues, omit, size} from "lodash";
import {useRoute, useRouter} from "vue-router";
import {computed} from "vue";
import {useCadreStore} from "stores/cadre";
import {useProgressStore} from "stores/progress";
import {useListStore} from "stores/list";

const route = useRoute(), router = useRouter()
const cadreStore = useCadreStore()
const progressStore = useProgressStore()
const listStore = useListStore()

const menus = computed(() => map(filter(router.getRoutes(),'meta.label'),rRoute => Object.assign({},rRoute.meta,{ route:rRoute.name })))
const status_menu = computed(() => mapValues(mapKeys(difference(cadreStore.masters.status,['Active'])),state => progressStore.status ?. [state] ?. length || 0))

const r_cat = {'Voters':[0,0,'teal'],'50+':[5,11,'green'],'35-50':[3.5,5,'lime'],'20-35':[2,3.5,'red-3'],'0-20':[0,2,'grey-5']}
const r_ext = computed(() => mapValues(progressStore.relation,(voters,relation) => {
  let Grouped = groupBy(voters,voter_id => {
    let { SDPI } = VP(voter_id);
    for (let x in r_cat)
      if(SDPI >= r_cat[x][0] && SDPI < r_cat[x][1])
        return x;
  })
  Grouped['Voters'] = progressStore.relation[relation];
  return Grouped;
}))

const sdpi_cat = { 'Members':[0,0,'secondary'],'50+':[5,11,'green-13'],'40-50':[4,5,'light-green-7'],'30-40':[3,4,'lime-6'],'20-30':[2,3,'blue-grey-6'],'10-20':[1,2,'brown-6'],'0-10':[0,1,'grey-5'] }
const sdpi_ext = computed(() => {
  let Grouped = groupBy(progressStore.progress,({ SDPI }) => {
    for (let x in sdpi_cat)
      if(SDPI >= sdpi_cat[x][0] && SDPI < sdpi_cat[x][1])
        return x;
  })
  Grouped['Members'] = progressStore.relation['Member'];
  return Grouped;
})

const p_cat = {'75+':[7.5,11],'50+':[5,7.5],'20+':[2,5]}
function VP(ID){ return get(progressStore.progress,ID) }
</script>


