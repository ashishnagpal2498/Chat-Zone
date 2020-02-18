import React, { Component } from 'react'
import './message.css'
import { getUserToken } from '../../getUserInfo'
// import firebase from 'firebase'
function popUpWindow() {
    return (
        <div style={{ width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.2)", position: "fixed" }}>
            <div style={{ padding: "20px" }}>
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
    state = {
        popup: false,
        token: null,
    }
    componentWillReceiveProps(nextProps) {
        // if(this.props!==nextProps)
        // {
        //     bgColorMsg = {...bgColorMsg,
        //         backgroundColor: "green"
        //     }
        //     setTimeout(()=>{
        //         bgColorMsg = {...bgColorMsg,
        //             backgroundColor: "rgba(0, 0, 0, .05)"
        //         }
        //     },500)
        // }
    }
    componentWillMount() {
        let token = localStorage.getItem('token')
        this.setState({
            token: token
        })
        //generate random color for particular user
       
    }
    render() {
        return (
           
              
                <div  className="message-content"  >
                   
                    <h5 className="message__author">{this.props.message.name}</h5>
                    <p style={{ color: this.props.color ,margin: "0", padding: "0 10px"}}>{this.props.message.text}
                    </p>
                    <div id="timestamp" style={{ textAlign: "right" }}>{this.props.message.timestamp !== null && (new Date(this.props.message.timestamp.seconds * 1000)).toString().substr(16, 8)}</div>
                    {/* </span> */}
                    {/* </div> */}
                </div>
               
            
        )
    }
}
const buttonStyle = {
    padding: "10px",
    color: "white",
    backgroundColor: "black"
}
let bgColorMsg = {
    backgroundColor: "rgba(0, 0, 0, .05)"
}


export default message
