import React, { Component } from 'react'
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import {withStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper/Paper";
import List from "@material-ui/core/List";
import Ticket from "../components/Ticket";

class Account extends Component {

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
                                <Ticket account={this.props.account}/>
                                <br/>
                                <Ticket account={this.props.account}/>
                            </List>
                        </div>
                        <div className={classes.sidebar}>
                            <h1 className={classes.center}> Account Options</h1>
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
});

export default withStyles(styles, { withTheme: true })(Account);