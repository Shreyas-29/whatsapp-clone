import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB-8Se_JF4CmFzQrL03nZP6R8AauaZy7_M",
    authDomain: "whatsapp-68635.firebaseapp.com",
    projectId: "whatsapp-68635",
    storageBucket: "whatsapp-68635.appspot.com",
    messagingSenderId: "569522855973",
    appId: "1:569522855973:web:c6e078da468c0bba81dfcc"
};

const app = !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp();
const db = getFirestore();
const auth = getAuth();
const provider = new GoogleAuthProvider();

export default app;
export { db, provider, auth };
