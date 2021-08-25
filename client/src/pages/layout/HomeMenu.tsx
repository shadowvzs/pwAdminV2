import React from 'react';
import { Grid } from "@material-ui/core";
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { RootStoreContext } from '../../contexts/RootStoreContext';
import { observer } from 'mobx-react-lite';

const useStyles = makeStyles({
    button: {
        '-moz-box-shadow': '0px 10px 14px -7px #276873',
        '-webkit-box-shadow': '0px 10px 14px -7px #276873',
        boxShadow: '0px 10px 14px -7px #276873',
        background: 'linear-gradient(to bottom, #599bb3 5%, #408c99 100%)',
        filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#599bb3", endColorstr="#408c99",GradientType=0)',
        backgroundColor: '#599bb3',
        '-moz-border-radius': 4,
        '-webkit-border-radius': 4,
        borderRadius: 4,
        display: 'inline-block',
        cursor: 'pointer',
        color: 'white',
        fontFamily: 'Arial',
        fontSize: 16,
        fontWeight: 'bold',
        padding: '7px 16px',
        textDecoration: 'none',
        margin: '4px 2px',
        textShadow: '0px 1px 0px #3d768a',
        '&:hover': {
            background: 'linear-gradient(to bottom, #408c99 5%, #599bb3 100%)',
            filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#408c99", endColorstr="#599bb3",GradientType=0)',
            backgroundColor: '#408c99'
        },
        '&:active': {
            position: 'relative',
            top: 1
        }
    }
});

export const HomeMenu = observer(() => {
    const { authStore } = React.useContext(RootStoreContext);
    const classes = useStyles();
    return (
        <Grid container justifyContent='center'>
            <Grid item>
                <Link className={classes.button} to='/'>Home</Link>
            </Grid>
            <Grid item>
                <Link className={classes.button} to='/info'>Server Info</Link>
            </Grid>
            <Grid item>
                <Link className={classes.button} to='/story'>Story</Link>
            </Grid>
            <Grid item>
                <Link className={classes.button} to='/downloads'>Download</Link>
            </Grid>
            <Grid item>
                <Link className={classes.button} to='/guide'>Guide</Link>
            </Grid>
            {authStore.currentUser ? (
                <Grid item>
                    <Link className={classes.button} to='/logout'>Logout</Link>
                </Grid>
            ) : (
                <>
                    <Grid item>
                        <Link className={classes.button} to='/login'>Login</Link>
                    </Grid>
                    <Grid item>
                        <Link className={classes.button} to='/register'>Registration</Link>
                    </Grid>
                </>            
            )}
        </Grid>
    );
});