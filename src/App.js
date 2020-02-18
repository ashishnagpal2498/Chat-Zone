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
    //Keeps a check on state change of user in firebase
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
  render() {
    return (
      <Router>
        <Switch>
        <Route exact path="/">
        <div className="app">
        <div className="app__header">
          {/* <img src={logo} className="app__logo" alt="logo" /> */}
          <h2>
            Chat App
          </h2>
          { !this.state.user ? (
            <button style={{textAlign:"right"}}
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
          {/* {this.state.user && console.log(this.state.user)} */}
        </div>
        <div className="app__list">
          <div className="form_outer">
          {this.state.user &&  <User url={this.state.user.photoURL} userName={this.state.user.displayName}/>}
          {/* <audio src="./audio_file.wav" id="audio"></audio> */}
          </div>
          <Form user={this.state.user} />
        </div>
      </div>
        </Route>
      <Route path=""><h3>Invalid Path</h3></Route>
        </Switch>
      </Router>
     
    );
  }
}
export default App;
