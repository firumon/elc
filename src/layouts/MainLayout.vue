<template>
  <q-layout view="hHr lpR fFr">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>{{ route.meta.title || cadreStore.ward}}</q-toolbar-title>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleRightDrawer"/>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="right" elevated>
      <div class="row q-col-gutter-xs q-pa-xs">
        <div class="col-12 q-py-sm bg-grey-2"><q-btn color="secondary" class="full-width" icon="reply" label="home" flat @click="router.push({ name:'index' })" /></div>
        <div class="col-4" v-for="menu in filter(menus,['section','main'])" :key="'mm-'+menu.name">
          <MenuItem :label="menu.label" :route="menu.route" />
        </div>
      </div>
      <q-btn label="Logout" color="warning" padding="md xl" class="full-width absolute-bottom" square @click="cadreStore.signOut()" />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {computed, ref} from "vue";
import {useCadreStore} from "stores/cadre";
import MenuItem from "components/menu/MenuItem.vue";
import {useRoute,useRouter} from "vue-router";
import {filter, map} from "lodash";
import {useListStore} from "stores/list";
import {useProgressStore} from "stores/progress";
import {useSyncStore} from "stores/sync";

const route = useRoute(), router = useRouter()
const cadreStore = useCadreStore()
const listStore = useListStore()
const progressStore = useProgressStore()
const syncStore = useSyncStore()

const rightDrawerOpen = ref(false)
function toggleRightDrawer(){ rightDrawerOpen.value = !rightDrawerOpen.value }
const menus = computed(() => map(filter(router.getRoutes(),'meta.menu'),rRoute => new Object({ label:rRoute.meta.menu,route:rRoute.name,section:rRoute.meta.section })))

if(!cadreStore.logged) cadreStore.init()
if(!listStore.ready) listStore.init()
if(!cadreStore.synced) cadreStore.getProgress()
</script>
