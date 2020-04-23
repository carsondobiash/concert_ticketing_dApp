import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";

class Homepage extends Component {

    render() {
        const { classes } = this.props;
        return (
            <div>
                <TopBar/>
                <Paper>
                    <div className={classes.toolbar} />
                    <e>{this.props.account}</e>
                </Paper>
                <BottomBar account={this.props.account}/>
            </div>
        );
    }
}

const styles = theme => ({
    toolbar: theme.mixins.toolbar,
});

export default withStyles(styles, { withTheme: true })(Homepage);