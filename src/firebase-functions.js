import firebase from 'firebase'
import axios from 'axios'
import firebaseConfig from './config.json'

export function addToDB(getUserName,getProfilePicUrl,message){
    firebase.firestore().collection('messages').add({
        uid: firebase.auth().currentUser.uid,
        name: getUserName(),
        text: message,
        profilePicUrl: getProfilePicUrl(),
        token: localStorage.getItem('token'),
        timestamp: new Date()
    }).then(() => {

    }).catch((err) => {
        console.error('Error in Writing New Message', err)
    })
}
export function saveMessagingToken(){
    const messaging = firebase.messaging()
    messaging.getToken().then(function(currentToken) {
        if (currentToken) {
          // Saving the Device Token to the datastore.
          firebase.firestore().collection('fcmTokens').doc(firebase.auth().currentUser.uid)
              .set({token: currentToken});
          // Subscribe to the messaging topic
          axios.post(`https://iid.googleapis.com/iid/v1/${currentToken}/rel/topics/message`, {}, {
            headers: firebaseConfig.headers
        }).then(() => {
        })
        messaging.onMessage(() => {

        })
        localStorage.setItem('token', currentToken)    
        } else {
          // Need to request permissions to show notifications.
          requestNotificationsPermissions();
        }
      }).catch(function(error){
        console.error('Unable to get messaging token.', error);
      });
}
export function requestNotificationsPermissions(){
  
    //Permission request
    firebase.messaging().requestPermission().then(function() {
        // Notification permission granted.
        saveMessagingToken();
      }).catch(function(error) {
        console.error('Unable to get permission to notify.', error);
      });
}
export function notificationObjGenerator(message,protocol){
    
    return {
        "notification": {
            "title": "Chat App",
            "body": `${message}`,
            "sound":"/audio_file.wav",
            "click_action": `${protocol==="http"?"http://localhost:3000/":"https://fir-reactapp-d05b3.firebaseapp.com/"}`,
            "icon": "/notificationBell.png"
        },
        to: "/topics/message"
    }
}

export function deleteMessage(id)
{   firebase.firestore().collection("messages").doc(`${id}`).delete().then(()=>{
    }).catch(()=>{
    })
}

export function updateMessage(text,id){
    firebase.firestore().collection("messages").doc(`${id}`).update({
        text: text
    })
}