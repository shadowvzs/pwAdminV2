import { Settings } from "@mui/icons-material";
import { Grid, IconButton, Popover, Typography } from "@mui/material";
import React from "react";


export interface PopoverWrapperProps<T> {
    value: T;
    onChange: (value: T) => void;
    hideTitle?: boolean;
    title?: string;

    BaseCmp?: () => JSX.Element;
    Cmp: (props: Pick<PopoverWrapperProps<T>, 'value' | 'onChange' | 'hideTitle'>) => JSX.Element;
    inputStyle?: React.CSSProperties;
    boxStyle?: React.CSSProperties;
    tooltip?: string;
    editable?: boolean;
}

export const PopoverWrapper = (props: PopoverWrapperProps<any>) => {
    const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
    const { 
        BaseCmp,
        Cmp,
        inputStyle,
        boxStyle,
        tooltip,
        title,
        editable,
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
                            { BaseCmp ? (
                                <BaseCmp />
                            ) : (
                                <input 
                                    disabled={!editable}
                                    onChange={onChange}
                                    value={props.value} 
                                    style={{ 
                                        textAlign: 'right', 
                                        padding: '2px 4px', 
                                        width: 70, 
                                        ...inputStyle 
                                    }} 
                                />
                            )}
                        </Grid>
                        <Grid item>
                            <IconButton 
                                size='small' 
                                onClick={handleClick} 
                                title={tooltip}
                                disabled={!editable}
                                style={{ padding: 0 }}
                            >
                                <Settings />
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