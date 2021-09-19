import { Grid, NativeSelect, Typography } from "@mui/material";
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

export const ComboSelect = (props: RenderComponentProps<number>) => {
    const classes = useStyles();
    const { onChange, config } = props;

    const onChangeHandler = React.useCallback((ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { value } = ev.currentTarget
        onChange(config.type.includes('float') ? parseFloat(value) : parseInt(value, 10));
        console.log(config.type, value, config.type === 'float' ? parseFloat(value) : parseInt(value, 10))
    }, [onChange, config]);

    return (
        <Grid container className={classes.root} spacing={1} alignItems='center' justifyContent='space-between' wrap='nowrap'>
            <Grid item>
                <Typography 
                    variant='body2'
                    children={config.label}
                />
            </Grid>
            <Grid item>
                <Grid container spacing={1} alignItems='center' justifyContent='flex-end' wrap='nowrap'>
                    {Boolean(config.options) && (
                        <Grid item>
                            <NativeSelect 
                                size='small'
                                value={props.value}
                                onChange={onChangeHandler}
                                style={{ fontSize: 12, maxWidth: 100 }}
                            >
                                {config.options!.map(([label, val], idx) => (
                                    <option key={idx} value={val}>{label}</option>
                                ))}
                            </NativeSelect>
                        </Grid>
                    )}
                    {config.showInput && (
                        <Grid item>
                            <input 
                                data-index={0}
                                type='number'
                                value={props.value}
                                onChange={onChangeHandler}
                                className={classes.input}
                                min='0'
                                step={config.type.includes('float') ? 0.01 : 1}
                            />
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
};
