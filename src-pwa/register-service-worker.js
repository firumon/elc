import { register } from 'register-service-worker'
// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  registrationOptions: { scope: './' },

  ready (/* registration */) {
    // console.log('Service worker is active.')
  },

  registered ( registration ) {
/*
    console.log('Service worker has been registered.');
    Notification.requestPermission().then(val => {
      console.log('SW.. Notification.requestPermission',{ val });
      if(val !== 'granted') return;
    })
    registration.active.addEventListener('message',SWMessage)
*/
  },

  cached (/* registration */) {
    // console.log('Content has been cached for offline use.')
  },

  updatefound (/* registration */) {
    // console.log('New content is downloading.')
  },

  updated (/* registration */) {
    // console.log('New content is available; please refresh.')
  },

  offline () {
    // console.log('No internet connection found. App is running in offline mode.')
  },

  error (err) {
    // console.error('Error during service worker registration:', err)
  }
})

/*function SWMessage(event){
  if(event && event.data && event.data.source && ["vue-devtools-backend","vue-devtools-proxy"].includes(event.data.source)) return;
  console.log('SWMessage',event)
  if(event.type === 'init') return event.ports[0].postMessage('getUpdates')
  if(notify) notify('SWNotify:...')
}*/
