import React, { Component } from 'react'
import './message.css'
import { getUserToken } from '../../getUserInfo'
import {deleteMessage,updateMessage} from '../../firebase-functions'
// import firebase from 'firebase'
// function PopUpWindow() {
//     return (
//         <div style={{ width: "100vw",top:0,left:0,height: "100vh", backgroundColor: "rgba(0,0,0,0.2)", position: "fixed" }}>
//             <div style={{ padding: "20px" }}>
//                 <button style={buttonStyle} onClick={()=>{deleteMessage(this.state.id)}}>
//                     Yes
//                 </button>
//                 <button style={buttonStyle} onClick={()=> this.setState({popUpWindow:false})}>
//                     No
//                 </button>
//             </div>
//         </div>
//     )
// }
export class Message extends Component {
    state = {
        popup: false,
        token: null,
        updateMessage: false,
        updateVal : ''
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
    editMessage = (id)=>{
        console.log('')
        updateMessage(this.state.updateVal,id);
        this.setState({
            updateVal:'',
            updateMessage:false
        })
    }
    deleteMessage = (id)=>{
        // Call the fireSTore-
        console.log('Delete Clicked',id)
       this.setState({
           popup: true,
           id
       })
    }
    inputHandler = (event)=>{
        this.setState({
            updateVal: event.target.value
        })
    }
    render() {
        return (
           
              
                <div  className="message-content"  >
                   
                    <h5 className="message__author">{this.props.message.name}</h5>
                    {this.state.updateMessage ? 
                    <React.Fragment>
                 <input type="text" value={this.state.updateVal} onChange={this.inputHandler}/>
                    </React.Fragment>
                :      <p style={{ color: this.props.color ,margin: "0", padding: "0 10px"}}>{this.props.message.text}
                </p>
                }
                  
                    <div id="timestamp" style={{ textAlign: "right" }}>{this.props.message.timestamp !== null && (new Date(this.props.message.timestamp.seconds * 1000)).toString().substr(16, 8)}</div>
                    {/* </span> */}
                    {/* </div> */}
                    {this.props.deleteAccess && (new Date().getTime() - this.props.message.timestamp.seconds*1000 < 3600000) && 
                    <div className="message-content-options">
                      {this.state.updateMessage ? 
                        <React.Fragment>
                             <button type="button" onClick={()=>this.editMessage(this.props.message.id)}>Update</button>
                             <button type="button" onClick={()=> this.setState({updateMessage:false})}> Cancel </button>
                        </React.Fragment>  
                        :
                        <React.Fragment>
                     <button type="button" onClick={()=>this.setState({updateMessage:true,updateVal:this.props.message.text})} > <i className="far fa-edit" ></i> </button>
                       <button   onClick={()=> this.deleteMessage(this.props.message.id)}> <i className="far fa-trash-alt" ></i> </button>
                    
                        </React.Fragment>
                    }
                    </div>
                    }
                    {this.state.popup &&   <div style={{ width: "100vw",top:0,left:0,height: "100vh", backgroundColor: "rgba(0,0,0,0.2)", position: "fixed" }}>
            <div style={{ padding: "20px" }}>
                <button style={buttonStyle} onClick={()=>{ this.setState({popup:false}) ;deleteMessage(this.state.id)}}>
                    Yes
                </button>
                <button style={buttonStyle} onClick={()=> this.setState({popup:false})}>
                    No
                </button>
            </div>
        </div>}
                </div>
               
            
        )
    }
}
const buttonStyle = {
    padding: "10px",
    color: "white",
    backgroundColor: "black",
    // position: "absolute",
    // left: "50%",
    // top: "50%",
    // marginLeft: "20px"
}
let bgColorMsg = {
    backgroundColor: "rgba(0, 0, 0, .05)"
}


export default Message
