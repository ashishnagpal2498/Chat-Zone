import React, { Component } from 'react'
import Message from '../Message/Message'
import './form.css'
import firebase from 'firebase'
import '../Message/message.css'
import axios from 'axios';
import { addToDB, notificationObjGenerator } from '../../firebase-functions'
import { isAuthenticated, getProfilePicUrl, getUserName} from '../../getUserInfo'
import firebaseConfig from '../../config.json'
// let counter = 1;

var counter = 1;
var scrollH;
var snapshotLength;
let prevDate;
export class Form extends Component {


        state = {
            message: '',
            list: [],
            deleteAccess: false,
            color: [],
            prevDate: "",
            loader:true
        };
    
    componentWillMount() {
        //Check if user Exist -  then only listen to messages - snapshot -
        console.log('Authenticated ',isAuthenticated(),this.props.user)
         if(isAuthenticated())
        {   this.listenMessages();
        //Get al the tokens -
            let color = [];
            firebase.firestore().collection('fcmTokens').get().then((tokens)=>{
        // if(tokens.exist)
        // console.log('fcmTokens',tokens.docs[0].data())
        //
        let num = [];
      
        tokens.forEach(item=>{
            for(let i=0;i<3;i++) num[i] = Math.floor((Math.random()*1000)%255)
            let obj = {
                color: `rgb(${num[0]},${num[1]},${num[2]})`,
                token: item.data().token
            }
            console.log(item.data());
            color.push(obj);
        })
        this.setState({color},()=>console.log('color set',color))
       });
    }
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
            console.log('Notification ',notification)
            axios.post(`https://fcm.googleapis.com/fcm/send`, notification, {
                headers: firebaseConfig.headers
            }).then(() => {
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
                    //Item removed
                    console.log("removed ---- ",change.doc.id);
                    let list = JSON.parse(JSON.stringify(this.state.list));
                    list = list.filter(item=> item.id !== change.doc.id)
                    this.setState({list})
                } 
                else if(change.type === 'modified'){
                    console.log('Modified');
                    let list = JSON.parse(JSON.stringify(this.state.list))
                    list.forEach(item => {if(item.id === change.doc.id) {console.log('item',item,change.doc.data());item.text = change.doc.data().text;}} )
                    this.setState({list})
                }
                else if (change.type === 'added') 
                {   console.log('CHange  ',change.doc.id)
                    var message = change.doc.data();
                    console.log("message", message)
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
            },()=>{console.log('fghnj',this.state.loader)})
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
                {this.state.loader && isAuthenticated() ? 
                <div className="formLoaderDiv">
                 <div className="formLoaderBox">
                 <div className="loader"></div>
                 </div>
             </div> :
              !isAuthenticated () ? <p>No data SignIn First</p>: 
                <ul className="form__message" id="form__message" onLoad={this.setScroll} >

                    {this.state.list.length > 0 && this.state.list.map((item, index) => {
                        let currItemDate =  new Date(item.timestamp.seconds*1000).toDateString()
                        let today = new Date().toDateString()
                        let yesterday = new Date();
                        yesterday.setDate(yesterday.getDate()-1)
                        yesterday = yesterday.toDateString()
                        if(index > 0 && prevDate !== new Date(this.state.list[index-1].timestamp.seconds*1000).toDateString())
                        {
                            // Date bifercation - 
                            prevDate = new Date(this.state.list[index-1].timestamp.seconds*1000).toDateString()
                            console.log('prevDate',prevDate)
                        }
                        // console.log('tokens check',getUserToken(),item.token)
                        return <React.Fragment key={index}>
                            {prevDate !== currItemDate &&
                        <p>
                         {today === currItemDate ? 'Today' : yesterday === currItemDate ? 'Yesterday'  : currItemDate}
                        </p>
                            }    
                         <li  className={localStorage.getItem('token') !== item.token ? "message left" : "message message-align right"}  >
                            <Message color={this.state.color.filter(val => val.token === item.token)[0]} message={item} deleteAccess={localStorage.getItem('token') === item.token ? true : false } />
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
//notification and query check
export default Form
