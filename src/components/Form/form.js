import React, { Component } from 'react'
import Message from '../Message/message'
import './form.css'
import firebase from 'firebase'
import {initializeFirebase} from '../../firebase-file'
import axios from 'axios';
// let counter = 1;
const headers = {
    "Content-Type": "application/json",
    "Authorization": "key=AAAAMGQK9UU:APA91bHb4mdJAm0EfoihSx_RMPdC7Hc5b9xrhlXLcjccHJniY4wW6Uo2KLN5zffvJRx6BgtWXInODI5dR9PnTf2oHPjmZXHiCrh8ZMt1Kz1H92iu4gN3slslhJxxkRVCbATd4rSVafBD"
}
export class form extends Component {
    constructor(props) {
        super(props)
        console.log(firebase.firestore)
        this.state = {
            userName: 'Sebastian',
            message: '',
            list: [] ,
            deleteAccess: false
        };
        // this.messageRef = firebase.database().ref().child('messages');
        this.listenMessages();
        console.log(this.state)
    }
    componentWillMount(){
       const messaging = firebase.messaging()
    //    messaging.usePublicVapidKey("BLgUlaRmTk-5e71RRFqaHyujQ7GWRMhnUXaVl65l2P-ZYBKSeDdE-g3a7NqUksRUyjgP6j2BN6TZkZCqnNRxPJQ")
       //Permission request
        messaging.requestPermission().then((permission) => {
            // if (permission === 'granted') {
              console.log('Notification permission granted.');
              // TODO(developer): Retrieve an Instance ID token for use with FCM.
              // ...
            // } else {
            //   console.log('Unable to get permission to notify.');
            // }
            return messaging.getToken()
          }).then((token)=>{
                console.log(token);
                //create a topic - 
                //store firebase messaging tokens
                //Impt - Subscribe the user to that topic -
                const data = {};
                axios.post(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/message`,data,{
                    headers: headers
                }).then((obj)=>{
                    console.log(obj);
                })
                localStorage.setItem('token',token)
          }).catch((err)=>{
              console.error('Permission denied',err)
          })
          messaging.onMessage((payload)=>{

              console.log('Same Page',payload)
          })

    

    }
    componentWillReceiveProps(nextProps) {
    }
    handleChange(event) {
        this.setState({ message: event.target.value });
    }
    getProfilePicUrl = () => {
        // TODO 4: Return the user's profile pic URL.
        return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';

    }

    // Returns the signed-in user's display name.
    getUserName = () => {
        //Return the user's display name.
        return firebase.auth().currentUser.displayName;
    }
    isAuthenticated = ()=>{
            //Return true if a user is signed-in.
            // console.log('This Authenticated')
            return !!firebase.auth().currentUser;
    }
    handleSend() {
        if(!this.isAuthenticated())
        {  
            return alert('You Must Sign In first');
        }
        if (this.state.message) {
            //   var newItem = {
            //     userName: this.state.userName,
            //     message: this.state.message,
            //   }
            //   this.messageRef.push(newItem);
           
          const notification =  {
                "notification": {
                    "title": "Firebase",
                    "body": `${this.state.message}`,
                    "click_action": "http://localhost:3000/",
                    "icon": "http://url-to-an-icon/icon.png"
                },
                to: "/topics/message"
            }
            const token = localStorage.getItem('token')
            axios.post(`https://fcm.googleapis.com/fcm/send`,notification,{
                headers: headers
            }).then(()=>{
                console.log('Notification send')
            })
                

            firebase.firestore().collection('messages').add({
                name: this.getUserName(),
                text: this.state.message,
                // profilePicUrl:getProfilePicUrl(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).catch((err) => {
                console.error('Error in Writing New Message', err)
            })
            this.setState({ message: '' });
        }
    }
    handleKeyPress(event) {
        if (event.key !== 'Enter') return;
        this.handleSend();
    }
    listenMessages() {
        // this.messageRef
        //   .limitToLast(10)
        //   .on('value', message => {
        //     this.setState({
        //       list: Object.values(message.val()),
        //     });
        //   });
        var query = firebase.firestore()
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .limit(12);

        // Start listening to the query.
        query.onSnapshot((snapshot) => {
            //empty the list
            //  this.setState({list:[]});
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'removed') {
                    // deleteMessage(change.doc.id);
                } else if(change.type==='added') {
                    var message = change.doc.data();
                    // displayMessage(change.doc.id, message.timestamp, message.name,
                    //        message.text, message.profilePicUrl, message.imageUrl);
                    console.log(message)
                    
                    //Set The message to localhost -
                    //-- if same window - then - colour the message -
                    //Timeout - 
                    localStorage.setItem('newMsg',message)
                    // if(counter===1)
                    this.setState({
                        list: [...this.state.list, message]
                    })

                    // else{

                    // }
                }
            });
        });

    }
    render() {
        return (
            <div className="form">
                <div className="form__message">
                    {this.state.list.map((item, index) =>
                        <Message key={index} message={item} deleteAcess={this.state.deleteAccess} />
                    )}
                </div>
                <div className="form__row">
                    <input
                        className="form__input"
                        type="text"
                        placeholder="Type message"
                        value={this.state.message}
                        onChange={this.handleChange.bind(this)}
                        onKeyPress={this.handleKeyPress.bind(this)}
                    />
                    <button
                        className="form__button"
                        onClick={this.handleSend.bind(this)}
                    >
                        send
              </button>
                </div>
            </div>
        );
    }
}

export default form
