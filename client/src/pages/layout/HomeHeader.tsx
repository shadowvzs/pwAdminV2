import { Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles";
import { observer } from "mobx-react-lite";
import React from "react";
import { TimerCmp } from "../../components/TimerCmp";
import { RootStoreContext } from "../../contexts/RootStoreContext";

const useStyles = makeStyles({
    sidebar: {
        width: 100, 
        textShadow: '2px 2px 5px #000, 0px 0px 1px #000',
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center'
    },
});

export const HomeHeader = observer(() => {
    const classes = useStyles();
    const { pwServerStore } = React.useContext(RootStoreContext);

    return (
        <Grid container direction='row' justifyContent='center'>
            <Grid item className={classes.sidebar}>
                <div style={{ color: '#ffff88' }}> { pwServerStore.config.get('serverName') } </div> 
            </Grid>
            <Grid item>
                <img src='/images/banner.jpg' alt={'Banner'} style={{ maxWidth: '100%' }} />
            </Grid>
            <Grid item className={classes.sidebar}>
                {pwServerStore.serverStatuses.map((item, idx) => (
                    <div key={idx}>
                        <div style={{ color: '#ffffcc' }}>{item.name}</div>
                        {item.status && <div style={{ color: 'lightgreen' }}>Online</div>}
                        {!item.status && <div style={{ color: 'red' }}>Offline</div>}
                        <TimerCmp style={{ color: '#ffffee' }} />
                    </div>
                ))}
            </Grid>
        </Grid>
    );
});