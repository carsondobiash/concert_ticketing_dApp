import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    appBar: {
        top: 'auto',
        bottom: 0,
        marginLeft: drawerWidth,
        background: 'linear-gradient(45deg, #243B4A 30%, #28587B 70%)',
    },
    menuButton: {
        marginRight: theme.spacing(2),
        color: "white"
    },
    title: {
        flexGrow: 1,
        marginLeft: 10,
    },
    footer: {
        marginLeft: 20,
        fontSize: 17,
        color:"white"
    },
}));

function BottomBar(props) {
    const classes = useStyles();
    return (
        <AppBar position='fixed' className={classes.appBar}>
            <Typography variant='h6' className={classes.footer}>
                Current account address: {props.account}
            </Typography>
        </AppBar>
    );
}

export default BottomBar;