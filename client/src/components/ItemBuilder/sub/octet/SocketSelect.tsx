import React from "react";

import { RenderComponentProps } from "../../../../interfaces/builder";
import { RootStoreContext } from "../../../../contexts/RootStoreContext";
import { CollapseWrapper } from "../CollapseWrapper";
import { Grid, NativeSelect, Typography } from "@mui/material";

export const SocketSelect = (props: RenderComponentProps<number[]>) => {
    const { value, onChange } = props;
    const { pwServerStore } = React.useContext(RootStoreContext);
    const stones = Object.values(pwServerStore.data.item_extra.soulStones).flat();
    const itemDbMap = pwServerStore.data.item_db.valueMap;

    const onChangeSocketItem = React.useCallback((inputValue: string, idx: number) => {
        value[idx] = parseInt(inputValue, 10);
        onChange([...value]);
    }, [value, onChange]);

    return (
        <Grid 
            container 
            direction='column' 
            style={{ padding: 16 }}
        >
            {value.map((socket, idx) => (
                <Grid item xs={12} key={idx}>
                    <Grid container wrap='nowrap' alignItems='center' spacing={1}>
                        <Grid item>
                            <Typography 
                                children={`Slot ${idx}: `}
                                variant='body2'
                                noWrap
                            />
                        </Grid>
                        <Grid item>
                            <NativeSelect
                                size='small'
                                value={socket || 0}
                                onChange={ev => onChangeSocketItem(ev.currentTarget.value, idx)}
                                style={{ fontSize: 12 }}
                                data-idx={idx}
                            >
                                <option value={0}>{'Empty'}</option>
                                {stones.map(stone => (
                                    <option 
                                        value={stone} 
                                        key={stone}
                                    >
                                        {itemDbMap[stone].name}
                                    </option>
                                ))}
                            </NativeSelect>                        
                        </Grid>
                    </Grid>
                </Grid>
            ))}
        </Grid>
    );
};

export const SocketSelectBase = (props: RenderComponentProps<number[]>) => {

    const { value, onChange } = props;

    const onChangeSocketAmount = React.useCallback((ev: React.ChangeEvent<HTMLSelectElement>) => {
        value.length = parseInt(ev.currentTarget.value, 10)
        onChange([...value]);
    }, [value, onChange]);

    let title: string;
    if (value.length > 0) {
        title = `Socket (${value.filter(Boolean).length}/${value.length}): `;
    } else {
        title = `Socket (0): `
    }

    return (
        <Grid container wrap='nowrap' alignItems='center' justifyContent='space-between' spacing={1}>
            <Grid item>
                <Typography 
                    variant='body2'
                    children={title} 
                />
            </Grid>
            <Grid item>
                <NativeSelect
                    size='small'
                    value={value.length}
                    onChange={onChangeSocketAmount}
                    style={{ fontSize: 12 }}
                >
                    <option value={0}>{'No socket'}</option>
                    <option value={1}>{'1 socket'}</option>
                    <option value={2}>{'2 socket'}</option>
                    <option value={3}>{'3 socket'}</option>
                    <option value={4}>{'4 socket'}</option>
                </NativeSelect>
            </Grid>
        </Grid>
    );
}

export const SocketSelectCollapse = (props: RenderComponentProps<number[]>) => {
    return (
        <CollapseWrapper 
            disabled={props.value.length === 0}
            BaseCmp={() => <SocketSelectBase {...props} />}
            Cmp={() => <SocketSelect {...props} />} 
            {...props}
        />
    );
};