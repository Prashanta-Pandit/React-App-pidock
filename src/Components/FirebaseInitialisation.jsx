//JS file purpose**********: JS page to initialise firebase, include app initialisation, databse and etc.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';
import { getFirestore, collection } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyC9tPDspMrJfQCIOheawZSki3TDaqSuVKU",
    authDomain: "pidockwithreact.firebaseapp.com",
    projectId: "pidockwithreact",
    storageBucket: "pidockwithreact.appspot.com",
    messagingSenderId: "284166390189",
    appId: "1:284166390189:web:1ad21dea83c11b2f986124",
    measurementId: "G-PLLFZ5R4FD"
};

const app = initializeApp(firebaseConfig);
const auth =getAuth(app);  // getting authentication

const firestoreDb = getFirestore(app); // getting the db ready for firestore

//collection reference from firestoreDb
const fireStoreCollectionReference = collection(firestoreDb, 'employees') // this collection is being stored in the collection called collectionReference

console.log(`Firebase reference:  ${fireStoreCollectionReference}`);

export { auth, fireStoreCollectionReference};