import React from "react";
import { Grid, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { observer } from "mobx-react-lite";
import { PopoverWrapper } from "./PopoverWrapper";

const useStyles = makeStyles({
    root: {
        minWidth: 200,
        padding: 16,
    },
    input: {
        width: '100px', 
        textAlign: 'right', 
        padding: '2px 4px', 
        marginTop: 2,
        marginRight: 50
    },
    select: {
        fontSize: 12
    }
});

interface ExpireDateSelectProps {
    value: number;
    onChange: (expire: number) => void;

    hideTitle?: boolean
}

export const ExpireDateSelect = observer((props: ExpireDateSelectProps) => {

    const classes = useStyles();

    const onChange = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(ev.currentTarget.value || '0', 10);
        props.onChange(value);
    }, [props]);

    return (
        <Grid className={classes.root}>
           <Grid container>
                {!props.hideTitle && (
                    <Grid item xs={12}>
                        <Typography style={{ fontSize: 18 }} gutterBottom children={'Expire'} />
                    </Grid>
                )}

                <Grid item xs={12}>
                    <Typography style={{ fontSize: 12 }} children={'Expire'} />
                    <TextField
                        label="Next appointment"
                        type="datetime-local"
                        defaultValue="2017-05-24T10:30"
                        onChange={onChange}
                    />
                </Grid>

                <Grid item key='value' xs={6}>
                    <Grid container justifyContent='center'>
                        <Grid item>
                            <input 
                                disabled 
                                value={props.value} 
                                className={classes.input} 
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
});

export const ExpireDateSelectPopover = (props: ExpireDateSelectProps) => {
    return (
        <PopoverWrapper
            editable 
            Cmp={ExpireDateSelect} 
            {...props} 
            boxStyle={{ width: 320 }} 
            title='Expire: '
            tooltip='Edit expire'
        />
    );
};