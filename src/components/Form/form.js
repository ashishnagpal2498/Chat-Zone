import React, { Component } from 'react'
import Message from '../Message/Message'
import './form.css'
import firebase from 'firebase'
import '../Message/message.css'
import axios from 'axios';
import { addToDB, notificationObjGenerator } from '../../firebase-functions'
import { isAuthenticated, getProfilePicUrl, getUserName } from '../../getUserInfo'
import firebaseConfig from '../../config.json'

let prevDate;
var query;
export class Form extends Component {
    state = {
        message: '',
        list: [],
        deleteAccess: false,
        color: [],
        prevDate: "",
        loader: true
    };

    componentWillMount() {
        //Check if user Exist -  then only listen to messages - snapshot -
        if (isAuthenticated()) {
            this.listenMessages();
            //Get all the tokens -
            let color = [];
            firebase.firestore().collection('fcmTokens').get().then((tokens) => {
                let num = [];

                tokens.forEach(item => {
                    for (let i = 0; i < 3; i++) num[i] = Math.floor((Math.random() * 1000) % 255)
                    let obj = {
                        color: `rgb(${num[0]},${num[1]},${num[2]})`,
                        token: item.data().token
                    }
                    color.push(obj);
                })
                this.setState({ color })
            });
        }
    }
    handleChange(event) {
        this.setState({ message: event.target.value });
    }

    handleSend() {
        if (this.state.message) {
            const notification = notificationObjGenerator(this.state.message, window.location.protocol)
            //Send Notification to all the users who have subscribed to the topic
            axios.post(`https://fcm.googleapis.com/fcm/send`, notification, {
                headers: firebaseConfig.headers
            }).then(() => {

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
        query = firebase.firestore()
            .collection('messages')
            .orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
                let snapshotLength = snapshot.docs.length;
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'removed') {
                        //Item removed
                        let list = JSON.parse(JSON.stringify(this.state.list));
                        list = list.filter(item => item.id !== change.doc.id)
                        this.setState({ list })
                    }
                    else if (change.type === 'modified') {
                        let list = JSON.parse(JSON.stringify(this.state.list))
                        list.forEach(item => { if (item.id === change.doc.id) { console.log('item', item, change.doc.data()); item.text = change.doc.data().text; } })
                        this.setState({ list })
                    }
                    else if (change.type === 'added') {
                        var message = change.doc.data();
                        let customObj = {
                            ...message,
                            id: change.doc.id
                        }
                        this.setState({
                            list: [...this.state.list, customObj]
                        })
                    }
                });
                let mylist = [...this.state.list]
                mylist.sort((item1, item2) => {
                    return item1.timestamp.seconds - item2.timestamp.seconds
                })
                this.setState({
                    list: [...mylist],
                    loader: !(snapshotLength === mylist.length)
                }, () => { setTimeout(this.setScroll, 1000) })
            });
        //Code To create snapshot again and unsubscribe previous - implement Pagination

    }
    setScroll = () => {
        //Setting scroll to bottom on load of data
        let form_div = document.getElementById("form__message")
        form_div.scrollTop = form_div.scrollHeight - form_div.offsetHeight
    }
    componentWillUnmount() {
        //Unsubscribe the snapshot
        query();
    }
    render() {
        return (
            <div className="form">
                {this.state.loader ?
                    <div className="formLoaderDiv">
                        <div className="formLoaderBox">
                            <div className="loader"></div>
                        </div>
                    </div> :
                    <ul className="form__message" id="form__message">

                        {this.state.list.length > 0 && this.state.list.map((item, index) => {
                            let currItemDate = new Date(item.timestamp.seconds * 1000).toDateString()
                            let today = new Date().toDateString()
                            let yesterday = new Date();
                            yesterday.setDate(yesterday.getDate() - 1)
                            yesterday = yesterday.toDateString()
                            if (index > 0 && prevDate !== new Date(this.state.list[index - 1].timestamp.seconds * 1000).toDateString()) {
                                // Date bifercation - 
                                prevDate = new Date(this.state.list[index - 1].timestamp.seconds * 1000).toDateString()
                            }
                            return <React.Fragment key={index}>
                                {prevDate !== currItemDate &&
                                    <p>
                                        {today === currItemDate ? 'Today' : yesterday === currItemDate ? 'Yesterday' : currItemDate}
                                    </p>
                                }
                                <li className={localStorage.getItem('token') !== item.token ? "message left" : "message message-align right"}  >
                                    <Message color={this.state.color.filter(val => val.token === item.token)[0]} message={item} deleteAccess={localStorage.getItem('token') === item.token ? true : false} />
                                    <div className="message-arrow"></div>
                                </li>
                            </React.Fragment>

                        }
                        )}
                    </ul>
                }
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
export default Form
