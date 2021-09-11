import React from "react";
import { Checkbox, FormControlLabel, Grid, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles";
import { PopoverWrapper } from "../PopoverWrapper";
import { RootStoreContext } from "../../contexts/RootStoreContext";

const useStyles = makeStyles({
    root: {
        minWidth: 200,
        padding: 16,
    },
    input: {
        width: 50, 
        textAlign: 'right', 
        padding: '2px 4px', 
        marginTop: 2
    }
});

interface ClassMaskProps {
    value: number;
    onChange: (mask: number) => void;

    hideTitle?: boolean
}


export const ClassMaskBuilder = (props: ClassMaskProps) => {

    const { pwServerStore } = React.useContext(RootStoreContext);
    const { maxClass, maxMask, classes: pwClasses } = pwServerStore.data.classes;
    const classes = useStyles();

    const onCheckboxChange = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        const { value, onChange } = props;
        const t = ev.currentTarget;
        const isChecked = t.checked;
        const v = parseInt(t.value || '0', 10);
        const newMask = value + (isChecked ? v : -v);
        onChange(newMask);
    }, [props]);

    const onToggleAll = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        const { value, onChange } = props;
        const newMask = value === maxMask ? 0 : maxMask;
        onChange(newMask);
    }, [props, maxMask]);

    return (
        <Grid className={classes.root}>
           <Grid container>
                {!props.hideTitle && (
                    <Grid item xs={12}>
                        <Typography style={{ fontSize: 18 }} gutterBottom children={'Class Mask'} />
                    </Grid>
                )}
                {pwClasses.slice(0, maxClass).map(x => (
                    <Grid item key={x.mask} xs={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={Boolean(props.value & x.mask)}
                                    onChange={onCheckboxChange}
                                    value={x.mask}
                                    color='primary'
                                    size='small'
                                    style={{ padding: 4 }}
                                />
                            }
                            label={<Typography children={x.name} style={{ fontSize: 12 }} />}
                        />
                    </Grid>
                ))}
                <Grid item key='all' xs={6}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={Boolean(props.value === maxMask)}
                                onChange={onToggleAll}
                                color='primary'
                                size='small'
                                style={{ padding: 4 }}
                            />
                        }
                        label={<Typography  style={{ fontSize: 12 }} children={'Select All'} />}
                    />
                </Grid>
                <Grid item key='value' xs={6}>
                    <input disabled value={String(props.value || 0)} className={classes.input} />
                </Grid>
            </Grid>
        </Grid>
    );
};

export const ClassMaskBuilderPopover = (props: ClassMaskProps) => {
    return (
        <PopoverWrapper 
            editableInput
            Cmp={ClassMaskBuilder} 
            {...props}
            title='Class Mask: '
            tooltip='Edit class mask'
        />
    );
};