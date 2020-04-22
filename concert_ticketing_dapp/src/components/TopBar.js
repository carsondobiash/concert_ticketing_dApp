import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { MenuItem } from '@material-ui/core';
import {Link} from 'react-router-dom'


const useStyles  = makeStyles(theme => ({
    appBar: {
        width: `100%`,
        background: 'linear-gradient(45deg, #1E4D2B 30%, #59595B 90%)',
    },
    menuButton: {
        marginRight: theme.spacing(2),
        color: "white"
    },
    title: {
        flexGrow: 1,
    },
    toolbar: theme.mixins.toolbar,
}));

function TopBar() {
    const classes = useStyles();
    return(
        <AppBar position='fixed' className={classes.appBar}>
            <Toolbar>
                <MenuItem component={Link} to={'/'}>
                    <Typography variant='h6' className={classes.title}>
                        Home
                    </Typography>
                </MenuItem>
                <MenuItem component={Link} to={'/account'}>
                    <Typography variant='h6' className={classes.title}>
                        Account
                    </Typography>
                </MenuItem>
            </Toolbar>
        </AppBar>
    )
}

export default TopBar;