import React, { Component } from 'react'
import './message.css'
import { deleteMessage, updateMessage } from '../../firebase-functions'
export class Message extends Component {
    state = {
        popup: false,
        updateMessage: false,
        updateVal: ''
    }
    editMessage = (id) => {
        updateMessage(this.state.updateVal, id);
        this.setState({
            updateVal: '',
            updateMessage: false
        })
    }
    deleteMessage = (id) => {
        // Pop up window
        this.setState({
            popup: true,
            id
        })
    }
    inputHandler = (event) => {
        this.setState({
            updateVal: event.target.value
        })
    }
    render() {
        return (
            <div className="message-content">
                <h5 className="message__author">{this.props.message.name}</h5>
                {this.state.updateMessage ?
                    <React.Fragment>
                        <input type="text" className="editMessage" value={this.state.updateVal} onChange={this.inputHandler} />
                    </React.Fragment>
                    : <p className="message-text" style={{ color: this.props.color ? this.props.color.color : 'black'}}>
                        {this.props.message.text}
                    </p>
                }

                <div id="timestamp" style={{ textAlign: "right" }}>{this.props.message.timestamp !== null && (new Date(this.props.message.timestamp.seconds * 1000)).toString().substr(16, 8)}</div>
                {this.props.deleteAccess && (new Date().getTime() - this.props.message.timestamp.seconds * 1000 < 3600000) &&
                    <div className="message-content-options">
                        {this.state.updateMessage ?
                            <React.Fragment>
                                <button type="button" onClick={() => this.editMessage(this.props.message.id)}><i class="fas fa-check"></i></button>
                                <button type="button" onClick={() => this.setState({ updateMessage: false })}> <i class="fas fa-times"></i> </button>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <button type="button" onClick={() => this.setState({ updateMessage: true, updateVal: this.props.message.text })} > <i className="far fa-edit" ></i> </button>
                                <button onClick={() => this.deleteMessage(this.props.message.id)}> <i className="far fa-trash-alt" ></i> </button>

                            </React.Fragment>
                        }
                    </div>
                }
                {this.state.popup && <div className="popupModal">

                    <div className="popupModalContent">
                        <h4>Are you sure you want to delete this Message ?</h4>
                        <div className="btns-div">
                            <button className="btnStyle btn-success" onClick={() => { this.setState({ popup: false }); deleteMessage(this.state.id) }}>
                                Yes
                </button>
                            <button className="btnStyle btn-danger" onClick={() => this.setState({ popup: false })}>
                                No
                </button>
                        </div>
                    </div>
                </div>}
            </div>


        )
    }
}



export default Message
