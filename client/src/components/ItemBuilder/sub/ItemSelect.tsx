import React from "react";
import { makeStyles } from "@mui/styles";
import { Grid, NativeSelect } from "@mui/material";

import { observer } from "mobx-react-lite";
import { ItemBuilderStore } from "../ItemBuilderStore";
import { RootStoreContext } from "../../../contexts/RootStoreContext";

const useStyles = makeStyles({
    root: {
        minWidth: 200,
        padding: 16,
        fontSize: 12,
        '& select': {
            fontSize: 12,
        }
    },
    input: {
        width: 50, 
        textAlign: 'right', 
        padding: '2px 4px', 
        marginTop: 2
    }
});

interface ItemSelectProps {
    hideTitle?: boolean
    value: number;
    store: ItemBuilderStore;
}

class ItemSelectStore {

    public onSelectItem = (ev: React.ChangeEvent<HTMLSelectElement>): void => {
        const id = parseInt(ev.target.value, 10);
        this.onChange(id);
    }

    public onChangeInput = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        const id = parseInt(ev.currentTarget.value.trim() || '0', 10);
        if (!isNaN(id)) {
            this.onChange(id);
        }
    }

    public onError = (err: React.SyntheticEvent<HTMLImageElement, Event>): void => {
        if (err.currentTarget.src !== this.getIconPath(0)) { 
            err.currentTarget.src = this.getIconPath(0); 
        }
    }

    public getIconPath(id: number): string {
        return `./images/icons/items/${id || '0'}.gif`;
    }

    constructor(
        public onChange: (id: number) => void,
    ) {
        // np
    }
}

export const ItemSelect = observer((props: ItemSelectProps) => {

    const iBStore = props.store;
    const { pwServerStore } = React.useContext(RootStoreContext);
    const version = pwServerStore.data.item_extra.version;
    const classes = useStyles();
    const store = React.useState(() => new ItemSelectStore(v => iBStore.set('id', v), ))[0];
    const menu = iBStore.category;
    const items = iBStore.menuSubCategoryItems[iBStore.currentSubCatId];

    return (
        <Grid className={classes.root}>
           <Grid container direction='column' spacing={1}>
                <Grid item xs={12}>
                    <Grid container spacing={2} wrap='nowrap' justifyContent='space-between'>
                        <Grid item>
                            <NativeSelect 
                                size='small'
                                variant='filled'
                                value={iBStore.categoryId} 
                                onChange={iBStore.onSelectCategory}
                            >
                                {iBStore.menuCategories.map(menu => (
                                    <option key={menu.id} value={menu.shortId}>{menu.label}</option>
                                ))}
                            </NativeSelect>
                        </Grid>
                        <Grid item>
                            <NativeSelect 
                                size='small'
                                variant='standard'
                                value={iBStore.subCategoryId} 
                                onChange={iBStore.onSelectSubCategory}
                            >
                                {menu.subCategory.filter(x => !x.version || x.version <= version).map(menu => (
                                    <option key={menu.id} value={menu.id}>{menu.label}</option>
                                ))}
                            </NativeSelect>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <NativeSelect 
                        size='small'
                        value={props.value} 
                        onChange={store.onSelectItem}
                        fullWidth
                    >
                         <option 
                            key={'none'} 
                            value={0}
                            children={'None'}
                        />
                        {items.map(item => (
                            <option 
                                key={item.id} 
                                value={item.id}
                                children={item.name}
                                style={{ backgroundColor: iBStore.getItemColor(item) }}
                            />
                        ))}
                    </NativeSelect>
                </Grid>
               <Grid item xs={12}>
                    <Grid container spacing={2} wrap='nowrap' alignItems='center' justifyContent='space-between'>
                        <Grid item>
                            <img 
                                src={store.getIconPath(props.value)} 
                                onError={store.onError}
                                alt={String(props.value || 'None')} 
                                width={32}
                            />
                        </Grid>
                        <Grid item>
                            <input 
                                type='number'
                                value={props.value}                                
                                style={{ fontSize: 12, textAlign:'right', padding: '2px 4px', width: '100%' }}
                                onChange={store.onChangeInput}
                            />
                        </Grid>
                    </Grid>
               </Grid>
            </Grid>
        </Grid>
    );
});