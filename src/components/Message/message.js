import React, { Component } from 'react'
import './message.css'
import firebase from 'firebase'
function popUpWindow(){
    return (
        <div style={{width:"100vw",height:"100vh",backgroundColor:"rgba(0,0,0,0.2)",position:"fixed"}}>
            <div style={{padding:"20px"}}>
                <button style={buttonStyle}>
                    Yes
                </button>
                <button style={buttonStyle}>
                    No
                </button>
            </div>
        </div>
    )
}
export class message extends Component {
    state={
        popup:false
    }
    render() {
        return (
            <div className="message">
            <span className="message__author">
                {this.props.message.name}:
            </span>
             {this.props.message.text}
             <span><i class="far fa-trash-alt"></i></span>
            {this.state.popup && popUpWindow}
  </div>
        )
    }
}
const buttonStyle = {
    padding:"10px",
    color: "white",
    backgroundColor:"black"
}

export default message
