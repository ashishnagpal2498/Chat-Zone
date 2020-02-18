import firebase from 'firebase'
import axios from 'axios'
// export const token = null
export function addToDB(getUserName,getProfilePicUrl,message){
    firebase.firestore().collection('messages').add({
        name: getUserName(),
        text: message,
        profilePicUrl: getProfilePicUrl(),
        token: localStorage.getItem('token'),
        timestamp: new Date()
    }).then(() => {
        console.log('Add Function COmpleted')
        console.log(firebase.firestore.FieldValue.serverTimestamp())
    }).catch((err) => {
        console.error('Error in Writing New Message', err)
    })
}
export function notificationGenerator(headers){
    const messaging = firebase.messaging()
    //    messaging.usePublicVapidKey("BLgUlaRmTk-5e71RRFqaHyujQ7GWRMhnUXaVl65l2P-ZYBKSeDdE-g3a7NqUksRUyjgP6j2BN6TZkZCqnNRxPJQ")
    //Permission request
    messaging.requestPermission().then((permission) => {
        console.log('Notification permission granted.');
        return messaging.getToken()
    }).then((token) => {
        //create a topic -
        //store firebase messaging tokens
        //Impt - Subscribe the user to that topic -
        const data = {};
        // this.setState({
        //     currToken: token
        // })
            axios.post(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/message`, data, {
                headers: headers
            }).then((obj) => {
                // console.log(obj);
            })
        localStorage.setItem('token', token)
    }).catch((err) => {
        console.error('Permission denied', err)
    })
    //Listen to message change-
    messaging.onMessage((payload) => {
        
        console.log('Same Page', payload)
    })
}
export function notificationObjGenerator(message,protocol){
    
    return {
        "notification": {
            "title": "Firebase",
            "body": `${message}`,
            // "sound":"./audio_file.wav",
            "click_action": `${protocol==="http"?"http://localhost:3000/":"https://fir-reactapp-d05b3.firebaseapp.com/"}`,
            "icon": "./notification-icon.png"
        },
        to: "/topics/message"
    }
}