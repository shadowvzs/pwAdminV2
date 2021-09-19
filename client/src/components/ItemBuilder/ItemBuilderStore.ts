import { action, makeObservable, observable } from "mobx";
import { IArrayValueMap } from "../../helpers/arrayValueMap";
import { Converter } from "../../helpers/converter";
import { IOctetData, IOctetKeys } from "../../interfaces/builder";
import { IItem, ItemKey } from "../../interfaces/common";
import { 
    AddonType,
    IItemData, 
    IMenuCategoryData, 
    IMenuCategoryValueMapData, 
    IMenuSubCategoryData, 
    IOctetBuilderFieldsData, 
    IPwStoreData 
} from "../../interfaces/responses";
import { Addon } from "../../models/Addon";
import { Item } from "../../models/Item";

export class ItemBuilderStore {
    // menu in array value map form for easy access any menu directly with id and valueMap
    public menuCategories: IArrayValueMap<IMenuCategoryValueMapData>;
    // items categorized with subCategory id (ex. 'W1': Item[] or 'O12': Item[])
    public menuSubCategoryItems: Record<string, IItemData[]> = {};
    // contain data about octet ui fields
    public octetUIData: IOctetBuilderFieldsData[];
    // contain data about octet string building
    public octetBuildData: IOctetBuilderFieldsData[];
    // contain octet data understandable form
    public itemOctetData: IOctetData & { refine: number } = {} as IOctetData & { refine: number };
    // final octet string what we use in future
    public finalOctetData: { label: string, value: string }[] = [];
    // show specific fields like item flag, item type, min range which we useally not change etc
    public showAdvancedUI: boolean = false;
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

