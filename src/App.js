import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Form from './components/Form/Form.js';
import firebase from 'firebase';
import User from './components/User/User.js'
import { saveMessagingToken } from './firebase-functions';

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
    firebase.auth().onAuthStateChanged(this.authStateObserver);
  }
  authStateObserver = (user)=>{
    if(user)
    {this.setState({ user });
      saveMessagingToken()
    }
  }
  handleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }
  handleLogOut() {
    this.setState({user:null})
    firebase.auth().signOut();
  }
  render() {
    return (
      <Router>
        <Switch>
        <Route exact path="/">
        <div className="app">
        <div className="app__header">
          <h2>
            Chat Zone
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
        </div>
        <div className="app__list">
          <div className="form_outer">
          {<User url={this.state.user ? this.state.user.photoURL : '/user_img.png'} userName={this.state.user ?this.state.user.displayName: ''}/>}
         </div>
         {this.state.user ? <Form user={this.state.user}  /> 
         :
         <div className="signInDiv">
          <p> <i className="fas fa-exclamation-triangle"></i> Sign In to chat</p>
           </div>
         }
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
