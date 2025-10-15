
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
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

// This function will be called from the AuthProvider
let app: FirebaseApp;
const initializeClientApp = () => {
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }
    return app;
}

// We are not exporting the initialized app directly anymore.
// We will get them from the provider.
export { initializeClientApp, firebaseConfig };
