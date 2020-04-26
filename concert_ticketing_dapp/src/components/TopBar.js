import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { MenuItem, Button } from '@material-ui/core';


const useStyles  = makeStyles(theme => ({
    appBar: {
        width: `100%`,
        background: 'linear-gradient(45deg, #243B4A 30%, #28587B 70%)',
    },
    menuButton: {
        marginRight: theme.spacing(1),
        color: "white",
        textTransform:"none",
        '&:hover': {
            color:"#F2BB05"
        }
    },
    title: {
        flexGrow: 1,
        color:"white",
    },
    toolbar: theme.mixins.toolbar,
}));

function TopBar() {
    const classes = useStyles();
    return(
        <AppBar position='fixed' className={classes.appBar}>
            <Toolbar>
                <MenuItem style={{flex:1}}>
                    <Typography variant='h3' className={classes.title}>
                        Concert Ticketing dApp
                    </Typography>
                </MenuItem>
                <div>
                    <Button classes={classes.menuButton} href={"/"}>
                        <Typography variant='h6' className={classes.menuButton}>
                            Home
                        </Typography>
                    </Button>
                    <Button classes={classes.menuButton} href={"/account"}>
                        <Typography variant='h6' className={classes.menuButton}>
                            Account
                        </Typography>
                    </Button>
                    <Button classes={classes.menuButton} href={"/host"}>
                        <Typography variant='h6' className={classes.menuButton}>
                            Host Event
                        </Typography>
                    </Button>
                    <Button classes={classes.menuButton} href={"/buy"}>
                        <Typography variant='h6' className={classes.menuButton}>
                            Buy Tickets
                        </Typography>
                    </Button>
                    <Button classes={classes.menuButton} href={"/sell"}>
                        <Typography variant='h6' className={classes.menuButton}>
                            Sell Tickets
                        </Typography>
                    </Button>
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default TopBar;