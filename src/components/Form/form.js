import React, { Component } from 'react'
import Message from '../Message/message'
import './form.css'
import firebase from 'firebase'
import '../Message/message.css'
// import { initializeFirebase } from '../../firebase-file'
import axios from 'axios';
import { addToDB, notificationGenerator, notificationObjGenerator } from '../../firebase-functions'
import { isAuthenticated, getProfilePicUrl, getUserName} from '../../getUserInfo'
// let counter = 1;
const headers = {
    "Content-Type": "application/json",
    "Authorization": "key=AAAAMGQK9UU:APA91bHb4mdJAm0EfoihSx_RMPdC7Hc5b9xrhlXLcjccHJniY4wW6Uo2KLN5zffvJRx6BgtWXInODI5dR9PnTf2oHPjmZXHiCrh8ZMt1Kz1H92iu4gN3slslhJxxkRVCbATd4rSVafBD"
}
var counter = 1;
var scrollH;
var snapshotLength;
export class form extends Component {
    constructor(props) {
        super(props)
        console.log(firebase.firestore)
        this.state = {
            message: '',
            list: [],
            deleteAccess: false,
            color: []

        };
        // this.messageRef = firebase.database().ref().child('messages');

        // console.log(this.state)
    }
    componentWillMount() {
        this.listenMessages();
        notificationGenerator(headers);
        // console.log(this.getUserToken())
        // if(this.getUserToken())
        //{    // }
        // if(token!==null) this.setState({token:token})
    }
    componentWillReceiveProps(nextProps) {
    }
    handleChange(event) {
        this.setState({ message: event.target.value });
    }

    handleSend() {
        if (!isAuthenticated()) {
            return alert('You Must Sign In first');
        }
        if (this.state.message) {
            const notification = notificationObjGenerator(this.state.message, window.location.protocol)
            //Send Notification to all the users who have subscribed to the topic
            axios.post(`https://fcm.googleapis.com/fcm/send`, notification, {
                headers: headers
            }).then(() => {
                // Play audio -  
                // let audioItem = document.getElementById('audio')
                // audioItem.play();
                //--->
                // SCROLLING THE WINDOW ON NEW MESSAGE
                let form_div = document.getElementById("form__message")
                console.log('SET SCROLL')
                if (counter === 1) {
                    console.log('counter is 1')
                    scrollH = form_div.scrollHeight - form_div.offsetHeight
                    console.log(form_div.scrollHeight - form_div.offsetHeight)
                    form_div.scrollTop = scrollH;
                }
                console.log('Notification send')
            })
            addToDB(getUserName, getProfilePicUrl, this.state.message)
            this.setState({ message: '' });
        }
    }
    handleKeyPress(event) {
        if (event.key !== 'Enter') return;
        this.handleSend();
    }
    listenMessages() {
        //Instead of fetching all the data again Paginate- 
        //store the last value length and set the start at value -
        //SnapShot will be created once --

        // Start listening to the query.
        // if (counter === 1) {
        // this.setState({ list: [] })
        var query = firebase.firestore()
            .collection('messages')
            .orderBy('timestamp', 'desc')
        query.onSnapshot((snapshot) => {
            snapshotLength = snapshot.docs.length;
            console.log(snapshotLength)
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'removed') {
                } else if (change.type === 'added') {
                    var message = change.doc.data();
                    console.log("message", message)
                    this.setState({
                        list: [...this.state.list, message]
                    })
                }
                let mylist = [...this.state.list]
                mylist.sort((item1, item2) => {
                    return item1.timestamp.seconds - item2.timestamp.seconds
                })
                this.setState({
                    list: [...mylist]
                })

            });
        });
        //Code To create snapshot again and unsubscribe previous - implement Pagination

    }
    loadData = () => {
        console.log('Scroll event')
        let ab = document.getElementById("form__message")
        console.log(ab.scrollTop)
        //Implement - scrolling and bringing the new data on scrollTop = 0 
    }
    setScroll = () => {
        //Setting scroll to bottom on load of data
        let form_div = document.getElementById("form__message")
        console.log('SET SCROLL')
        if (counter === 1) {
            console.log('counter is 1')
            scrollH = form_div.scrollHeight - form_div.offsetHeight
            console.log(form_div.scrollHeight - form_div.offsetHeight)
            form_div.scrollTop = scrollH;
        }
    }
    render() {

        return (
            <div className="form">
                <ul className="form__message" id="form__message" onLoad={this.setScroll} >

                    {this.state.list.length > 0 && this.state.list.map((item, index) => {
                        let num = []
                        for (let i = 0; i < 3; i++)  num[i] = (Math.floor((Math.random() * 1000))) % 255
                        item.color = `rgb(${num[0]},${num[1]},${num[2]})`
                        // console.log('tokens check',getUserToken(),item.token)
                        return (<li key={index} className={localStorage.getItem('token') !== item.token ? "message left" : "message message-align right"}  >
                            <Message color={item.color} message={item} deleteAcess={this.state.deleteAccess} />
                            <div className="message-arrow"></div>
                        </li>)
                    }
                    )}
                </ul>
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
//notification and query check
export default form
