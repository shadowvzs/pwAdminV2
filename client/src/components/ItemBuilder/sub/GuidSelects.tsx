import React from "react";

import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../contexts/RootStoreContext";
import { ItemKey } from "../../../interfaces/common";
import { makeStyles } from "@mui/styles";
import { Grid, Typography } from "@mui/material";

const useStyles = makeStyles({
    root: {
        fontSize: 12,
        padding: '0 16px'
    }
});

interface GuidSelectsProps {
    value1: number;
    value2: number;
    onChange: (key: ItemKey, value: string | number) => void;
}

export const GuidSelects = observer((props: GuidSelectsProps) => {
    const classes = useStyles();
    const { authStore } = React.useContext(RootStoreContext);
    if (!authStore.currentUser) { return null; }

    const onChange = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = ev.currentTarget;
        const v = isNaN((parseInt(value, 10))) ? 0 : parseInt(value, 10);
        props.onChange(name as 'guid1' | 'guid2', v);
    }, [props]);

    return (
        <Grid container className={classes.root} spacing={2}>
            <Grid item xs={6}>
                <Grid container wrap='nowrap' alignItems='center' spacing={1}>
                    <Grid item>
                        <Typography 
                            variant='body2'
                            children='Guid1: '
                        />
                    </Grid>
                    <Grid item>
                        <input 
                            name='guid1'
                            type='number'
                            value={props.value1}
                            style={{ fontSize: 12, width: 50, padding: '2px 4px' }}
                            onChange={onChange}                                                  
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Grid container wrap='nowrap' alignItems='center' spacing={1}>
                    <Grid item>
                        <Typography 
                            variant='body2'
                            children='Guid2: '
                        />
                    </Grid>
                    <Grid item>
                        <input 
                            name='guid2'
                            type='number'
                            value={props.value2}
                            style={{ fontSize: 12, width: 50, padding: '2px 4px' }}
                            onChange={onChange}                                                  
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
});
