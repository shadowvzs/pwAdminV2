import { Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";

import { RenderComponentProps } from "../../../../interfaces/builder";

const useStyles = makeStyles({
    root: {
        fontSize: 12,
        // padding: '0 16px'
    },
    input: {
        padding: '2px 4px', 
        width: 128,
        textAlign: 'right'
    }
});

export const TextSelect = (props: RenderComponentProps<string>) => {
    const classes = useStyles();
    const { value, onChange, config } = props;

    const onChangeHandler = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        onChange(ev.currentTarget.value);
    }, [onChange]);

    return (
        <Grid container className={classes.root} alignItems='center' justifyContent='space-between'>
            <Grid item>
                <Typography 
                    variant='body2'
                    children={config.label}
                />
            </Grid>
            <Grid item>
                <Grid container spacing={1} justifyContent='flex-end'>
                    <Grid item>
                        <input 
                            type='text'
                            value={value || ''}
                            onChange={onChangeHandler}
                            className={classes.input}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};
