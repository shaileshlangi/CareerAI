import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let serviceAccount: admin.ServiceAccount | null = null;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } else {
    console.warn("Firebase Admin SDK service account key is not set in environment variables. Server-side Firebase features will not work.");
  }
} catch (e) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Make sure it is a valid JSON string.', e);
    serviceAccount = null;
}


if (!getApps().length) {
  if (serviceAccount) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: serviceAccount.project_id,
        });
    } catch (e) {
        console.error("Firebase Admin SDK initialization failed.", e)
    }
  } else {
    // This will run if the key is missing or parsing failed.
    // It initializes a dummy app to prevent some crashes, but server-side auth/DB will fail.
    admin.initializeApp();
  }
}

const adminAuth = getAuth();
const adminDb = getFirestore();

export { adminAuth, adminDb };
