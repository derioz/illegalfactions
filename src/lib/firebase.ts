import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCqOui8tRO3QqqtVmNLQEbCfv1m8Rr4Jdc",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "illegalfactions-6a5e8.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "illegalfactions-6a5e8",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "illegalfactions-6a5e8.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "297012692028",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:297012692028:web:28c37b8ca8ffc30708ef39",
    measurementId: "G-R36R3KSW2R",
};

// Initialize Firebase (prevent multiple initializations)
let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let storage: FirebaseStorage | undefined;

function getFirebaseApp(): FirebaseApp | undefined {
    if (typeof window === 'undefined') return undefined;

    if (!app && getApps().length === 0) {
        // Only initialize if we have config
        if (firebaseConfig.apiKey) {
            app = initializeApp(firebaseConfig);
        }
    } else if (!app) {
        app = getApps()[0];
    }

    return app;
}

export function getFirebaseDb(): Firestore | undefined {
    const firebaseApp = getFirebaseApp();
    if (!firebaseApp) return undefined;

    if (!db) {
        db = getFirestore(firebaseApp);
    }
    return db;
}

export function getFirebaseAuth(): Auth | undefined {
    const firebaseApp = getFirebaseApp();
    if (!firebaseApp) return undefined;

    if (!auth) {
        auth = getAuth(firebaseApp);
    }
    return auth;
}

export function getFirebaseStorage(): FirebaseStorage | undefined {
    const firebaseApp = getFirebaseApp();
    if (!firebaseApp) return undefined;

    if (!storage) {
        storage = getStorage(firebaseApp);
    }
    return storage;
}

export { app, db, auth, storage };
