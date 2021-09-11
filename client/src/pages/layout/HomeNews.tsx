import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles"
import React from "react";
import { RootStoreContext } from "../../contexts/RootStoreContext";

const useStyles = makeStyles({
    box: {
        position: 'relative',
        backgroundColor: '#eee',
        border: '1px inset #333',
        boxShadow: '10px 10px 14px -7px #777',
        transition: '0.4s ease-in',
        maxWidth: 700,
        margin: '24px auto 24px auto',
        fontFamily: 'Arial',
        fontSize: 12,
        opacity: 0.85,
    },
    boxheader: {
        position: 'relative',
        margin: 1,
        height: 20,
        border: '1px solid #000',
        lineHeight: '20px',
        fontSize: 16,
        textShadow: '1px 1px 2px #000, 0px 0px 1px #000',
        color: 'white',
        backgroundColor: 'white',
        background: 'linear-gradient(-90deg, #88d, #337)'
    },
    boxContent: {
        position: 'relative',
        border: '1px solid #777',
        margin: 1,
        padding: '10px 20px',
        backgroundColor: 'white',
        background: 'linear-gradient(-90deg, #eef, #ddf)'
    }
});

export const HomeNews = () => {
    const classes = useStyles();
    
    const { pwServerStore } = React.useContext(RootStoreContext);
    pwServerStore.config.get('serverName');

    return (
        <Grid container direction='column' className={classes.box}>
            <Grid item className={classes.boxheader}>
                Last News
            </Grid>
            <Grid item className={classes.boxContent}>
                <table><tbody><tr><td><b>This patch changes (v2 - 2016.10.30): </b></td></tr>
                <tr><td> - item mall prices changed, added +10 Con stone (crit &amp; channeling), HH99 mats, set etc, removed Wall of Fame</td></tr>
                <tr><td> - changed start gear (full HH90+12 with 4 socket with Lv7 HP stones, weapon +9)</td></tr>
                <tr><td> - dual fairy pill bug fixed and reseted the skills</td></tr>
                <tr><td> - now start directly with level 79 culti and you can take lv89 quest from npc where you start</td></tr>
                <tr><td> - Gold selling/buying disabled at Auction Hall for avoid the cheating with starter gold</td></tr>
                <tr><td> - For Chrono World don't need anymore the chrono culti quest chain.</td></tr></tbody></table>
            </Grid>
        </Grid>
    );
};