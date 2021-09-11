import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles"
import { observer } from "mobx-react-lite";
import React from "react";
import { RootStoreContext } from "../../contexts/RootStoreContext";

const useStyles = makeStyles({
    root: {
        textShadow: '0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15), 1px 1px 2px black, 0 0 25px #000, 0 0 5px #000',
        fontFamily: 'arial',
        fontSize: 44,
        color: 'white',
    }
});

export const HomeTitle = observer(() => {
    const classes = useStyles();
    const { pwServerStore } = React.useContext(RootStoreContext);
    return (
        <Grid container justifyContent='center'>
            <Grid item>
                <Typography className={classes.root}> Welcome on, {pwServerStore.config.get('serverName')} </Typography>
            </Grid>
        </Grid>
    );
});