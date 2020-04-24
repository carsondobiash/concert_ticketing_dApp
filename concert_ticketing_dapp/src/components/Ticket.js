import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

import CardContent from '@material-ui/core/CardContent';


const useStyles  = makeStyles(theme => ({
    ticket: {
        width: `70%`,
        raised: true,
        border: "solid 2px black",
        backgroundColor: "#F2BB05",
        margin:"auto"
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
    toolbar: theme.mixins.toolbar
}));

function Ticket(props) {
    const classes = useStyles();
    return(

        <Card className={classes.ticket}>
            <CardContent>
                <div className={classes.ticketContent}>
                    <div className={classes.ticketTitle}>
                        <h1>Concert Title</h1>
                        <h4>Mar 14, 2021</h4>
                    </div>
                    <div className={classes.ticketSub}>
                        <p>Owner: {props.account}</p>
                        <p>Section: GA</p>
                    </div>
                </div>
            </CardContent>
        </Card>



    )
}

export default Ticket;