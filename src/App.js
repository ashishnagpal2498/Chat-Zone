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
