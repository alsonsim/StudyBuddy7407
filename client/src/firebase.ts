import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-nYAuJAumgmuMRaqbG2tLoJZ1_GeXymY",

  authDomain: "studybuddy-f9a91.firebaseapp.com",

  projectId: "studybuddy-f9a91",

  storageBucket: "studybuddy-f9a91.firebasestorage.app",

  messagingSenderId: "40159553534",

  appId: "1:40159553534:web:1a9b88dfa459da1c4c42af"

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

export const db = getFirestore(app);
