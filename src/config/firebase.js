import * as firebase from 'firebase/app'
import 'firebase/database'

var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
}

export default firebase.initializeApp(firebaseConfig);