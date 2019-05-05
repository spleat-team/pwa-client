import React, { Component } from 'react';

export default class FacebookLogin extends Component {


  render() {
    let {children} = this.props;
    return (
      <div onClick={this.facebookLogin}>
        {children}
      </div>
    );
  }
}