import { action, makeObservable, observable } from "mobx";
import { PW_STORE_DATA } from "../constants/core";
import { IArrayValueMap } from "../helpers/arrayValueMap";
import { IAddonData, IComplexOctetCategories, IStatData } from "../interfaces/responses";

export class Addon implements IAddonData {

    public static create(data: IAddonData) {
        const addon = Object.assign(new Addon(), {...data});
        if (data.id && PW_STORE_DATA.item_extra) {
            addon.setId(data.id);
        }
        return addon;
    }

    public get addons(): IArrayValueMap<Addon> {
        return PW_STORE_DATA.item_extra.addons;
    }

    public get stats(): IArrayValueMap<IStatData> {
        return PW_STORE_DATA.item_extra.stats;
    }

    // public static create(addons: IArrayValueMap<IAddonData>, stats: IArrayValueMap<IStatData[]>, value: string) {
    //     const [addonId, value1, value2] = value.split('#');
    //     const addonData = addons.valueMap[addonId];
    //     const stat = stats.valueMap[addonData.attributeId!];
    //     const addon = Object.assign(new Addon(), { ...addonData, stat });
    //     addon.setValue1(parseInt(value1, 10));
    //     addon.setValue2(parseInt(value2, 10));
    // }

    public id: number;
    public name?: string;
    public version: number;
    public type: number;
    public isHidden?: boolean;

    // for skills
    public data?: string;
    public description?: string;
    public get stat(): IStatData {
        if (typeof this.attributeId !== 'number') { return {} as IStatData; }
        return this.stats.valueMap[this.attributeId];
    }

    // for others: normal addon, runes
    public attributeId?: number;
    public supportedEquipment: IComplexOctetCategories[];

    public value1: number;
    public value2: number;
    public setValue1(value1: number): void { this.value1 = value1; }
    public setValue2(value2: number): void { this.value2 = value2; }

    public setId(id: number, setValueToo?: boolean): void { 
        this.id = id; 
        // const currentStatType = this.stat?.type;
        Object.assign(this, {...this.addons.valueMap[id]});
        if (!setValueToo) { return; }
        if (this.isSkill) {
            const [v1, v2] = this.data?.split(' ')!;
            this.setValue1(parseInt(v1, 10));
            this.setValue2(parseInt(v2, 10));
        } else {
            this.setValue1(1);
            this.setValue2(0);
        }        
    }

    public get $name(): string {
        const { statType } = PW_STORE_DATA.item_extra;

        if (this.isSkill) { 
            return this.name || ''; 
        } else if (!this.value1) {
            return this.stat?.name || '';
        }

        let name: string = '';
        const stat = this.stat;
        const sign = this.stat.isNegative ? '-' : '+';

        if (statType[stat.type] === 'flat') {
            name = `${stat.name} ${sign}${this.value1}`;
        } else if (statType[stat.type] === 'percentage') {
            name = `${stat.name} ${sign}${this.value1}%`;
        } else if (statType[stat.type] === 'period') {
            name = `${stat.name} ${sign}${this.value1}/sec`;
        } else if (statType[stat.type] === 'range') {
            name = `${stat.name} ${sign}${this.value1}m`;
        } else if (statType[stat.type] === 'speed') {
            name = `${stat.name} ${sign}${this.value1} m/sec`;
        } else if (statType[stat.type] === 'interval') {
            name = `${stat.name} ${sign}${(this.value1*0.05).toFixed(2)}`;
        } else if (statType[stat.type] === 'no-value') {
            name = `${stat.name}`;
        }

        if (this.isRune) {
            name += ` (${this.value2}min)`;
        }

        return name;
    }

    public get serialize(): string {
        return `${this.id}#${this.value1}#${this.value2}`;
    }

    public deserialize(data: string): void {
        const [addonId, value1, value2] = data.split('#');
        this.setId(parseInt(addonId, 10));
        this.setValue1(value1 ? parseInt(value1, 10) : 0);
        this.setValue2(value2 ? parseInt(value2, 10) : 0);
    }

    public get isNormal(): boolean { return this.type === 1; }
    public get isSkill(): boolean { return this.type === 2; }
    public get isRune(): boolean { return this.type === 3; }

    constructor(id?: number) {
        if (id) { this.setId(id); };
        makeObservable(this, {
            id: observable,
            value1: observable,
            value2: observable,
            setId: action.bound,
            setValue1: action.bound,
            setValue2: action.bound
        })
    }
}