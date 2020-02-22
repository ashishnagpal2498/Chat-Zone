importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-messaging.js')
import firebaseConfig from '../src/config.json'
// import firebaseConfig from '../src/config.json'
// console.log('messaging File')
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
console.log('Messaging')
//    messaging.usePublicVapidKey("BLgUlaRmTk-5e71RRFqaHyujQ7GWRMhnUXaVl65l2P-ZYBKSeDdE-g3a7NqUksRUyjgP6j2BN6TZkZCqnNRxPJQ")
    //1) Permission request
messaging.requestPermission().then((permission) => {
        console.log('Notification permission granted.', messaging.getToken());
        return messaging.getToken()
    }).then((token) => {
        //create a topic -
        //store firebase messaging tokens
        //Impt - Subscribe the user to that topic -
        console.log('Promise Token ',token)
        const data = {};
        // this.setState({
        //     currToken: token
        // })
        
            axios.post(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/message`, data, {
                headers: firebaseConfig.headers
            }).then((obj) => {
                // console.log(obj);
            })
        localStorage.setItem('token', token)
    }).catch((err) => {
        console.error('Permission denied', err)
    })
    //Listen to message change-
messaging.onNotificationReceived((data)=>{
    console.log('Data  ',data)
})
messaging.setBackgroundMessageHandler((payload)=>{
    //change here ---
    console.log('inside msg handler ------  ') 
    console.log(payload);
    const title = "hello world"
    const options = {
        body:payload.data.status
    }
    return self.registration.showNotification(title,options)
})
messaging.onMessage((payload) => {
        
    console.log('Same Page --- ', payload)
})
