import React, { Component } from 'react'
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import {withStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper/Paper";
import EventContractABI from "../contracts/Event.json"
import TicketContractABI from "../contracts/TicketResale"
import Web3 from "web3";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent";

const EventContractAddress = "0x95C04409CC952fa9156c93b31AC304795Fa60A8c"

class Buying extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.eventListing = this.eventListing.bind(this)
    }

    componentWillMount() {
        this.loadBlockchainData();
    }

    componentDidMount() {
        this.eventListing()
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
        this.setState({events : new web3.eth.Contract(EventContractABI.abi,EventContractAddress)})
    }

    async eventListing(){
        const { classes } = this.props;
        this.setState({
            ticketContractList: [],
        })
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

        if(this.state.events !== undefined){
            this.loadTicketContracts()
        }

        let eventDisplay = [];
        if(this.state.addressList !== [] && this.state.addressList !== undefined && this.state.addressList !== null){
            for(let i = 0; i < this.state.addressList.length; i++){
                this.setState({
                    ticketContractList: this.state.ticketContractList.concat([new web3.eth.Contract(TicketContractABI.abi,this.state.addressList[i])])
                })
            }
        }
        if(this.state.ticketContractList !== [] || this.state.ticketContractList !== undefined){
            for(let i = 0; i < this.state.ticketContractList.length; i++){
                this.getCurrentEvent(this.state.ticketContractList[i].options['address']);
                await this.state.ticketContractList[i].methods.getTicketInfo().call({from: this.props.account}).then((result) =>{
                    if(result[3] > Date.now()/ 1000){
                        eventDisplay.push(
                            <Card className={classes.event} style = {{margin: 8}}>
                                <CardContent>
                                    <div className={classes.ticketContent}>
                                        <div className={classes.ticketTitle}>
                                            <h1>{this.state.currentEventInfo[0]}</h1>
                                            <h4>Description: {this.state.currentEventInfo[1]}</h4>
                                            <h4>Ticketing Section: {this.state.currentEventInfo[2]}</h4>
                                        </div>
                                        <div className={classes.ticketSub}>
                                            <p>Number of Tickets: {result[0]}</p>
                                            <p>Event Creator's Address: {result[1]}</p>
                                            <p>Sale Start Date: {String(new Date(result[2] * 1000))}</p>
                                            <p>Sale End Date: {String(new Date(result[3] * 1000))}</p>
                                            <p>Ticket Price: {result[4]}</p>
                                        </div>
                                    </div>
                                </CardContent>
                                <Button variant="outlined" color="primary" onClick={ () => this.buyTicket(this.state.ticketContractList[i], result[4]) } style = {{margin: 8}}>Purchase Ticket</Button>
                            </Card>)
                    }}
                )
            }
        }
        this.setState({
            fullListing: eventDisplay
        })
    }

    async getCurrentEvent(address){
        let eventId = "";
        await this.state.events.methods.getEventId(address).call({from: this.props.account}).then((result) =>
            eventId = result
        );
        if(eventId !== ""){
            await this.state.events.methods.getEvent(eventId).call({from: this.props.account}).then((result) =>
                this.setState({
                    currentEventInfo: [result[0],result[2],result[3]]
                })
            );
        }
    }

    async loadTicketContracts(){
        await this.state.events.methods.getAllAddresses().call({from: this.props.account}).then((result) =>
            this.setState({
                addressList: result
            }),
        this.eventListing()
        );
    }

    async buyTicket(contract,value){
        try{
            await contract.methods._buyTickets("test",1).send({from: this.props.account,gas: '300000', value: value*10**18})
            alert("You have purchased a ticket for this event.\nThis ticket can be found on the account page.")
        }catch (e) {
            console.log(e)
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <TopBar/>
                <Paper>
                    <div className={classes.toolbar} />
                    <div className={classes.wrapper}>
                        <div className={classes.mainContent}>
                            <h1 className={classes.center}>Active Events</h1>
                            {this.state.fullListing}
                            <Button variant="outlined" color="primary"  style = {{marginBottom: 30}} onClick={this.eventListing}>Refresh Event Listing</Button>
                        </div>
                    </div>
                </Paper>
                <BottomBar account={this.props.account}/>
            </div>
        );
    }
}

const styles = theme => ({
    center: {
        textAlign: "center",
        margin: "auto",
        textDecoration: "underline",
        fontWeight: "bold",
        paddingBottom: "20px",
        paddingTop:"10px"
    },
    wrapper: {
        display: "flex"
    },
    mainContent: {
        width: "100%"
    },
    sidebar: {
        width: "30%",
        backgroundColor: "#86BBD8"
    },
    toolbar: theme.mixins.toolbar,
    event: {
        width: `80%`,
        raised: true,
        border: "solid 2px black",
        backgroundColor: "#F2BB05",
        margin:"auto",
    },
    ticketContent: {
        display:"flex"
    },
    ticketTitle: {
        width: "57%"
    },
    ticketSub: {
        width: "43%"
    },
});

const initialState = {
    events: undefined,
    addressList: [],
    ticketContractList: [],
    fullListing: "",
    currentEventInfo: []
};

export default withStyles(styles, { withTheme: true })(Buying);