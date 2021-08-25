import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyDJyY9NZcwL7f6zxWHUhS9K4ZLhSNWpZec",
  authDomain: "house-rules-4ffbc.firebaseapp.com",
  databaseURL: "https://house-rules-4ffbc-default-rtdb.firebaseio.com",
  projectId: "house-rules-4ffbc",
  storageBucket: "house-rules-4ffbc.appspot.com",
  messagingSenderId: "573758979687",
  appId: "1:573758979687:web:c39ab2fd91ee39b0c41ec2",
  measurementId: "G-V8XMT1XFTD",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage().ref();

export default firebase;
