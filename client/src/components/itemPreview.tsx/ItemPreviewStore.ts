import { action, IReactionDisposer, makeObservable, observable, reaction } from "mobx";
import { Converter } from "../../helpers/converter";
import { IOctetData, IOctetKeys } from "../../interfaces/builder";
import { IMenuCategoryValueMapData, IMenuSubCategoryData, IPwStoreData, IRefineBaseData } from "../../interfaces/responses";
import { Item } from "../../models/Item";

interface IOctetDataUI extends IOctetData {
    refine: number; 
    refineValue: number;
}

interface IOctetDataUIV2 extends IOctetDataUI {
    helper: Record<string, any>
}

export class ItemPreviewStore {
    private categoryIds: string | undefined;
    private converter: Converter;
    public item: Item;
    public itemOctetData: IOctetDataUI = {} as IOctetDataUI;
    public itemOctetDataWithAddons: IOctetDataUIV2 = {} as IOctetDataUIV2;

    public setItem(item: Item) { 
        this.item = item; 
        this.categoryIds = '';
        this.getItemProperties(item);
        this.calculateOctetString();
    }

    private getItemProperties(item: Item) {
        this.categoryIds = this.idToCategory(item) || this.posToCategory(item) || this.maskToCategory(item);
    }

    private idToCategory(item: Item): string | undefined {
        const itemData = this._data.item_db.valueMap[item.id];
        if (!itemData) { return; }
        return itemData.category;
    }

    private posToCategory(item: Item): string | undefined {
        const pos = item.pos;
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

    private maskToCategory(item: Item): string | undefined {
        const mask = item.mask;
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

    public getCategories(): [IMenuCategoryValueMapData, IMenuSubCategoryData] | undefined {
        if (!this.categoryIds) { return; }
        const menu = this._data.item_extra.menu.valueMap[this.categoryIds[0]];
        if (!menu) { return; }
        return [menu, menu.subCategory.find(x => x.id === parseInt(this.categoryIds!.substr(1),10))!];
    }

    public getText = (fieldId: IOctetKeys): [string, string | number] => {
        const octetFieldMap = this._data.item_extra.octetBuilder.fields.valueMap;
        const value = this.itemOctetData[fieldId];
        return [octetFieldMap[fieldId]?.label || fieldId, Array.isArray(value) ? value.join('-') : value];
    }

    public calculateOctetString(): void {
        const octetBuilder = this._data.item_extra.octetBuilder;
        const fieldMap = octetBuilder.fields.valueMap;
        const [mainCategory, subCategory] = (this.getCategories() || []);
        if (!subCategory || !subCategory.octetBuilderId) { 
            this.itemOctetData = {} as IOctetDataUI;
            return console.info(this.item.id, ' has no data for decompose into data'); 
        }
        let refineOctetName: IRefineBaseData['octetName'] | '' = '';
        const octetBuildProfile = octetBuilder.profiles.valueMap[subCategory.octetBuilderId];
        const fieldsForBuild = octetBuildProfile.octetOrder.map(id => fieldMap[id]);
        const { octetBuilder: { addonIdModifier }, refine } = this._data.item_extra;
        const finalData: Record<keyof IOctetDataUI, any> = {} as Record<keyof IOctetDataUI, any>;
        const data = this.item.data;
        if (!data) { 
            this.itemOctetData = finalData;
            return; 
        }

        // position where we work with octet string
        let pos = 0;
        // till here, here we go over on all octet field which required for octet calculation
        for (const field of fieldsForBuild) {
            const methodName = `from${field.type[0].toUpperCase()}${field.type.substr(1)}` as 'fromInt8' | 'fromInt16' | 'fromInt32' | 'fromFloat';
            const converterMethod = this.converter[methodName];
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
                        const str = data.substr(pos, 8);
                        pos += 8;
                        const addonLen = this.converter.fromInt32LE(str);
                        const addons = new Array(addonLen);
                        const socketCount = (finalData['socket'] || []).filter(Boolean).length;

                        for (let i = 0; i < addons.length; i++) {
                            const str = data.substr(pos);
                            const addonType = this.converter.getAddonType(str);
                            const addonLen = [addonIdModifier['normal'], addonIdModifier['socket']].includes(addonType) ? 16 : 24;
                            const addon = this.converter.fromAddon(data.substr(pos, addonLen));
                            addons[i] = addon;
                            pos += addonLen;
                        }

                        // remove sockets
                        if (socketCount) { addons.splice(-socketCount); }

                        if (addons.length) {
                            const idx = addons.length - 1;
                            const [ addonId ] = addons[idx];
                            for (const { grade, octetName } of refine.base) {
                                const grIdx = grade.findIndex(x => x.addonId === addonId);
                                if (grIdx >= 0) {
                                    const [, refineValue, refineLv] = addons.pop();
                                    refineOctetName = octetName;
                                    finalData['grade32'] = grIdx;
                                    finalData['refineValue'] = refineValue;
                                    finalData['refine'] = refineLv;
                                    break;
                                }
                            }
                        }
                        finalData['addon'] = addons;
                    }
                    break;
                case 'pair':
                    const value1 = converterMethod(data.substr(pos, len));
                    pos += len;
                    const value2 = converterMethod(data.substr(pos, len));
                    pos += len;
                    finalData[field.id] = [value1, value2];
                    break;
                case 'array':
                    const arr = this.converter.fromArray(data.substr(pos), len);
                    finalData[field.id] = arr;
                    pos += (arr.length + 1) * len;
                    break;
                case 'advanced':
                case 'constant':
                case 'normal':
                    // if integer values
                    if (len) {
                        finalData[field.id] = converterMethod(data.substr(pos, len));
                        pos += len;
                    } else {
                        finalData[field.id] = this.converter.fromText(data.substr(pos));
                        pos += finalData[field.id].length * 4 + 2;
                    }
                    break;
                default:
                    console.error('not handled', field);
                    break;
            }
        }

        this.itemOctetData = finalData;

        const ammoName = finalData.ammo && octetBuilder.fields.valueMap['ammo']
            .options?.find(([, id]) => id === finalData.ammo)![1];

        this.itemOctetDataWithAddons = {...finalData, helper: {
            ammo: ammoName
        } };
        
        if (finalData['refine'] && refineOctetName !== '') {
            const refineValue = finalData['refineValue'];
            const iOD = this.itemOctetDataWithAddons;
            if (refineOctetName === 'mDef') {
                iOD['metalDef'] += refineValue;
                iOD['woodDef'] += refineValue;
                iOD['waterDef'] += refineValue;
                iOD['fireDef'] += refineValue;
                iOD['earthDef'] += refineValue;
            } else {
                if (Array.isArray(iOD[refineOctetName])) {
                    iOD[refineOctetName as 'pDmg'] = iOD[refineOctetName as 'pDmg']
                        .map(x => x + refineValue) as [number, number];
                } else {
                    iOD[refineOctetName] += refineValue;
                }
            }
        }
    }

