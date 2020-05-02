import React, { Component } from 'react'
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import {withStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import Web3 from "web3";
import EventContractABI from "../contracts/Event.json"

const EventContractAddress = "0xd40A64394259C31A4BbA9d29b1e0D0Bd57A6E8F4"

class Host extends Component {

    constructor(props) {
        super(props);
        this.state = initialState;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getMyEvents = this.getMyEvents.bind(this);
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
        this.setState({events : new web3.eth.Contract(EventContractABI.abi,EventContractAddress)})
        this.getMyEvents()
    }

    hostingForm(){
        const { classes } = this.props;
        return(
            <form className={classes.formContent}  autoComplete="off" onSubmit={this.handleSubmit}>
                <TextField
                    id="eventName"
                    label="Event Name"
                    type="string"
                    variant="outlined"
                    required
                    margin="normal"
                    value={this.state.eventName}
                    onChange={this.handleChange}
                    style = {{width: "66%", margin: 8}}/>
                <TextField
                    id="eventDate"
                    label="Event Date"
                    type="date"
                    variant="outlined"
                    required
                    margin="normal"
                    value={this.state.eventDate}
                    onChange={this.handleChange}
                    style = {{width: "31%", margin: 8}}
                    InputLabelProps={{ shrink: true }}/>
                <TextField
                    id="eventDescription"
                    label="Optional Event Description"
                    type="string"
                    variant="outlined"
                    multiline
                    fullWidth
                    margin="normal"
                    value={this.state.eventDescription}
                    onChange={this.handleChange}
                    style = {{width: "98%", margin: 8}}/>
                {this.state.sections.flatMap(sections => [
                    <div style={{width:"100%"}}>
                        <TextField
                        id={"eventSectionNames"+sections}
                        label={"Section "+ sections + " Name"}
                        type="string"
                        variant="outlined"
                        required
                        margin="normal"
                        value={this.state.eventSectionNames[sections-1]}
                        onChange={this.handleMultiChange}
                        style = {{width: "32%", margin: 8}}
                        InputLabelProps={{ shrink: true }}/>
                        <TextField
                        id={"eventSectionAmount"+sections}
                        label={"Section "+ sections + " Amount"}
                        type="number"
                        variant="outlined"
                        required
                        margin="normal"
                        InputProps={{inputProps: {min: 0}}}
                        value={this.state.eventSectionAmount[sections-1]}
                        onChange={this.handleMultiChange}
                        style = {{width: "32%", margin: 8}}
                        InputLabelProps={{ shrink: true }}/>
                        <CurrencyTextField
                        id={"eventSectionPrice"+sections}
                        label={"Section "+ sections + " Price"}
                        currencySymbol="Ξ"
                        variant="outlined"
                        required
                        margin="normal"
                        minimumValue="0"
                        decimalPlaces={18}
                        value={this.state.eventSectionPrice[sections-1]}
                        onChange={this.handleMultiChange}
                        style = {{width: "32%", marginLeft: 8, marginTop: 8, marginBottom: 8}}
                        InputLabelProps={{ shrink: true }}/></div>
                    ])}
                <Button variant="outlined" color="primary" onClick={ () => this.addSection() } style = {{margin: 8}}>Add Seating Section</Button>
                <Button variant="outlined" color="primary" onClick={ () => this.removeSection() } style = {{margin: 8}}>Remove Seating Section</Button>
                <Button variant="outlined" color="primary" type="submit" primary={true} style = {{margin: 8}}>Create Event</Button>
            </form>

        )
    }

    async handleSubmit(event){
        event.preventDefault();
        this.setState({eventOwner: this.props.account});
        //Event info should be sent to contract and tickets should be created based off of values in state here
        if(this.state.eventSectionNames.length > 0) {
            alert("New event submitted!");
            for(let i = 0; i < this.state.eventSectionNames.length; i++){
                await this.state.events.methods.createEvent(this.state.eventName, parseInt(String((new Date(this.state.eventDate).getTime() / 1000)-(Date.now()/1000))), this.state.eventDescription, this.state.eventSectionNames[i], parseInt(this.state.eventSectionAmount[i]), parseInt(this.state.eventSectionPrice[i])).send({
                    from: this.props.account
                });
            }
        }else{
            alert("Event with no seating sections submitted! Nothing was added.")
        }
        this.setState({
            sections: [],
            eventName: "",
            eventDate: "",
            eventDescription: "",
            eventSectionNames: [],
            eventSectionAmount: [],
            eventSectionPrice: [],
        })
    }

    handleChange = (e) => {
        let change = {};
        change[e.target.getAttribute('id')] = e.target.value;
        this.setState(change)
    };

    handleMultiChange = (e) => {
        let change = {};
        let stateName = e.target.getAttribute('id').slice(0,e.target.getAttribute('id').length-1);
        let stateVal = this.state[stateName];
        stateVal[(e.target.getAttribute('id').slice(e.target.getAttribute('id').length-1,e.target.getAttribute('id').length))-1] = e.target.value;
        change[stateName] = stateVal;
        this.setState(change)
    };

    addSection(){
        this.setState({
            sections: this.state.sections.concat([(this.state.sections.length+1)])
        });
    }

    removeSection(){
        this.setState({
            sections: this.state.sections.slice(0,this.state.sections.length-1),
            eventSectionNames: this.state.eventSectionNames.slice(0,this.state.sections.length-1),
            eventSectionAmount: this.state.eventSectionAmount.slice(0,this.state.sections.length-1),
            eventSectionPrice: this.state.eventSectionPrice.slice(0,this.state.sections.length-1),
        });
    }

    myEvents(){
        //Code for events go here, should check against users address and see if they own any events and display them maybe have the ability to cancel or edit events if we get that far.
        let eventDisplay = "";
        if (this.state.myEvents !== null){
            eventDisplay = this.state.myEvents.map(entry => [<h3>Event Name: {entry[0]}</h3>,<h3>Event Date: {String(new Date((entry[6]*1000)+(entry[1]*1000)))}</h3>,<h3>Event Description: {entry[2]}</h3>,<h3>Event Section: {entry[3]}</h3>,<h3>Number of Tickets: {entry[4]}</h3>,<h3 style={{marginBottom: 50}}>Price of each Ticket: {entry[5]}</h3>])
        }

        return(<div>
            {eventDisplay}
            <Button variant="outlined" color="primary"  style = {{marginBottom: 30}} onClick={this.getMyEvents}>Refresh my Events</Button>
        </div>)
    }

    async getMyEvents(){
        if(this.state.events !== undefined) {
            await this.state.events.methods.getMyEvents().call({from: this.props.account}).then((result) =>
                this.setState({
                    myEvents: result
                }));
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
                            <h1 className={classes.center}>Host A New Event</h1>
                            {this.hostingForm()}
                        </div>
                        <div className={classes.sidebar}>
                            <h1 className={classes.center}> My Events</h1>
                            {this.myEvents()}
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
    toolbar: theme.mixins.toolbar,
    formContent: {
        display: 'flex',
        flexWrap: 'wrap',
        paddingTop:"40px",
        paddingLeft: "40px",
        paddingRight: "40px",
    },
});

const initialState = {
    eventOwner: "",
    sections: [],
    eventName: "",
    eventDate: "",
    eventDescription: "",
    eventSectionNames: [],
    eventSectionAmount: [],
    eventSectionPrice: [],
    myEvents: [],
};

export default withStyles(styles, { withTheme: true })(Host);