    public toggleAdvancedUI() {
        this.showAdvancedUI = !this.showAdvancedUI;
    }

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
        (window as any)['aaaa'] = this;
        if (category && subCategory && subCategory.octetBuilderId) {
            const octetBuilder = this._data.item_extra.octetBuilder;
            const fieldMap = this._data.item_extra.octetBuilder.fields.valueMap;
            const octetProfile = octetBuilder.profiles.valueMap[subCategory.octetBuilderId];
            this.octetUIData = octetProfile.uiOrder.map(id => fieldMap[id]);
            this.octetBuildData = octetProfile.octetOrder.map(id => fieldMap[id]);
            this.octetUIData.forEach(v => {
                const cv = v.conditionalValue;
                if (typeof v.defaultValue !== 'undefined') { 
                    this.setOctet(v.id, v.defaultValue);
                } 
                if (cv) {
                    const cvValue = cv[this.categoryId] || cv[subCategory.shortId || (this.categoryId + this.subCategoryId)];
                    if (typeof cvValue !== 'undefined') {
                        this.setOctet(v.id, cvValue);
                    }
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
        (this.itemOctetData as Record<IOctetKeys, any>)[field as IOctetKeys] = value;
        this.calculateOctetString();
    }

    private calculateOctetString() {
        const fieldsForBuild = this.octetBuildData;
        const octets: { label: string, value: string }[] = [];
        const values = this.itemOctetData;
        const converter = this.converter;
        // hard coded part - complex calculation and variable settings
        const sockets = (values['socket'] as number[] || []).filter(Boolean);
        const refineLv = values['refine'] as number || 0;
        const addonDataList = values['addon'] as string[] || [] as string[];
        const addonCounter = sockets.length + addonDataList.length + (refineLv > 0 ? 1 : 0);
        const { octetBuilder: { addonIdModifier }, refine } = this._data.item_extra;
        const dbMap = this._data.item_db.valueMap;
        const socketDataKey = this.categoryId === 'W' ? 'weaponData' : 'armorData';
        const [, subCategory] = this.getCategories();
    
        // till here, here we go over on all octet field which required for octet calculation
        for (const field of fieldsForBuild) {
            const methodName = `to${field.type[0].toUpperCase()}${field.type.substr(1)}` as 'toInt8' | 'toInt16LE' | 'toInt32LE' | 'toFloatLE';
            const converterMethod = converter[methodName];
            switch (field.flag) {
                case 'virtual':
                    // do nothing
                    break;
                case 'special':
                    // non generic logic
                    if (field.id === 'addon') {
                        // addon calculation is special
                        octets.push({ 
                            label: `${field.id} length = socket(${sockets.length}) + refine(${refineLv > 0 ? 1 : 0}) + addon(${addonDataList.length})`, 
                            value: converterMethod(addonCounter) 
                        });
                        addonDataList.forEach((addonData, idx) => {
                            const [id, value1, value2] = addonData.split('#');
                            const addon = new Addon(parseInt(id, 10));
                            addon.setValue1(parseInt(value1, 10));
                            addon.setValue2(parseInt(value2, 10));

                            if (addon.type === AddonType.Rune) {
                                // calculate duration with timestamp
                            } else {
                                const modifier = addon.isNormal ? addonIdModifier['normal'] : addonIdModifier['skill'];
                                octets.push({ 
                                    label: `addon ${idx} - id: ${id}`, 
                                    value: this.converter.toAddon(addon.id, modifier)
                                });
                                octets.push({ 
                                    label: `addon ${idx} - value1: ${value1}`, 
                                    value: converterMethod(addon.value1) 
                                });
                                if (addon.value2) {
                                    octets.push({ 
                                        label: `addon value ${idx} - value2: ${field.id}`, 
                                        value: converterMethod(addon.value2) 
                                    });
                                }
                            }
                        });
                        //     "id":577,
                        //     "attributeId":4,
                        //     "value":5
  
                        if (refineLv > 0) {
                            const refineInfo = refine
                                .base.valueMap[subCategory.refineBaseId!]
                                .grade[this.item.grade];
                            const refineValue = Math.floor(refine.levelMultiplier[refineLv] * refineInfo.value);

                            octets.push({ 
                                label: `refine addon id: +${refineInfo.addonId}`, 
                                value: this.converter.toAddon(refineInfo.addonId, addonIdModifier['refine'])
                            });
                            octets.push({ 
                                label: `refine value: +${refineValue}`, 
                                value: converterMethod(refineValue) 
                            });
                            octets.push({ 
                                label: `refine lv: +${refineLv}`, 
                                value: converterMethod(refineLv) 
                            });
                        }

                        sockets.forEach((socket, idx) => {
                            const statData = dbMap[socket][socketDataKey];
                            if (!statData) { return; }
                            octets.push({ 
                                label: `socket #1${idx} - id: ${statData.id}`, 
                                value: this.converter.toAddon(statData.id, addonIdModifier['socket']) 
                            });
                            octets.push({ 
                                label: `socket #1${idx} - value: ${statData.value}`, 
                                value: converterMethod(statData.value) 
                            });
                        });
                    }
                    //  else if (field.id === 'wType') {
                    //     const [, sub] = this.getCategories();
                    //     octets.push({ label: `${field.id}`, value: converterMethod(sub.weaponType || 0) });
                    // }
                    break;
                case 'pair':
                    const [value1, value2] = values[field.id] as [number, number] || [0,0];
                    octets.push({ 
                        label: `${field.id}1: ${value1}`, 
                        value: converterMethod(value1 || 0) 
                    });
                    octets.push({ 
                        label: `${field.id}2: ${value2}`, 
                        value: converterMethod(value2 || 0) 
                    });
                    break;
                case 'array':
                    const valArr = values[field.id] as number[] || [];
                    octets.push({ 
                        label: `${field.id} length: : ${valArr.length}`, 
                        value: converterMethod(valArr.length) 
                    });
                    valArr.forEach((v, idx) => {
                        octets.push({ 
                            label: `${field.id}${idx+1}: ${v}`, 
                            value: converterMethod(v || 0) 
                        });
                    })
                    break;
                case 'advanced':
                case 'constant':
                case 'normal':
                    const value = values[field.id] as number | string || (field.type === 'text' ? '' : 0);
                    octets.push({ 
                        label: `${field.id}: ${value}`, 
                        value: (converterMethod as any)(value) 
                    });
                    break;
                default:
                    console.error('not handled', field);
                    break;
            }
        }
        this.finalOctetData = octets;
        this.set('data', octets.map(x => x.value).join(''));
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
        this.calculateOctetString();
    }

    constructor(
        private _data: IPwStoreData,
        initItemData?: Partial<IItem>
    ) {
        makeObservable(this, {
            itemOctetData: observable,
            showAdvancedUI: observable,
            setOctet: action.bound,
            toggleAdvancedUI: action.bound
        });
        this.item = new Item(initItemData);
        this.init();
    }
}