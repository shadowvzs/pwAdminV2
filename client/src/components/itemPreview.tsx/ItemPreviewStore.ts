import { Converter } from "../../helpers/converter";
import { IOctetData } from "../../interfaces/builder";
import { IMenuCategoryValueMapData, IMenuSubCategoryData, IPwStoreData } from "../../interfaces/responses";
import { Item } from "../../models/Item";

export class ItemPreviewStore {
    private categoryIds: string | undefined;
    private converter: Converter;
    public item: Item;
    public itemOctetData: IOctetData & { refine: number } = {} as IOctetData & { refine: number };

    public setItem(item: Item) { 
        this.item = item; 
        this.categoryIds = '';
        this.getItemProperties();
        this.calculateOctetString();
    }

    private getItemProperties() {
        this.categoryIds = this.idToCategory() || this.posToCategory() || this.maskToCategory();
    }

    private idToCategory(): string | undefined {
        const item = this._data.item_db.valueMap[this.item.id];
        if (!item) { return; }
        return item.category;
    }

    private posToCategory(): string | undefined {
        const pos = this.item.pos;
        if (!pos) { return; }
        const { menu, equipments } = this._data.item_extra;
        const equipment = equipments.find(x => x.pos === pos);
        if (!equipment) { return; }
        for (const m of menu) {
            const subCat = m.subCategory.find(x => x.equipmentId === equipment.id);
            if (subCat) {
                return m.shortId + subCat.id;
            }
        }
    }

    private maskToCategory(): string | undefined {
        const mask = this.item.mask;
        if (!mask) { return; }
        const { menu, equipments } = this._data.item_extra;
        const equipment = equipments.find(x => x.mask === mask);
        if (!equipment) { return; }
        for (const m of menu) {
            const subCat = m.subCategory.find(x => x.equipmentId === equipment.id);
            if (subCat) {
                return m.shortId + subCat.id;
            }
        }
    }

    private getCategories() {
        if (!this.categoryIds) { return; }
        const menu = this._data.item_extra.menu.valueMap[this.categoryIds[0]];
        if (!menu) { return; }
        return [menu, menu.subCategory.find(x => x.id === parseInt(this.categoryIds!.substr(1),10))];
    }

