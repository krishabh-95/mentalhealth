import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDoki3lVqSWOc7cBptqhbN-7I4_Fa6WxZ8",
    authDomain: "mentalhealth-b0788.firebaseapp.com",
    databaseURL: "https://mentalhealth-b0788-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mentalhealth-b0788",
    storageBucket: "mentalhealth-b0788.appspot.com",
    messagingSenderId: "480177758474",
    appId: "1:480177758474:web:8e9e4a8e7376ebf68d5af3",
    measurementId: "G-7JMRCCREER"
  };
  
const myApp = initializeApp(firebaseConfig);

const db = getFirestore(myApp);

/*
addData = async() => {
    await setDoc(doc(firestore, "users", "rishabh_k_iyer"), {
        employment: "admin",
        email: "krishabh172012@gmail.com"
      });
}*/

export default db;