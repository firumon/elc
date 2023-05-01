import { app } from './firebase'
import { getMessaging,getToken } from "firebase/messaging";
export const messaging = getMessaging(app);
getToken(messaging, { vapidKey: 'BPUUjCo6_kkeCKW5bAAoR0NUGYRKoMI2zhse5KVS6F-TjdgMdSl2aqZtJyofGLyi-AnikylB_qWl3Rpp7mKOdO4' }).then((currentToken) => {
  if (currentToken) {
    // Send the token to your server and update the UI if necessary
    // ...
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    requestPermission()
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});
function requestPermission() {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    }
  })
}
