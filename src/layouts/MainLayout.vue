<template>
  <q-layout view="hHr lpR fFr">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title style="font-size: 1rem" class="text-weight-bold">{{ appStore.title(route.name) || route.meta.title || cadreStore.ward}}</q-toolbar-title>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleRightDrawer"/>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="right" elevated>
      <Menu />
      <div class="full-width">
        <div class="text-center text-caption text-grey-6" style="font-size: 10px">VERSION. {{ version }}</div>
        <q-btn label="Logout" class="full-width" color="warning" padding="md xl" square @click="signOut" />
      </div>
      <q-inner-loading :showing="loading"><q-spinner-gears color="warning" size="128px" /></q-inner-loading>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {ref} from "vue";
import {useCadreStore} from "stores/cadre";
import {useListStore} from "stores/list";
import {useProgressStore} from "stores/progress";
import {useSyncStore} from "stores/sync";
import { version } from './../../package.json'
import Menu from "components/menu/Menu.vue";
import {useRoute} from "vue-router";
import {useAppStore} from "stores/app";

const route = useRoute()
const appStore = useAppStore()
const cadreStore = useCadreStore()
const listStore = useListStore()
const progressStore = useProgressStore()
const syncStore = useSyncStore()

const rightDrawerOpen = ref(false), loading = ref(false)
function toggleRightDrawer(){ rightDrawerOpen.value = !rightDrawerOpen.value }

if(!cadreStore.logged) cadreStore.init()
if(!listStore.ready) listStore.init()
if(!cadreStore.synced) cadreStore.getProgress()

function signOut(){
  loading.value = true;
  cadreStore.signOut();
}
</script>
