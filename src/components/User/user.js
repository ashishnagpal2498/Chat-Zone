import React, { Component } from 'react'

export class user extends Component {
    render() {
        return (
            <div style={{marginTop:"10px"}}>
                <img src={this.props.url} alt="" style={{borderRadius:"100px",width:"40px",height:"40px"}}/>

        <div style={{fontSize:"20px",textAlign:"center"}}>{this.props.userName}</div>
            </div>
        )
    }
}

export default user
