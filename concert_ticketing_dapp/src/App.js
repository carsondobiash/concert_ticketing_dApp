import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData() {
    let ethereum = window.ethereum;
    let web3 = window.web3;
    if (typeof ethereum !== 'undefined') {
      await ethereum.enable();
      web3 = new Web3(ethereum);
    } else if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
    } else {
      web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER));
    }
    const account = web3.currentProvider.selectedAddress;
    this.setState({account: account})
  }

  constructor(props) {
    super(props);
    this.state = { account: 'Please connect your account!' }
  }

  render() {
    return (
        <div className="container">
          <h1>Hello, World!</h1>
          <p>Your account: {this.state.account}</p>
        </div>
    );
  }
}

export default App;
