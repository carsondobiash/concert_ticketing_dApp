import React, { Component } from 'react'
import './App.css'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Homepage from "./pages/Homepage";
import Account from "./pages/Account";
import Web3 from "web3";
import Buying from "./pages/Buying";
import Resale from "./pages/Resale";
import Host from "./pages/Host"

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {address: 'Please connect your account!'}
  }

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

  render() {
    return (
        <Router>
          <Switch>
            <Route exact path="/" render={(props) => <Homepage {...props} account={this.state.account} />}/>
            <Route path="/account" render={(props) => <Account {...props} account={this.state.account} />}/>
            <Route path="/buy" render={(props) => <Buying {...props} account={this.state.account} />}/>
            <Route path="/sell" render={(props) => <Resale {...props} account={this.state.account} />}/>
            <Route path="/host" render={(props) => <Host {...props} account={this.state.account} />}/>
          </Switch>
        </Router>
    );
  }
}

export default App;