    private calculateOctetString() {
        const octetBuilder = this._data.item_extra.octetBuilder;
        const fieldMap = this._data.item_extra.octetBuilder.fields.valueMap;
        const [, subCategory] = (this.getCategories() || []) as [IMenuCategoryValueMapData, IMenuSubCategoryData];
        if (!subCategory || !subCategory.octetBuilderId) { return console.info(this.item.id, ' has no data for decompose into data'); }
        const fieldsForBuild = octetBuilder.profiles
            .valueMap[subCategory.octetBuilderId]
            .octetOrder.map(id => fieldMap[id]);

        // const octets: { label: string, value: string }[] = [];
        // const values = this.itemOctetData;
        const converter = this.converter;

        // hard coded part - complex calculation and variable settings
        // const sockets = (values['socket'] as number[] || []).filter(Boolean);
        // const refineLv = values['refine'] as number || 0;
        // const addonDataList = values['addon'] as string[] || [] as string[];
        // const addonCounter = sockets.length + addonDataList.length + (refineLv > 0 ? 1 : 0);
        const { octetBuilder: { addonIdModifier }, refine } = this._data.item_extra;
        const dbMap = this._data.item_db.valueMap;
        const socketDataKey = this.categoryIds![0] === 'W' ? 'weaponData' : 'armorData';

        const finalData: any = {};
    
        // position where we work with octet string
        let pos = 0;
        // till here, here we go over on all octet field which required for octet calculation
        for (const field of fieldsForBuild) {
            const methodName = `from${field.type[0].toUpperCase()}${field.type.substr(1)}` as 'fromInt8' | 'fromInt16' | 'fromInt32' | 'fromFloat';
            const converterMethod = converter[methodName];
            const getNumberFromType = field.type.match(/\d+/);
            let len = 0;
            if (getNumberFromType) {
                len = parseInt(getNumberFromType[0], 10) / 4;
            } else if (field.type.replace('LE', '') === 'float') {
                len = 8;
            }
            switch (field.flag) {
                case 'virtual':
                    // do nothing
                    break;
                case 'special':
                    // non generic logic
                    if (field.id === 'addon') {
                        const str = this.item.data.substr(pos, 8);
                        pos += 8;
                        const addonLen = this.converter.fromInt32LE(str);
                        const addons = new Array(addonLen);
                        const socketCount = finalData['socket'].length;
                        finalData['addon'] = addons;
                        for (let i = 0; i < addons.length; i++) {
                            const str = this.item.data.substr(pos);
                            const addonType = converter.getAddonType(str);
                            const isSimpleAddon = [addonIdModifier['normal'], addonIdModifier['socket']].includes(addonType);
                            const addon = this.converter.fromAddon(this.item.data.substr(pos), isSimpleAddon ? 1 : 2);
                            const isRefine = refine.base.some(x => x.grade[finalData['grade']].addonId === addon[0]);
                            console.log(i, addonLen - socketCount)
                            if (isRefine) {
                                finalData['refine'] = addon.pop();
                            } else if (i > addonLen - socketCount) {
                                // this is socket data
                            } else {
                                addons[i] = addon;
                            }
                            console.log(addon.length)
                            pos += addon.length * 8;
                        }
                        // addon calculation is special
                        // octets.push({ 
                        //     label: `${field.id} length = socket(${sockets.length}) + refine(${refineLv > 0 ? 1 : 0}) + addon(${addonDataList.length})`, 
                        //     value: converterMethod(addonCounter) 
                        // });
                        // addonDataList.forEach((addonData, idx) => {
                        //     const [id, value1, value2] = addonData.split('#');
                        //     const addon = new Addon(parseInt(id, 10));
                        //     addon.setValue1(parseInt(value1, 10));
                        //     addon.setValue2(parseInt(value2, 10));

                        //     if (addon.type === AddonType.Rune) {
                        //         // calculate duration with timestamp
                        //     } else {
                        //         const modifier = addon.isSkill ? addonIdModifier['skill'] : addonIdModifier['normal'];
                        //         octets.push({ 
                        //             label: `addon ${idx} - id: ${id}`, 
                        //             value: this.converter.toAddon(addon.id, modifier)
                        //         });
                        //         octets.push({ 
                        //             label: `addon ${idx} - value1: ${value1}`, 
                        //             value: converterMethod(addon.value1) 
                        //         });
                        //         if (addon.value2) {
                        //             octets.push({ 
                        //                 label: `addon value ${idx} - value2: ${field.id}`, 
                        //                 value: converterMethod(addon.value2) 
                        //             });
                        //         }
                        //     }
                        // });
                        //     "id":577,
                        //     "attributeId":4,
                        //     "value":5
  
                        // if (refineLv > 0) {
                        //     const refineInfo = refine
                        //         .base.valueMap[subCategory.refineBaseId!]
                        //         .grade[this.item.grade];
                        //     const refineValue = Math.floor(refine.levelMultiplier[refineLv] * refineInfo.value);

                        //     octets.push({ 
                        //         label: `refine addon id: +${refineInfo.addonId}`, 
                        //         value: converterMethod(refineInfo.addonId) 
                        //     });
                        //     octets.push({ 
                        //         label: `refine value: +${refineValue}`, 
                        //         value: converterMethod(refineValue) 
                        //     });
                        //     octets.push({ 
                        //         label: `refine lv: +${refineLv}`, 
                        //         value: converterMethod(refineLv) 
                        //     });
                        // }

                        // sockets.forEach((socket, idx) => {
                        //     const statData = dbMap[socket][socketDataKey];
                        //     if (!statData) { return; }
                        //     octets.push({ 
                        //         label: `socket #1${idx} - id: ${statData.id}`, 
                        //         value: this.converter.toAddon(statData.id, addonIdModifier['socket']) 
                        //     });
                        //     octets.push({ 
                        //         label: `socket #1${idx} - value: ${statData.value}`, 
                        //         value: converterMethod(statData.value) 
                        //     });
                        // });
                    }
                    //  else if (field.id === 'wType') {
                    //     const [, sub] = this.getCategories();
                    //     octets.push({ label: `${field.id}`, value: converterMethod(sub.weaponType || 0) });
                    // }
                    break;
                case 'pair':
                    const value1 = converterMethod(this.item.data.substr(pos, len));
                    pos += len;
                    const value2 = converterMethod(this.item.data.substr(pos, len));
                    pos += len;
                    finalData[field.id] = [value1, value2];
                    break;
                case 'array':
                    const arr = this.converter.fromArray(this.item.data.substr(pos), len);
                    finalData[field.id] = arr;
                    pos += (arr.length + 1) * len;
                    break;
                case 'advanced':
                case 'constant':
                case 'normal':
                    // if integer values
                    if (len) {
                        finalData[field.id] = converterMethod(this.item.data.substr(pos, len));
                        pos += len;
                    } else {
                        finalData[field.id] = this.converter.fromText(this.item.data.substr(pos));
                        pos += finalData[field.id] * 4 + 2;
                    }
                    break;
                default:
                    console.error('not handled', field);
                    break;
            }
        }
        // this.finalData = octets;
        // this.set('data', octets.map(x => x.value).join(''));
        console.log(finalData)
    }

    constructor(
        private _data: IPwStoreData
    ) {
        this.converter = new Converter();
    }
}