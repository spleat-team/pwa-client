// src/components/Notifier/index.js
import React, { Component } from "react";
import "./Notifier.css";
import classnames from 'classnames';

class Notifier extends Component {
  render() {
    const notifyclass = classnames('notify', {
      danger: this.props.offline
    });
    const message = this.props.offline ?
  `You are offline! Your images will be saved now and then uploaded once your Internet connection is back up.`
  :
  `Shoot the reciept and send to Spleat!`;
    return (
        <div className={notifyclass}>
            <p>
                <em>{message}</em>
            </p>
        </div>
    );
  }
}

export default Notifier;