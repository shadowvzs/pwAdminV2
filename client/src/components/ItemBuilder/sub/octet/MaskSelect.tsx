import React from "react";

import { PopoverWrapper } from "../PopoverWrapper";
import { RootStoreContext } from "../../../../contexts/RootStoreContext";
import { makeStyles } from "@mui/styles";
import { FormControlLabel, Grid, Radio, RadioGroup, Typography } from "@mui/material";

const useStyles = makeStyles({
    root: {
        fontSize: 12,
        padding: '0 16px'
    }
});

interface MaskSelectsProps {
    value: number;
    onChange: (mask: number) => void;
}

export const MaskSelect = (props: MaskSelectsProps) => {
    const classes = useStyles();
    const { pwServerStore } = React.useContext(RootStoreContext);
    const { equipments, version } = pwServerStore.data.item_extra;
    
    const onChange = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        const t = ev.currentTarget;
        const v = parseInt(t.value || '0', 10);
        props.onChange(v);
    }, [props]);

    return (
        <Grid container direction='column' className={classes.root}>
            <Grid item>
                <Typography 
                    variant='h6'
                    children='Mask: '
                />
            </Grid>
            <Grid item>
                <RadioGroup 
                    aria-label="mask" 
                    name="mask" 
                    value={props.value} 
                    onChange={onChange}
                    style={{ flexDirection: 'row' }}
                >
                {equipments.filter(x => !x.version || x.version <= version).map(x => (
                        <FormControlLabel
                            style={{ flexBasis: '50%', margin: 0 }}
                            control={
                                <Radio
                                    value={x.mask}
                                    color='primary'
                                    size='small'
                                    style={{ padding: 2 }}
                                />
                            }
                            label={(
                                <Typography 
                                    children={x.name} 
                                    noWrap 
                                    title={x.name}
                                    style={{ maxWidth: 80, fontSize: 12 }} 
                                />
                            )}
                        />
                
                ))}
                </RadioGroup>
                <Grid item key='value' style={{ padding: 8, textAlign: 'right' }}>
                    <input 
                        disabled 
                        value={String(props.value || 0)} 
                        style={{ padding: '2px 4px', width: 100, textAlign:'right' }} 
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

export const MaskBuilderPopover = (props: MaskSelectsProps) => {
    return (
        <PopoverWrapper 
            editable
            Cmp={MaskSelect} 
            {...props}
            title='Mask: '
            tooltip='Edit mask'
        />
    );
};