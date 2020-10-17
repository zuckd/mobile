import * as firebase from 'firebase';

// Optionally import the services that you want to use
import "firebase/auth";
//import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAXwrKyFm5ZRkWnEyyzWGtD9IPu_epbDVE",
  authDomain: "zuckd-5a1d1.firebaseapp.com",
  databaseURL: "https://zuckd-5a1d1.firebaseio.com",
  projectId: "zuckd-5a1d1",
  storageBucket: "zuckd-5a1d1.appspot.com",
  messagingSenderId: "338248660270",
  appId: "1:338248660270:web:dcbf5b7100870c4c4636bf",
  measurementId: "G-FQTQT4EPWT"
};



const firebase_ = firebase.initializeApp(firebaseConfig)

export default firebase_
