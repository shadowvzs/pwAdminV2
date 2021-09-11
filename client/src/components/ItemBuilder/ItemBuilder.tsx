import React from "react";
import { Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../contexts/RootStoreContext";
import { EntityId } from "../../models/BaseEntity";
import { ClassMaskBuilderPopover } from "./ClassMaskBuilder";
import { ProctypeBuilderPopover } from "./ProctypeBuilder";
import { ItemSelect } from "./ItemSelect";
import { Item } from "../../models/Item";
import { IItemData, IPwStoreData } from "../../interfaces/responses";
import { IItem } from "../../interfaces/common";

const useStyles = makeStyles({
    root: {
        minWidth: 200,
        padding: 16,
    },
    classMaskContainer: {
        maxWidth: 240,
        padding: '0 16px',
    },
    proctypeContainer: {
        maxWidth: 240,
        padding: '0 16px',
    }
});

interface ItemBuilderProps {
    selectedUserId?: EntityId;
    initItemData?: Partial<IItem>;
}

type ItemKey = keyof IItem;
class ItemBuilderStore {

    private _itemData?: IItemData;

    public item: Item;

    public set(field: ItemKey, value?: Item[ItemKey]) {
        this.item.set(field, value);
        if (field === 'id') { this.setItemData(); }
    }

    private setItemData(itemId?: number): void {
        if (!this._data.item_db) { return; }
        const itemDb = this._data.item_db;
        const itemExtra = this._data.item_extra;
        const id = itemId || this.item?.id;
        const _item = itemDb[id];
        this._itemData = _item;
        if (!_item) { return; }
        const { equipments, menu } = itemExtra;
        const mainMenuId = _item.category[0];
        const subMenuId = parseInt(_item.category.substr(1), 10);
        const eqId = menu.valueMap[mainMenuId]?.subCategory.valueMap[subMenuId]?.equipmentId;
        const eq = equipments.find(x => x.id === eqId);
        if (eq) {
            this.item.set('mask', eq.mask);
            this.item.set('pos', eq.pos);
        }
        this.item.set('guid1', 0);
        this.item.set('guid2', 0);
        this.item.set('proctype', 0);
        this.item.set('data', '');
        this.item.set('expire_date', 0);
        this.item.set('count', 1);
        this.item.set('max_count', 1);
        // set max stack here
    }

    // public mask: number = 0;
    // public setMask(mask: number) { this.mask = mask; }
    // public proctype: number = 0;
    // public setProctype(proctype: number) { this.proctype = proctype; }

    constructor(
        private _data: IPwStoreData,
        initItemData?: Partial<IItem>
    ) {
        this.item = new Item(initItemData);
    }
}

export const ItemBuilder = observer((props: ItemBuilderProps) => {
    const rootStore = React.useContext(RootStoreContext);
    const store = React.useState(() => new ItemBuilderStore(rootStore.pwServerStore.data, props.initItemData))[0];
    const classes = useStyles();

    if (!rootStore.authStore.currentUser) { return null; }
    const item = store.item;

    return (
        <Grid className={classes.root}>
            <Grid item style={{ width: 240 }}>
                <ItemSelect value={item.id} onChange={(id: number) => store.set('id', id)} />
            </Grid>
            <Grid item style={{ width: 240 }} className={classes.classMaskContainer}>
                <ClassMaskBuilderPopover 
                    value={item.mask} 
                    onChange={(v: number) => store.set('mask', v)} 
                />
            </Grid>
            <Grid item style={{ width: 240 }} className={classes.proctypeContainer}>
                <ProctypeBuilderPopover 
                    value={item.proctype} 
                    onChange={(v: number) => store.set('proctype', v)} 
                />
            </Grid>
        </Grid>
    );
});
