// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBybKSNvPfi81CIlY4loeo6AjTR8qnAxSk",
  authDomain: "ahs-mapavailability.firebaseapp.com",
  projectId: "ahs-mapavailability",
  storageBucket: "ahs-mapavailability.appspot.com",
  messagingSenderId: "215563302397",
  appId: "1:215563302397:web:dd3c6f04dd6197ea075594"
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const firestoreDB = getFirestore(app);