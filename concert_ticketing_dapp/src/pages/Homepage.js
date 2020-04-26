import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import BottomBar from "../components/BottomBar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography/Typography";

class Homepage extends Component {

    render() {
        const { classes } = this.props;
        return (
            <div style={{height:"100%"}}>
                {/*<TopBar/>*/}
                <Paper className={classes.fullPage}>
                    <div className={classes.center}>
                        <Typography variant='h2' className={classes.title}>
                            Concert Ticketing dApp
                        </Typography>
                    </div>
                    <div className={classes.center}>
                        <Button classes={classes.menuButton} href={"/account"}>
                            <Typography variant='h4' className={classes.menuButton}>
                                Account
                            </Typography>
                        </Button>
                        <Button classes={classes.menuButton} href={"/host"}>
                            <Typography variant='h4' className={classes.menuButton}>
                                Host Event
                            </Typography>
                        </Button>
                    </div>
                    <div className={classes.center}>
                        <Button classes={classes.menuButton} href={"/buy"}>
                            <Typography variant='h4' className={classes.menuButton}>
                                Buy Tickets
                            </Typography>
                        </Button>
                        <Button classes={classes.menuButton} href={"/sell"}>
                            <Typography variant='h4' className={classes.menuButton}>
                                Sell Tickets
                            </Typography>
                        </Button>
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
        fontWeight: "bold",
        paddingBottom: "20px",
        paddingTop:"10px"
    },
    menuButton: {
        margin:"auto",
        marginRight: theme.spacing(1),
        color: "white",
        textTransform:"none",
        '&:hover': {
            color:"#F2BB05"
        }
    },
    title: {
        margin:"auto",
        color:"white",
        fontWeight:"400"
    },
    fullPage: {
        width: `100%`,
        height:'100%',
        background: 'linear-gradient(45deg, #243B4A 30%, #28587B 70%)',
    },
    toolbar: theme.mixins.toolbar,
});

export default withStyles(styles, { withTheme: true })(Homepage);