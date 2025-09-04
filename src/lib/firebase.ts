import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'careerai-vx48i',
  appId: '1:627208996802:web:4742ab9e8cb0218c8af85b',
  storageBucket: 'careerai-vx48i.firebasestorage.app',
  apiKey: 'AIzaSyC-rIYgGGU_Qeco55OnAx--aKmPPG6IMhM',
  authDomain: 'careerai-vx48i.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '627208996802',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
