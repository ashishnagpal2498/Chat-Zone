import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";
import Form from './components/Form/form.js';
//Global Import
import firebase from 'firebase';
import {initializeFirebase} from './firebase-file'
// import firebaseConfig from './config.json';
import User from './components/User/user.js'

// firebase.initializeApp(firebaseConfig.firebaseConfig);

/**
 * @classdec class App
 * 
 * @constructor which calls its super class -
 * @memberof class componentDidMount
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    }
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
    });
  }
  handleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }
  handleLogOut() {
    firebase.auth().signOut();
  }
  // getUserName = () =>{
  //   // TODO 5: Return the user's display name.
  //   return firebase.auth().currentUser.displayName;
  // }
  render() {
    return (
      <Router>
        <Switch>
        <Route exact path="/">
        <div className="app">
        <div className="app__header">
          <img src={logo} className="app__logo" alt="logo" />
          <h2>
            SIMPLE APP WITH REACT
          </h2>
          { !this.state.user ? (
            <button
              className="app__button"
              onClick={this.handleSignIn.bind(this)}
            >
              Sign in
            </button>
          ) : (
            <button
              className="app__button"
              onClick={this.handleLogOut.bind(this)}
            >
              Logout
            </button> 
           
          )}
          {this.state.user &&  <User url={firebase.auth().currentUser.photoURL} userName={firebase.auth().currentUser.displayName}/>}
        </div>
        <div className="app__list">
          <Form user={this.state.user} />
        </div>
      </div>
        </Route>
      <Route path=""><h3>Invalid Path</h3></Route>
        </Switch>
        {/* <Route path="/firebase-messaging-sw.js">
          <p>hello</p>
        </Route> */}
      </Router>
     
    );
  }
}
export default App;
