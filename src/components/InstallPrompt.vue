<template>
  <q-card v-if="!isInPwaMode">
    <q-bar class="bg-primary text-white q-py-lg">
      <q-icon name="install_mobile"/>
      <div>Install Smart Kitchen</div>
      <q-space/>
      <q-btn dense flat icon="close" v-close-popup>
        <q-tooltip>Close</q-tooltip>
      </q-btn>
    </q-bar>
    <q-card-section>
      Install Smart Kitchen to your device and feel the seamless experience. Smart Kitchen icon will be added to your Desktop/Home Screen
    </q-card-section>
    <q-separator/>
    <q-card-actions align="right">
      <q-btn flat label="Install" color="primary" v-close-popup @click="prompt"/>
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
	name: 'InstallPrompt',
	data(){ return {
		displayMode:null,
		event: null,
		userChoiceOutcome: null,
		isCustomPromptDismissed: false
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
	}
}
</script>
