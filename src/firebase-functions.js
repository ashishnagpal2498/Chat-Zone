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
   
}
export function notificationObjGenerator(message,protocol){
    
    return {
        "notification": {
            "title": "Chat App",
            "body": `${message}`,
            "sound":"audio_file",
            "click_action": `${protocol==="http"?"http://localhost:3000/":"https://fir-reactapp-d05b3.firebaseapp.com/"}`,
            "icon": "/notificationBell.png"
        },
        to: "/topics/message"
    }
}

export function deleteMessage(id)
{   console.log('ID ',id)
    
    firebase.firestore().collection("messages").doc(`${id}`).delete().then(()=>{
        console.log('Deleted SuccessFully')
    }).catch(()=>{
        console.log('Error in delete')
    })
}

export function updateMessage(text,id){
    console.log('Update , ',id);
    firebase.firestore().collection("messages").doc(`${id}`).update({
        text: text
    })
}