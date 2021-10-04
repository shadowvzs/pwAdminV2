import React from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../contexts/RootStoreContext";
import { EntityId } from "../../models/BaseEntity";
import { ProctypeBuilderPopover } from "./sub/ProctypeBuilder";
import { ItemSelect } from "./sub/ItemSelect";
import { IItem } from "../../interfaces/common";
import { GuidSelects } from "./sub/GuidSelects";
import { ExpireDateSelectPopover } from "./sub/ExpireDateSelect";
import { CountSelect } from "./sub/CountSelect";
import { MaskBuilderPopover } from "./sub/octet/MaskSelect";
import { ItemBuilderStore } from "./ItemBuilderStore";
import { OctetBuilder } from "./sub/OctetBuilder";
import { Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ItemPreview } from "../itemPreview.tsx/ItemPreview";
import { OctetPreview } from "./sub/octet/OctetPreview";

const useStyles = makeStyles({
    builder: {
        minWidth: 200,
        maxWidth: 320,
        padding: 16,
        '& > div': {
            maxWidth: 280,    
        }
    },
});

interface ItemBuilderProps {
    selectedUserId?: EntityId;
    initItemData?: Partial<IItem>;
}

export const ItemBuilder = observer((props: ItemBuilderProps) => {
    const rootStore = React.useContext(RootStoreContext);
    const store = React.useState(() => new ItemBuilderStore(rootStore.pwServerStore.data, props.initItemData))[0];
    const classes = useStyles();

    if (!rootStore.authStore.currentUser) { return null; }
    const item = store.item;
    
    return (
        <Grid container>
            <Grid item className={classes.builder}>
                <Grid item>
                    <Grid container alignItems='center' justifyContent='space-between'>
                        <Grid item>
                            <Typography 
                                variant='h6'
                                children='Item Builder'
                            />
                        </Grid>
                        <Grid item>
                        <FormControlLabel
                            control={(
                                <Checkbox 
                                    size='small'
                                    checked={store.showAdvancedUI} 
                                    onChange={store.toggleAdvancedUI} 
                                />
                            )}
                            label={(
                                <Typography 
                                    variant='body2'
                                    children='Advanced UI'
                                />
                            )}
                        />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <ItemSelect 
                        value={store.item.id}
                        store={store}
                    />
                </Grid>
                {!['W', 'A', 'J'].includes(store.categoryId) && (
                    <Grid item>
                        <CountSelect 
                            value1={item.count}
                            value2={item.max_count}
                            onChange={(count: number) => store.set('count', count)}
                        />
                    </Grid>
                )}
                {store.showAdvancedUI && (
                <Grid item>                
                    <GuidSelects 
                        value1={item.guid1}
                        value2={item.guid2}
                        onChange={store.set}
                    />
                </Grid>
                )}
                {store.showAdvancedUI && (
                    <Grid item style={{ padding: '0 16px' }}>
                        <MaskBuilderPopover 
                            value={item.mask}
                            onChange={(mask: number) => store.set('mask', mask)}
                        />
                    </Grid>
                )}
                {store.showAdvancedUI && (
                    <Grid item style={{ padding: '0 16px' }}>
                        <ExpireDateSelectPopover 
                            value={item.expire_date} 
                            onChange={(v: number) => store.set('expire_date', v)} 
                        />
                    </Grid>
                )}
                {store.showAdvancedUI && (
                    <Grid item style={{ padding: '0 16px' }}>
                        <ProctypeBuilderPopover 
                            value={item.proctype} 
                            onChange={(v: number) => store.set('proctype', v)} 
                        />
                    </Grid>
                )}
                {store.octetBuildData.length > 0 && (
                    <Grid item>
                        <OctetBuilder 
                            store={store}
                        />
                    </Grid>
                )}
            </Grid>
            <Grid item className={classes.builder}>
                <Grid container direction='column'>
                    <Grid item>
                        <OctetPreview store={store} />
                    </Grid>
                    <Grid item>
                        <ItemPreview item={store.item} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
});
