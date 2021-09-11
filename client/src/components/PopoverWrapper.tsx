import React from "react";
import { Grid, IconButton, Popover, Typography } from "@material-ui/core";
import SettingsIcon from '@material-ui/icons/Settings';

export interface PopoverWrapperProps<T> {
    value: T;
    onChange: (value: T) => void;
    hideTitle?: boolean;
    title?: string;

    Cmp: (props: Omit<PopoverWrapperProps<T>, 'Cmp'>) => JSX.Element;
    inputStyle?: React.CSSProperties;
    boxStyle?: React.CSSProperties;
    tooltip?: string;
    editableInput?: boolean;
}

export const PopoverWrapper = (props: PopoverWrapperProps<any>) => {
    const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
    const { 
        Cmp,
        inputStyle,
        boxStyle,
        tooltip,
        title,
        editableInput,
        ...rest 
    } = props;

    const handleClick = React.useCallback((event: React.MouseEvent<Element>) => { 
        setAnchorEl(event.currentTarget); 
    }, []);

    const handleClose = React.useCallback(() => { 
        setAnchorEl(null); 
    }, []);

    const onChange = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => { 
        const v = ev.currentTarget.value;
        if (typeof props.value === 'number') {
            props.onChange(parseInt(v, 10))
        } else {
            props.onChange(v)
        }
    }, [props]);

    const open = Boolean(anchorEl);

    return (
        <div>
            <Grid container spacing={0} justifyContent='space-between' alignItems='center'>
                {title && (
                    <Grid item>
                        <Typography variant='body2' children={title} />
                    </Grid>
                )}
                <Grid item>
                    <Grid container alignItems='center' wrap='nowrap'>
                        <Grid item>
                            <input 
                                disabled={!editableInput}
                                onChange={onChange}
                                value={props.value} 
                                style={{ 
                                    textAlign: 'right', 
                                    padding: '2px 4px', 
                                    width: 70, 
                                    ...inputStyle 
                                }} 
                            />
                        </Grid>
                        <Grid item>
                            <IconButton size='small' onClick={handleClick} title={tooltip}>
                                <SettingsIcon />
                            </IconButton>                        
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div style={{ width: 240, ...boxStyle }}>
                    <Cmp {...rest} />
                </div>
            </Popover>  
        </div>
    );
};