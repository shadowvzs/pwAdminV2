import React from "react";
import { makeStyles } from "@mui/styles";
import { Checkbox, FormControlLabel, Grid, NativeSelect, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { PopoverWrapper } from "./PopoverWrapper";
import { RootStoreContext } from "../../../contexts/RootStoreContext";

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

interface ProctypeProps {
    value: number;
    onChange: (proctype: number) => void;

    hideTitle?: boolean
}


export const ProctypeBuilder = observer((props: ProctypeProps) => {

    const classes = useStyles();
    const { pwServerStore } = React.useContext(RootStoreContext);
    const { proctypes } = pwServerStore.data.item_extra;

    const onCheckboxChange = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = ev.currentTarget;
        const v = parseInt(value || '0', 10);
        const newMask = props.value + (checked ? v : -v);
        props.onChange(newMask);
    }, [props]);

    const onChange = React.useCallback((ev: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(ev.currentTarget.value || '0', 10);
        props.onChange(value);
    }, [props]);

    return (
        <Grid className={classes.root}>
           <Grid container>
                {!props.hideTitle && (
                    <Grid item xs={12}>
                        <Typography style={{ fontSize: 18 }} gutterBottom children={'Proctype'} />
                    </Grid>
                )}
                {proctypes.map(x => (
                    <Grid item key={x.id} xs={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={Boolean(props.value & x.id)}
                                    onChange={onCheckboxChange}
                                    value={x.id}
                                    color='primary'
                                    size='small'
                                    style={{ padding: 4 }}
                                />
                            }
                            label={<Typography children={x.name} style={{ fontSize: 12 }} />}
                        />
                    </Grid>
                ))}

                <Grid item key='select' xs={6}>
                    <NativeSelect 
                        value={props.value.toString()} 
                        onChange={onChange}
                        variant='standard'
                        className={classes.select}
                    >
                        <option value={'0'}>Free</option>
                        <option value={'1'}>Revival Scroll</option>
                        <option value={'8'}>Fashion, Flyer</option>
                        <option value={'19'}>No drop, trade</option>
                        <option value={'64'}>Bind Equip</option>
                        <option value={'32791'}>Soulbound</option>
                    </NativeSelect>
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

export const ProctypeBuilderPopover = (props: ProctypeProps) => {
    return (
        <PopoverWrapper
            editable 
            Cmp={ProctypeBuilder} 
            {...props} 
            boxStyle={{ width: 320 }} 
            title='Proctype: '
            tooltip='Edit proctype'
        />
    );
};