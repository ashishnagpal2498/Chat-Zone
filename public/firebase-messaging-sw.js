importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-messaging.js')

firebase.initializeApp({
    apiKey: "AIzaSyBwOVyGqKr9JSrPAgHXKIPt64ResasDsyc",
    authDomain: "fir-reactapp-d05b3.firebaseapp.com",
    databaseURL: "https://fir-reactapp-d05b3.firebaseio.com",
    projectId: "fir-reactapp-d05b3",
    storageBucket: "fir-reactapp-d05b3.appspot.com",
    messagingSenderId: "207836869957",
    appId: "1:207836869957:web:5f2a058102918cab973a2c",
    measurementId: "G-8ZHSQMQXW5"
})

const messaging = firebase.messaging()
messaging.setBackgroundMessageHandler((payload)=>{
        console.log(payload);
    const title = "hello world"
    const options = {
        body:payload.data.status
    }
    return self.registration.showNotification(title,options)
})