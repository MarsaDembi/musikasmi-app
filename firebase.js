import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC-z4gA15mB6Wp-FoIRVQhsPqXZxnE1h60",
  authDomain: "musikami-48f97.firebaseapp.com",
  projectId: "musikami-48f97",
  storageBucket: "musikami-48f97.firebasestorage.app",
  messagingSenderId: "226031302250",
  appId: "1:226031302250:web:48c34cc64a5263ffe57c13",
  measurementId: "G-HW2KYW72PJ"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);