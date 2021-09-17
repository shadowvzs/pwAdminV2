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
        width: 60,
        textAlign: 'right'
    }
});

export const NumberSelect = (props: RenderComponentProps<number | number[]>) => {
    const classes = useStyles();
    const { value, onChange, config } = props;
    const value1 = config.isRange ? (value as number[])[0] : value as number;
    const value2 = config.isRange ? (value as number[])[1] : value as number;

    const onChangeHandler = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        const { value, dataset: { index } } = ev.currentTarget
        const v = parseInt(value, 10);
        if (config.isRange) {
            const finalValue = [value1, value2];
            finalValue[parseInt(index!, 10)] = v;
            if (finalValue[0] > finalValue[1]) { finalValue[0] = finalValue[1]; }
            onChange(finalValue);
        } else {
            onChange(v);
        }
    }, [value1, value2, config, onChange]);

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
                            data-index={0}
                            type='number'
                            value={value1}
                            onChange={onChangeHandler}
                            className={classes.input}
                        />
                    </Grid>
                    {config.isRange && (
                        <Grid item>
                            <input 
                                data-index={1}
                                type='number'
                                value={value2}
                                onChange={onChangeHandler}
                                className={classes.input}
                            />
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
};
