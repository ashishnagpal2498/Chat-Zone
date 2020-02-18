import firebase from 'firebase';
// import * as firebaseCon from './config.json'

export const initializeFirebase = () => {
  firebase.initializeApp({
    apiKey: "AIzaSyBwOVyGqKr9JSrPAgHXKIPt64ResasDsyc",
    authDomain: "fir-reactapp-d05b3.firebaseapp.com",
    databaseURL: "https://fir-reactapp-d05b3.firebaseio.com",
    projectId: "fir-reactapp-d05b3",
    storageBucket: "fir-reactapp-d05b3.appspot.com",
    messagingSenderId: "207836869957",
    appId: "1:207836869957:web:5f2a058102918cab973a2c",
    measurementId: "G-8ZHSQMQXW5"
});
  navigator.serviceWorker
  .register('./firebase-messaging-sw.js')
  .then((registration) => {
      console.log('Fire ServiceWorker')
    firebase.messaging().useServiceWorker(registration);
  });

}
