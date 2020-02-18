import React, { Component } from 'react'

export class user extends Component {
    /**
     * 
     */
    render() {
        return (
            <div style={{paddingLeft:"40px",position:"relative"}}>
                <img src={this.props.url} alt="" style={{borderRadius:"100px",width:"30px",height:"30px",position:"absolute",left:"0",top:"0"}}/>

        <div style={{fontSize:"20px",textAlign:"left"}}>{this.props.userName}</div>
            </div>
        )
    }
}

export default user
