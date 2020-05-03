import React, { Component } from 'react'
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import {withStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper/Paper";
import List from "@material-ui/core/List";
import Ticket from "../components/Ticket";
import Web3 from "web3";
import EventContractABI from "../contracts/Event.json";
import TicketContractABI from "../contracts/TicketResale.json";

const EventContractAddress = "0x9ef8cee36c9a2cb2250d879f74c262438f8c13e0";

class Account extends Component {

    constructor(props) {
        super(props);
        this.state = initialState;
        this.tickets = this.tickets.bind(this);
    }

    componentWillMount() {
        this.loadBlockchainData();
    }

    componentDidMount() {
        this.tickets();
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
        this.setState({events : new web3.eth.Contract(EventContractABI.abi,EventContractAddress)});
    }


    async getCurrentEvent(address,i){
        let eventId = "";
        await this.state.events.methods.getEventId(address).call({from: this.props.account}).then((result) =>
            eventId = result
        );
        if(eventId !== ""){
            let tempArray = [];
            tempArray = this.state.currentEventInfo;
            await this.state.events.methods.getEvent(eventId).call({from: this.props.account}).then((result) =>
                tempArray[i] = [result[0],result[2],result[3]]
            );
            this.setState({
                currentEventInfo: tempArray,
            })
        }
    }


    async getMyTicketIds(){
        await this.state.currentContract.methods.getMyTicketIds(this.props.account).call({from: this.props.account}).then((result) => {
                return result[0];
            }
        )
    }



    async tickets(){
        this.setState({
            ticketContractList: [],
        });


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


        let ticketList = [];
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
                });
                this.getCurrentEvent(this.state.ticketContractList[i].options['address'], i);

                if(this.state.ticketContractList[i] !== undefined) {
                    await this.state.ticketContractList[i].methods.getMyTicketIds(this.props.account).call({from: this.props.account}).then((result) => {
                        this.setState({
                            allTickets: result
                        })
                    })
                }


                let ticket;
                for (ticket in this.state.allTickets) {
                    if (this.state.ticketContractList[i] !== undefined) {
                        await this.state.ticketContractList[i].methods.getTicketInfo(ticket).call({from: this.props.account}).then((result) => {
                            if (result[3] > Date.now() / 1000 && this.state.currentEventInfo[i] !== undefined && result[0].toUpperCase() === this.props.account.toUpperCase()) {
                                ticketList.push(
                                    <Ticket
                                        name={this.state.currentEventInfo[i][0]}
                                        description={this.state.currentEventInfo[i][1]}
                                        section={this.state.currentEventInfo[i][2]}
                                        account={result[0]}
                                        eventOwner={result[1]}
                                        endDate={String(new Date(result[3] * 1000))}
                                    />)
                            }
                        });
                    }
                }

            }
        }
        this.setState({
            finalTickets: ticketList
        });

        console.log(this.state)

    }


    async loadTicketContracts(){
        await this.state.events.methods.getAllAddresses().call({from: this.props.account}).then((result) =>
                this.setState({
                    addressList: result
                }),
            this.tickets()
        );
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
                            <h1 className={classes.center}>Account Information</h1>
                            <h3 style={{paddingLeft:"20px", textDecoration:"underline"}}>My Tickets</h3>
                            <List>
                                {this.state.finalTickets}
                            </List>
                        </div>
                        <div className={classes.sidebar}>
                            <h1 className={classes.center}> Account Options</h1>
                            <ul className={classes.liststyle}>
                                <li><h3><a href="/buy">Buy more tickets</a></h3></li>
                                <li><h3><a href="/sell">Sell your tickets</a></h3></li>
                            </ul>
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
        width: "70%"
    },
    sidebar: {
        width: "30%",
        backgroundColor: "#86BBD8"
    },
    liststyle:{
        listStyleType: "square"
    },
    toolbar: theme.mixins.toolbar,
});

const initialState = {
    events: undefined,
    addressList: [],
    ticketContractList: [],
    finalTickets: "",
    currentEventInfo: [],
    eventIdArray: []
};

export default withStyles(styles, { withTheme: true })(Account);