import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { USE_MOCK_API } from "@/mocks/mockConfig";

const envFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const mockFirebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "agrifert-mock.firebaseapp.com",
  projectId: "agrifert-mock",
  storageBucket: "agrifert-mock.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:agrifertmock",
};

const firebaseConfig = USE_MOCK_API ? mockFirebaseConfig : envFirebaseConfig;

if (!USE_MOCK_API && !firebaseConfig.apiKey) {
  console.warn(
    "Missing Firebase environment variables. Set VITE_FIREBASE_* or enable mock mode."
  );
}

const firebaseApp = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(firebaseApp);

export default firebaseApp;
