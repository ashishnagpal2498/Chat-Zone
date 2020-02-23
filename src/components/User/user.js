import React, { Component } from 'react'
import './user.css'
export class user extends Component {
    /**
     * 
     */
    render() {
        return (
            <div className="imageOuter">
                <img src={this.props.url} alt="" className="userImage"/>
        <div >{this.props.userName}</div>
            </div>
        )
    }
}

export default user
