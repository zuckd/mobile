import firebase from 'firebase';

// Optionally import the services that you want to use
// import "firebase/auth";
//import "firebase/database";
// import "firebase/firestore";
// import "firebase/functions";
// import "firebase/storage";

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

const firebase_ = firebase.initializeApp(firebaseConfig);
const functions = firebase_.functions();
const db = firebase_.firestore();
const auth = firebase_.auth();
const storage = firebase_.storage();

export default firebase_

export const addUser = async (email: string, password: string, image: ArrayBuffer) => {
  const addFace = functions.httpsCallable("addFace");
  const resp = await addFace({image});
  const pid = resp.data;
  const user = await auth.createUserWithEmailAndPassword(email, password);
  await db.collection("users").doc(user.user?.uid).set({
    group: "hackathondefault1",
    personId: pid
  });
  await db.collection("personIds").doc(pid).set({
    uid: user.user?.uid
  });
};

export const getReceiver = async (image: ArrayBuffer) => {
  const getPersonId = functions.httpsCallable("getPersonId");
  const resp = await getPersonId({image}); // returns multiple pids
  const pid = resp.data[0];
  const doc = await db.collection("personIds").doc(pid).get();
  const uid = doc.data()?.uid;
  return uid;
}

/**
 * wrapper for storage upload
 * @param uid User Id to send to
 * @param filename name of the file
 * @param data data to send
 * @returns An uploadTask. This object allows monitoring of the uploadProgress.
 */
export const sendFile = (uid: string, filename: string, data: File | Blob | Uint8Array): firebase.storage.UploadTask => {
  const ref = storage.ref(`${uid}/${filename}`);
  const uploadTask = ref.put(data);
  return uploadTask;
}

export const queryFiles = async () => {
  const ref = storage.ref(`${auth.currentUser?.uid}/`);
  const results = await ref.listAll();
  return results.items;
}

export const getDownloadURL = async (path: string) => {
  const ref = storage.ref(path);
  const downloadUrl = await ref.getDownloadURL();
  return downloadUrl;
}