    public getAddonText(id: number, value: number): string {
        const { addons, stats, statType } = this._data.item_extra;
        const addon = addons.valueMap[id];

        if (addon.isSkill) {
            return `${addon.description}`;
        }

        const stat = stats.valueMap[addon?.attributeId!];
        if (!addon || !stat) { return ''; }

        switch (statType[stat.type]) {
            case 'flat':
                return `${stat.name}: ${stat.isNegative ? '-' : '+'} ${value}`;
            case 'percentage':
                return `${stat.name}: ${stat.isNegative ? '-' : '+'} ${value}%`;
            case 'period':
                return `${stat.name}: ${stat.isNegative ? '-' : '+'} ${value}/sec`;
            case 'range':
                return `${stat.name}: ${stat.isNegative ? '-' : '+'} ${value}m`;
            case 'speed':
                return `${stat.name}: ${stat.isNegative ? '-' : '+'} ${value}m/sec`;
            case 'interval':
                return `${stat.name}: ${stat.isNegative ? '-' : '+'} ${value / 20}`;
            case 'no-value':
                return `${stat.name}`;
            default:
                console.warn('missing addon data', addon, stat);
                return `Addon [${addon.id}] - value ${value}`;
        }
    }

    public get isPhysicalWeapon(): boolean {
        const mDmg = this.itemOctetData['mDmg'] || [];
        return !mDmg[0];
    }

    public itemClassReq = (cMask: number) => {
        const { classes, maxMask } = this._data.classes;
        if (maxMask === this.item.mask){
            return "All Class";
        } else {
            const classNames: string[] = classes
                .filter(cls => Boolean(cls.mask & cMask))
                .map(cls => cls.name);
    
            return classNames.join(', ') || 'Not useable';
        }
    }

    private disposers: IReactionDisposer[] = [];

    public dispose = () => {
        this.disposers.forEach(x => x());
    }

    constructor(
        private _data: IPwStoreData,
        _item: Item
    ) {
        this.converter = new Converter();
        makeObservable(this, {
            itemOctetDataWithAddons: observable,
            calculateOctetString: action.bound
        });

        this.setItem(_item);

        this.disposers = [
            reaction(() => _item.id, (next: number, prev: number) => {
                if (next === prev) { return; }
                this.setItem(_item);
            }),
            reaction(() => _item.data, (next: string, prev: string) => {
                if (next === prev) { return; }
                try {
                    this.setItem(_item);
                } catch (err) {
                    console.warn('octet issue');
                }
            })
        ];
    }
}