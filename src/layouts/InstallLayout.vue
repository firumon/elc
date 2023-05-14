<template>
  <q-layout view="hHr lpR fFr">
    <q-page-container>
      <q-page class="flex flex-center column">
        <img alt="ELC Logo" src="~assets/logo512.png" style="width: 200px; height: 200px">
        <div v-if="appInstalled" class="text-green text-bold text-center">App Installed in your Device. Close this and open Installed Application..</div>
        <q-btn label="Install ELC" color="secondary" padding="sm xl" v-else-if="isPwaInstallable" @click="prompt" />
        <div v-else class="text-red text-bold text-center">Sorry, your device doesn't support this application..</div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'InstallLayout',
  data(){ return {
    displayMode:null,
    event: null,
    userChoiceOutcome: null,
    isCustomPromptDismissed: false,
    appInstalled: false,
  } },
  computed: {
    isInPwaMode(){ return this.displayMode === 'standalone' },
    isCustomPromptVisible: {
      get(){ return this.event && !this.isCustomPromptDismissed },
      set(){ this.dismissCustomPrompt() },
    },
    isPwaInstallable(){ return this.event !== null }
  },
  methods: {
    async prompt(){ const userChoice = await this.event.prompt(); this.userChoiceOutcome = userChoice.outcome; },
    dismissCustomPrompt(){ this.isCustomPromptDismissed = true }
  },
  created(){
    let $vm = this, dMode = 'browser tab';
    window.addEventListener('beforeinstallprompt', (evt) => { evt.preventDefault(); $vm.event = evt; })
    window.matchMedia('(display-mode: standalone)').addListener((evt) => {
      if (evt.matches) { dMode = 'standalone' }
      this.displayMode = dMode;
    })
    if (navigator.standalone) { dMode = 'standalone-ios' }
    if (window.matchMedia('(display-mode: standalone)').matches) { dMode = 'standalone' }
    this.displayMode = dMode;
    window.addEventListener('appinstalled', () => {
      $vm.appInstalled = true;
    });
  }
})
</script>
