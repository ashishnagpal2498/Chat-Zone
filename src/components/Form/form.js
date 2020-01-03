import React, { Component } from 'react'
import Message from '../Message/message'
import './form.css'
import firebase from 'firebase'

// let counter = 1;
export class form extends Component {
    constructor(props) {
        super(props)
        console.log(firebase.firestore)
        this.state = {
            userName: 'Sebastian',
            message: '',
            list: [],
            deleteAccess: false
        };
        // this.messageRef = firebase.database().ref().child('messages');
        this.listenMessages();
        console.log(this.state)
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
        // TODO 5: Return the user's display name.
        return firebase.auth().currentUser.displayName;
    }
    isAuthenticated = ()=>{
            // TODO 6: Return true if a user is signed-in.
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
