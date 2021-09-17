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
import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
    root: {
        minWidth: 200,
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
        <Grid className={classes.root}>
            <Grid item>
                <ItemSelect 
                    value={store.item.id}
                    store={store}
                />
            </Grid>
            <Grid item>
                <CountSelect 
                    value1={item.count}
                    value2={item.max_count}
                    onChange={(count: number) => store.set('count', count)}
                />
            </Grid>
            <Grid item>
                <GuidSelects 
                    value1={item.guid1}
                    value2={item.guid2}
                    onChange={store.set}
                />
            </Grid>
            <Grid item style={{ padding: '0 16px' }}>
                <MaskBuilderPopover 
                    value={item.mask}
                    onChange={(mask: number) => store.set('mask', mask)}
                />
            </Grid>
            <Grid item style={{ padding: '0 16px' }}>
                <ExpireDateSelectPopover 
                    value={item.expire_date} 
                    onChange={(v: number) => store.set('expire_date', v)} 
                />
            </Grid>
            <Grid item style={{ padding: '0 16px' }}>
                <ProctypeBuilderPopover 
                    value={item.proctype} 
                    onChange={(v: number) => store.set('proctype', v)} 
                />
            </Grid>
            <Grid item>
                {['W', 'A', 'J'].includes(store.categoryId) && (
                    <OctetBuilder 
                        store={store}
                    />
                )}
            </Grid>
        </Grid>
    );
});
