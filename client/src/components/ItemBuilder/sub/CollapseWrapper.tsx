import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, Grid } from "@mui/material";
import React from "react";


export interface CollapseWrapperProps<T> {
    value: T;
    onChange: (value: T) => void;

    BaseCmp: () => JSX.Element;
    Cmp: (props: Omit<CollapseWrapperProps<T>, 'Cmp' | 'BaseCmp'>) => JSX.Element;
    disabled?: boolean;
}

export const CollapseWrapper = (props: CollapseWrapperProps<any>) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const { 
        BaseCmp,
        Cmp,
        disabled,
        ...rest 
    } = props;

    const onToggle = React.useCallback((event: React.MouseEvent<Element>) => { 
        setOpen(!open);
    }, [open]);

    const buttonProps = { 
        onClick: disabled ? undefined : onToggle, 
        disabled,
        style: { opacity: disabled ? 0.56 : 1 }
    };
    const expandButton = open ? <ExpandLess {...buttonProps} /> : <ExpandMore {...buttonProps} />;

    return (
        <Grid container spacing={0} justifyContent='space-between' alignItems='center'>
            <Grid item xs={12}>
                <Grid container alignItems='center' wrap='nowrap'>
                    <Grid item xs={12}>
                        <BaseCmp />
                    </Grid>
                    <Grid item style={{ alignSelf: 'baseline' }}>
                        {expandButton}
                    </Grid>
                </Grid>
            </Grid>
            <Collapse in={open} timeout="auto" unmountOnExit style={{ width: '100%' }}>
                <Cmp {...rest} />
            </Collapse>
        </Grid>
    );
};