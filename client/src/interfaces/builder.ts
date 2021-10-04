import { IComplexOctetCategories, IOctetBuilderFieldsData } from "./responses";

export type IOctetFields = 'lvReq16'|'lvReq32'|'grade16'|'grade32'|'classReq'|'pDmgRange'|'mDmgRange'|'pAttack'|'mAttack'|'strReq'|
    'agiReq'|'intReq'|'conReq'|'durability'|'itemType'|'itemFlag'|'ammo'|'aSpeed'|'range'|'minRange'|'socket'|'addon'|'crafter'|
    'hp'|'mp'|'hp'|'dodge'|'pDef'|'wStat'|'wType'|'metalDef'|'woodDef'|'waterDef'|'fireDef'|'earthDef'|'dodge' | 'emptyInt32';

export interface IWeaponOctet {
    lvReq: number;
    classReq: number;
    strReq: number;
    conReq: number;
    agiReq: number;
    intReq: number;
    durability: [number, number];
    itemType: number;
    itemFlag: number;
    crafter: string;
    wStat: number;
    wType: number;
    grade32: number;
    ammo: number;
    pDmg: [number, number];
    mDmg: [number, number];
    aSpeed: number;
    range: number;
    minRange: number;
    socket: number[];
    addon: number[];
    refine?: number;
}

export interface IArmorOctet {
    lvReq: number;
    classReq: number;
    strReq: number;
    agiReq: number;
    conReq: number;
    intReq: number;
    durability: [number, number];
    itemType: number;
    itemFlag: number;
    crafter: string;
    pDef: number;
    dodge: number;
    hp: number;
    mp: number;
    metalDef: number;
    woodDef: number;
    waterDef: number;
    fireDef: number;
    earthDef: number;
    socket: number[];
    addon: number[];
}

export interface IJewelOctet {
    lvReq: number;
    classReq: number;
    strReq: number;
    agiReq: number;
    conReq: number;
    intReq: number;
    durability: [number, number];
    itemType: number;
    itemFlag: number;
    crafter: string;
    pAttack: number;
    mAttack: number;
    pDef: number;
    dodge: number;
    metalDef: number;
    woodDef: number;
    waterDef: number;
    fireDef: number;
    earthDef: number;
    emptyInt32: number;
    addon: string[];
}

export interface IBlessBoxOctet extends IArmorOctet {}

export interface IFlyerOctet {
    flyerFuel: [number, number];
    lvReq16: number;
    grade16: number;
    flyerRace: number;
    flyerUnknown1: number;
    flyerSpeed: [number, number];
    flyerUnknown2: number;
    flyerUnknown3: number;
    flyerUnknown4: number;  
}

export type IOctetData = IWeaponOctet & IArmorOctet & IJewelOctet & IBlessBoxOctet;
export type IOctetKeys = keyof IOctetData;

export interface RenderComponentProps<T = any> {
    value: T;
    onChange: (value: T) => void;
    config: IOctetBuilderFieldsData;

    category: IComplexOctetCategories;
    getOctetData(field: IOctetKeys): IOctetData[IOctetKeys]
}