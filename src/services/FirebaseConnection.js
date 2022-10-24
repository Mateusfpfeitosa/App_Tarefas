import firebase from "firebase/app";
import 'firebase/auth'
import 'firebase/database'

let firebaseConfig = {
    apiKey: "AIzaSyA2MXByqom5urQpqevwQyR2FKTemRE2VwY",
    authDomain: "tasks-f1bc5.firebaseapp.com",
    projectId: "tasks-f1bc5",
    storageBucket: "tasks-f1bc5.appspot.com",
    messagingSenderId: "1013171378640",
    appId: "1:1013171378640:web:1daa08e0e03eede5eb81d5"
  };

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

export default firebase;