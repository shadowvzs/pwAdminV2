import { action, makeObservable, observable } from "mobx";
import { IArrayValueMap } from "../../helpers/arrayValueMap";
import { Converter } from "../../helpers/converter";
import { IOctetData, IOctetKeys } from "../../interfaces/builder";
import { IItem, ItemKey } from "../../interfaces/common";
import { 
    IItemData, 
    IMenuCategoryData, 
    IMenuCategoryValueMapData, 
    IMenuSubCategoryData, 
    IOctetBuilderFieldsData, 
    IPwStoreData 
} from "../../interfaces/responses";
import { Item } from "../../models/Item";

export class ItemBuilderStore {
    // menu in array value map form for easy access any menu directly with id and valueMap
    public menuCategories: IArrayValueMap<IMenuCategoryValueMapData>;
    // items categorized with subCategory id (ex. 'W1': Item[] or 'O12': Item[])
    public menuSubCategoryItems: Record<string, IItemData[]> = {};
    // contain data about ui/octet fields
    public octetBuilderData: IOctetBuilderFieldsData[];
     // contain octet data understandable form
    public itemOctetData: IOctetData = {} as IOctetData;
    // item data from JSON db what we got after login
    public itemData?: IItemData;
    // the item itself what we edit currently
    public item: Item;
    // helper class which help convert the data
    public converter: Converter = new Converter();
    // menu category id, main category which active currently (ex. 'W' if weapon, 'A' is armor etc)
    public categoryId: string = '';
    // sub category id, each main category got several sub category (number form) 
    // like 4=dual axe, 10=sword if main category is 'W', 1=Heavy plate, 4=Heavy Legging if main cat is 'A'
    public subCategoryId: number = 0;

    // set main category
    public setCategoryId(id: string, subCategoryId?: number): void { 
        this.categoryId = id;
        this.setSubCategoryId(subCategoryId || this.category?.subCategory[0]?.id);
    }

    // set sub category id and set item id if exist any item in current subcategory, call side effects
    public setSubCategoryId(id: number): void { 
        this.subCategoryId = id;
        // call onMenuChange side effect
        this.onMenuChange();
        const item = this.menuSubCategoryItems[this.currentSubCatId][0];
        if (item) { this.set('id', item.id); }
    }

    // recreate the octet data because if menu was changed then octet data should be different too
    public onMenuChange() {
        const [category, subCategory] = this.getCategories(this.categoryId, this.subCategoryId);
        if (category && subCategory && subCategory.octetBuilderId) {
            const octetBuilder = this._data.item_extra.octetBuilder;
            const fieldMap = this._data.item_extra.octetBuilder.fields.valueMap;
            const octetProfile = octetBuilder.profiles.valueMap[subCategory.octetBuilderId];
            this.octetBuilderData = octetProfile.uiOrder.map(id => fieldMap[id]);
            this.octetBuilderData.forEach(v => {
                const cv = v.conditionalValue;
                if (typeof v.defaultValue !== 'undefined') { 
                    this.setOctet(v.id, v.defaultValue);
                } else if (cv) {
                    this.setOctet(v.id, cv[this.categoryId] || cv[subCategory.shortId || this.categoryId + this.subCategoryId]);
                }
            });
        }
    }

    // set field on current item
    public set(field: ItemKey, value?: Item[ItemKey]) {
        this.item.set(field, value);

        // in case the id was change we should
        if (field === 'id') { 
            this.setItemData();
            this.updateCategoriesAfterItemId(value as number);
        }
    }

    // set octet fields on current item, which will change the octet string data on final item
    public setOctet(field: string, value: any): void {
        // const { octetBuilder } = this._data.item_extra;
        (this.itemOctetData as Record<IOctetKeys, any>)[field as IOctetKeys] = value;
        console.log(this.octetBuilderData, this.itemOctetData)
    }

    public getOctet(field: IOctetKeys): IOctetData[IOctetKeys] {
        return this.itemOctetData[field];
    }

    // helper to get both current category and subCategory data
    public getCategories(categoryId?: string, subCategoryId?: number): [IMenuCategoryValueMapData, IMenuSubCategoryData] {
        const category = this._data.item_extra.menu.valueMap[categoryId || this.categoryId];
        const subCategory = category?.subCategory.valueMap[subCategoryId || this.subCategoryId];
        return [category, subCategory];
    }

    // helper to get the current main category
    public get category(): IMenuCategoryData {
        return this.menuCategories.valueMap[this.categoryId];
    }

    // helper to get categories if we know the item id and it is exist in our db
    private getCategoriesbyItemId(itemId: number): [string, number] {
        const item = this._data.item_db.valueMap[itemId];
        if (!item) { return ['', 0 ]; };
        return [item.category[0], parseInt(item.category.substr(1), 10)];
    }

    // get categoryId+subCategoryId (we saved in same form into items in item_db)
    public get currentSubCatId(): string {
        return this.categoryId + this.subCategoryId;
    }

    // set item informations
    private setItemData(itemId?: number): void {
        if (!this._data.item_db) { return; }
        const itemDb = this._data.item_db;
        const itemExtra = this._data.item_extra;
        const id = itemId || this.item?.id;
        const _item = itemDb.valueMap[id];
        this.itemData = _item;
        if (!_item) { return; }
        const { equipments, menu } = itemExtra;
        const mainMenuId = _item.category[0];
        const subMenuId = parseInt(_item.category.substr(1), 10);
        const eqId = menu.valueMap[mainMenuId]?.subCategory.valueMap[subMenuId]?.equipmentId;
        if (eqId) {
            const eq = equipments.valueMap[eqId];
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

    // if item id was changed and id was found in our db then we set the correct category for that item
    public updateCategoriesAfterItemId(id: number) {
        const item = this._data.item_db.valueMap[id];

        if (item && id) {
            const [shortId, subCategoryId] = this.getCategoriesbyItemId(id);
            if (shortId !== this.categoryId) {
                this.setCategoryId(shortId);
            }
            if (subCategoryId !== this.subCategoryId) {
                this.setSubCategoryId(subCategoryId);
            }
        }
    }

    public onSelectCategory = (ev: React.ChangeEvent<HTMLSelectElement>): void => {
        const id = ev.target.value;
        this.setCategoryId(id);
    }    
    
    public onSelectSubCategory = (ev: React.ChangeEvent<HTMLSelectElement>): void => {
        const id = parseInt(ev.target.value, 10);
        this.setSubCategoryId(id);
    }   

    // get item color for item select dropdown
    public getItemColor(item: IItemData): string {
        const { itemColor } = this._data.item_extra;
        return itemColor[item.color || 0].code;
    }

    private init(_initItemId?: number): void {
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
        
        const [shortId, subCategoryId] = this.getCategoriesbyItemId(_initItemId!);
        if (shortId) {
            this.setCategoryId(shortId, subCategoryId);
        } else {
            this.setCategoryId(this.menuCategories[0].shortId);
        }
    }

    constructor(
        private _data: IPwStoreData,
        initItemData?: Partial<IItem>
    ) {
        makeObservable(this, {
            itemOctetData: observable,
            setOctet: action.bound
        });
        this.item = new Item(initItemData);
        this.init();
    }
}