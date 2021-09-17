
import React from 'react';
import { Grid } from '@mui/material';
import { makeStyles } from "@mui/styles";
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../contexts/RootStoreContext';
import { observer } from 'mobx-react-lite';
import { mainRoutes } from '../../Routes';

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

export const PageMenu = observer(() => {
    const rootStore = React.useContext(RootStoreContext);
    const user = rootStore.authStore.currentUser;
    const classes = useStyles();
    return (
        <Grid container justifyContent='center' style={{ marginTop: 16 }}>
            {mainRoutes.filter(x => !x.visible || x.visible(user!)).map((x, i) => (
                <Grid item key={x.to + Boolean(user)}>
                    <Link className={classes.button} to={x.to}>{x.label}</Link>
                </Grid>
            ))}
        </Grid>
    );
});