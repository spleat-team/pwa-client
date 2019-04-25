// src/App.js

import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import Notifier from './components/Notifier';

class App extends Component {
  constructor() {
    super();
    this.state = {
      offline: false
    }
  }

  componentDidMount() {
    window.addEventListener('online', () => {
      this.setState({ offline: false });
    });

    window.addEventListener('offline', () => {
      this.setState({ offline: true });
    });
  }

  componentDidUpdate() {
    let offlineStatus = !navigator.onLine;
    if (this.state.offline !== offlineStatus) {
      this.setState({ offline: offlineStatus });
    }
  }

  render() {
    return (
      <div className="App">
        <Notifier offline={this.state.offline} />
        <img src={logo} className="App-logo" alt="Spleat Logo" />
        <input type="file" accept="image/*"/>
      </div>
    );
  }
}

export default App;