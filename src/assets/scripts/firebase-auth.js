import { app } from './firebase'
import { getAuth,signOut as fSignOut } from "firebase/auth";

export const auth = getAuth(app);

export const signOut = function () { return new Promise(resolve => fSignOut(auth).then(resolve)) }
