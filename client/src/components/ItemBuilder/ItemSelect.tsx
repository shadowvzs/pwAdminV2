import React from "react";
import { Grid, NativeSelect, TextField } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles";
import { PopoverWrapper } from "../PopoverWrapper";
import { RootStoreContext } from "../../contexts/RootStoreContext";
import { IItemData, IMenuCategoryData, IMenuCategoryValueMapData, IPwStoreData } from "../../interfaces/responses";
import { action, computed, makeObservable, observable } from "mobx";
import { observer } from "mobx-react-lite";
import { IArrayValueMap } from "../../helpers/arrayValueMap";

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
    value: number;
    onChange: (id: number) => void;

    hideTitle?: boolean
}

class ItemSelectStore {

    public menuCategories: IArrayValueMap<IMenuCategoryValueMapData>;
    public menuSubCategoryItems: Record<string, IItemData[]> = {};

    public categoryId: string = '';
    public setCategoryId(id: string, subCategoryId?: number): void { 
        this.categoryId = id;
        // console.log(subCategoryId, this.category)
        this.setSubCategoryId(subCategoryId || this.category?.subCategory[0]?.id);
    }
    public subCategoryId: number = 0;
    public setSubCategoryId(id: number): void { 
        this.subCategoryId = id;
        const item = this.menuSubCategoryItems[this.currentSubCatId][0];
        if (item) { this.onChange(item.id); }
    }

    public onSelectItem = (ev: React.ChangeEvent<HTMLSelectElement>): void => {
        const id = parseInt(ev.target.value, 10);
        this.onChange(id);
    }

    public onSelectCategory = (ev: React.ChangeEvent<HTMLSelectElement>): void => {
        const id = ev.target.value;
        this.setCategoryId(id);
    }    
    
    public onSelectSubCategory = (ev: React.ChangeEvent<HTMLSelectElement>): void => {
        const id = parseInt(ev.target.value, 10);
        this.setSubCategoryId(id);
    }   

    public get currentSubCatId(): string {
        return this.categoryId + this.subCategoryId;
    }

    public getItemColor(item: IItemData): string {
        const { itemColor } = this._data.item_extra;
        return itemColor[item.color || 0].code;
    }

    private init(): void {
        // filter out the items/menu which isn't in this version
        const items = this._data.item_db;
        const { menu, version } = this._data.item_extra;
        this.menuCategories = menu.filter(m => !m.version || m.version >= version);
        this.menuCategories.forEach(m => {
            m.subCategory = m.subCategory.filter(m => !m.version || m.version >= version);
        });

        items.filter(item => !item.version || item.version <= version)
            .forEach(item => {
                if (!this.menuSubCategoryItems[item.category]) {
                    this.menuSubCategoryItems[item.category] = [];
                }
                this.menuSubCategoryItems[item.category].push(item);
            });
        
        const [shortId, subCategoryId] = this.getCategoriesbyId(this._initItemId!);
        if (shortId) {
            this.setCategoryId(shortId, subCategoryId);
        } else {
            this.setCategoryId(this.menuCategories[0].shortId);
        }
    }

    private getCategoriesbyId(itemId: number): [string, number] {
        const item = this._data.item_db.valueMap[itemId];
        if (!item) { return ['', 0 ]; };
        return [item.category[0], parseInt(item.category.substr(1), 10)];
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

    public onIdChange = (newId: number) => {
        console.log(newId)
        const item = this._data.item_db.valueMap[newId];
        // console.log(newId, item)
        if (item) {
            const [shortId, subCategoryId] = this.getCategoriesbyId(newId);
            if (shortId !== this.categoryId) {
                this.setCategoryId(shortId);
            }
            if (subCategoryId !== this.subCategoryId) {
                this.setSubCategoryId(subCategoryId);
            }
        }
    }

    public get category(): IMenuCategoryData {
        return this.menuCategories.valueMap[this.categoryId];
    }

    constructor(
        public onChange: (id: number) => void,
        private _data: IPwStoreData, 
        private _initItemId?: number
    ) {
        makeObservable(this, {
            categoryId: observable,
            setCategoryId: action.bound,
            category: computed,
            currentSubCatId: computed,
            subCategoryId: observable,
            setSubCategoryId: action.bound,
        });
        this.init();
    }
}

export const ItemSelect = observer((props: ItemSelectProps) => {

    const { pwServerStore } = React.useContext(RootStoreContext);
    const classes = useStyles();
    const store = React.useState(() => new ItemSelectStore(props.onChange, pwServerStore.data, props.value))[0];
    const menu = store.category;
    const items = store.menuSubCategoryItems[store.currentSubCatId];
    console.log(props.value, store.categoryId, store.subCategoryId)
    React.useEffect(() => store.onIdChange(props.value), [props, store]);

    return (
        <Grid className={classes.root}>
           <Grid container direction='column' spacing={1}>
                <Grid item>
                    <Grid container spacing={2} wrap='nowrap'>
                        <Grid item>
                            <NativeSelect 
                                variant='filled'
                                value={store.categoryId} 
                                onChange={store.onSelectCategory}
                            >
                                <option key={'none'} value={''}>{'None'}</option>
                                {store.menuCategories.map(menu => (
                                    <option key={menu.id} value={menu.shortId}>{menu.label}</option>
                                ))}
                            </NativeSelect>
                        </Grid>
                        <Grid item>
                            <NativeSelect 
                                variant='standard'
                                value={store.subCategoryId} 
                                onChange={store.onSelectSubCategory}
                            >
                                <option key={'none'} value={0}>{'None'}</option>
                                {menu.subCategory.map(menu => (
                                    <option key={menu.id} value={menu.id}>{menu.label}</option>
                                ))}
                            </NativeSelect>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <NativeSelect 
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
                                style={{ backgroundColor: store.getItemColor(item) }}
                            />
                        ))}
                    </NativeSelect>
                </Grid>
               <Grid item>
                    <Grid container spacing={2} wrap='nowrap'>
                        <Grid item>
                            <img 
                                src={store.getIconPath(props.value)} 
                                onError={store.onError}
                                alt={String(props.value || 'None')} 
                                width={32}
                            />
                        </Grid>
                        <Grid item>
                            <TextField 
                                fullWidth
                                type='number'
                                value={props.value}
                                onChange={store.onChangeInput}
                            />
                        </Grid>
                    </Grid>
               </Grid>
            </Grid>
        </Grid>
    );
});

export const ItemSelectPopover = (props: ItemSelectProps) => {
    return (
        <PopoverWrapper 
            Cmp={ItemSelect} 
            {...props}
            tooltip='Edit class mask'
        />
    );
};