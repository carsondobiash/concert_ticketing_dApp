import React, { Component } from 'react'
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import {withStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper/Paper";
import Web3 from "web3";
import EventContractABI from "../contracts/Event";
import TicketContractABI from "../contracts/TicketResale";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import CurrencyTextField from "@unicef/material-ui-currency-textfield";

const EventContractAddress = "0xf1d36d56b7c57b1cf9cf79716cf772467016bfa0"

class Resale extends Component {

    constructor(props) {
        super(props);
        this.state = initialState;
        this.eventListing = this.eventListing.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        if (this.state.ticketContractList !== [] && this.state.ticketContractList !== undefined) {
            for (let i = 0; i < this.state.ticketContractList.length; i++) {
                this.setState({
                    currentContract: this.state.ticketContractList[i]
                })
                this.getCurrentEvent(this.state.ticketContractList[i].options['address'], i);
                let ticketCount = -1;
                await this.state.ticketContractList[i].methods.getMyTicketCount(this.props.account).call({from: this.props.account}).then((count) => {
                    ticketCount = count;
                });
                if(this.state.ticketContractList[i] !== undefined) {
                    await this.state.ticketContractList[i].methods.getMyTicketIds(this.props.account).call({from: this.props.account}).then((result) => {
                        this.setState({
                            resaleList: result
                        })
                    })
                } if(this.state.ticketContractList[i] !== undefined) {
                    await this.state.ticketContractList[i].methods.list_2ndHand_tickets().call({from: this.props.account}).then((result) => {
                        let stillAvailable = this.state.resaleList.filter(e => !result.includes(e));
                        this.setState({
                            resaleList: stillAvailable
                        })
                    })
                }
                let ticket;
                for (ticket in this.state.resaleList) {
                    if (this.state.ticketContractList[i] !== undefined) {
                        await this.state.ticketContractList[i].methods.getTicketInfo(ticket).call({from: this.props.account}).then((result) => {
                            if (result[3] > Date.now() / 1000 && this.state.currentEventInfo[i] !== undefined && result[0].toUpperCase() === this.props.account.toUpperCase()) {
                                eventDisplay.push(
                                    <Card className={classes.event} style={{margin: 8}}>
                                        <CardContent>
                                            <div className={classes.ticketContent}>
                                                <div className={classes.ticketTitle}>
                                                    <h1>{this.state.currentEventInfo[i][0]}</h1>
                                                    <h4>Description: {this.state.currentEventInfo[i][1]}</h4>
                                                    <h4>Ticketing Section: {this.state.currentEventInfo[i][2]}</h4>
                                                </div>
                                                <div className={classes.ticketSub}>
                                                    <p>Ticket Owners Address: {result[0]}</p>
                                                    <p>Event Creator's Address: {result[1]}</p>
                                                    <p>Sale Start Date: {String(new Date(result[2] * 1000))}</p>
                                                    <p>Sale End Date: {String(new Date(result[3] * 1000))}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <form className={classes.formContent} autoComplete="off"
                                              onSubmit={this.handleSubmit}>
                                            <CurrencyTextField
                                                id={"eventSectionPrice"}
                                                label={"Price"}
                                                currencySymbol="Ξ"
                                                variant="outlined"
                                                required
                                                margin="normal"
                                                minimumValue="0"
                                                decimalPlaces={18}
                                                value={this.state.amount}
                                                onChange={this.handleChange}
                                                size={"small"}
                                                style={{width: "20%", marginLeft: 8, marginTop: 8, marginBottom: 8}}
                                                InputLabelProps={{shrink: true}}/>
                                            <Button variant="outlined" color="primary" type="submit" primary={true}
                                                    style={{width: "10%", margin: 8}}>Sell Ticket</Button>
                                        </form>
                                    </Card>)
                            }
                        })
                    }
                }
            }
        }
        this.setState({
            fullListing: eventDisplay
        })
    }

    async handleSubmit(event) {
        event.preventDefault();
        if(this.state.amount > 0){
            let ticketId = "";
            await this.state.currentContract.methods.getMyTicketIds(this.props.account).call({from: this.props.account}).then((result) => {
                ticketId = result[0]
                }
            )
            if(ticketId !== ""){
                this.setState({
                    eventIdArray: this.state.eventIdArray.concat([ticketId])
                })
                try{
                    await this.state.currentContract.methods.sell_my_tickets([ticketId],parseInt(this.state.amount)).send({from: this.props.account,gas: '300000'})
                    alert("You have listed a ticket to sell for this event.\nThis ticket can be found on the buying page.")
                }catch (e) {
                    console.log(e)
                }
            }
        }
    }

    async getMyTicketIds(){
        await this.state.currentContract.methods.getMyTicketIds(this.props.account).call({from: this.props.account}).then((result) => {
                 return result[0]
            }
        )
    }

    async getCurrentEvent(address,i){
        let eventId = "";
        await this.state.events.methods.getEventId(address).call({from: this.props.account}).then((result) =>
            eventId = result
        );
        if(eventId !== ""){
            let tempArray = []
            tempArray = this.state.currentEventInfo
            await this.state.events.methods.getEvent(eventId).call({from: this.props.account}).then((result) =>
                tempArray[i] = [result[0],result[2],result[3]]
            );
            this.setState({
                currentEventInfo: tempArray,
            })
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

    handleChange = (e) => {
        this.setState({
            amount: e.target.value
        })
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                <TopBar/>
                <Paper>
                    <div className={classes.toolbar} />
                    <div className={classes.wrapper}>
                        <div className={classes.mainContent}>
                            <h1 className={classes.center}>My Tickets</h1>
                            {this.state.fullListing}
                            <Button variant="outlined" color="primary"  style = {{marginBottom: 30}} onClick={this.eventListing}>Refresh My Tickets</Button>
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
    currentEventInfo: [],
    amount:"",
    eventIdArray: []
};

export default withStyles(styles, { withTheme: true })(Resale);