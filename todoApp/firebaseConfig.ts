import { initializeApp } from 'firebase/app';
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyB8MJ_i9v-nsGEKGfmQPFvOwstQ8NlQ0vI",
  authDomain: "todoapp-ed658.firebaseapp.com",
  projectId: "todoapp-ed658",
  storageBucket: "todoapp-ed658.firebasestorage.app",
  messagingSenderId: "921183358884",
  appId: "1:921183358884:web:bd7094bae778ed71907b31"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
