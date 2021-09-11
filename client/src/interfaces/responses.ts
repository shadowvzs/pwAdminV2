import { IArrayValueMap } from "../helpers/arrayValueMap";
import { User } from "../models/User";

export interface AuthTokenPayload {
    type: 'bearer';
    token: string;
    refresh_token: string;
}

export interface AuthUserTokenResponse {
    user: User;
    payload: AuthTokenPayload;
}

export interface IProctypeData {
    id: number;
    name: string;
}

export interface IEquipmentData {
    id: number;
    mask: number;
    pos: number;
    version?: number;
    name: string;
}

export interface IItemColorData {
    id: number;
    code: string;
    label: string;
}

export interface IMenuSubCategoryData {
    id: number;
    label: string;
    shortId?: 'B';
    equipmentId?: number;
    version?: number;
}

export interface IMenuCategoryData {
    id: number;
    label: string;
    shortId: 'W' | 'A' | 'J' | 'O' | 'M' | 'F';
    subCategory: IMenuSubCategoryData[];
    version?: number;
}

export interface IMenuCategoryValueMapData extends IMenuCategoryData {
    subCategory: IArrayValueMap<IMenuSubCategoryData>;
}

export interface IWeaponAddonData {
    id: number;
    description: string;
    name: string;
    version: number;
    data: string;
}

export interface IAddonData {
    id: number;
    attributeId: number;
    supportedEquipment: ('W' | 'A' | 'J' | 'B' | 'M')[];
    name: string;
}

export interface IStatData {
    id: number;
    shortName: string;
    name: string;
    type: number;
    version?: number;
    isNegative?: boolean;
}

export interface IItemExtraData {
    version: number;
    soulStoneType: string[];
    statType: string[];
    stats: IStatData[];
    addons: IAddonData[];
    weaponAddons: IWeaponAddonData[];
    proctypes: IProctypeData[];
    menu: IMenuCategoryData[];
    mapQuests: number[][];
    itemColor: IItemColorData[];
    fashionColors: string[];
    equipments:IEquipmentData[];
    soulStones: {
        stat: number[];
        element: number[];
        rare: number[];
    }
}

export interface IItemExtraValueMapData extends IItemExtraData {
    version: number;
    soulStoneType: string[];
    statType: string[];
    stats: IArrayValueMap<IStatData>;
    addons: IArrayValueMap<IAddonData>;
    weaponAddons: IArrayValueMap<IWeaponAddonData>;
    proctypes: IArrayValueMap<IProctypeData>;
    menu: IArrayValueMap<IMenuCategoryValueMapData>;
    mapQuests: number[][];
    itemColor: IArrayValueMap<IItemColorData>;
    fashionColors: string[];
    equipments: IArrayValueMap<IEquipmentData>;
    soulStones: {
        stat: number[];
        element: number[];
        rare: number[];
    }
}

export interface IItemData {
    id: number;
    color: number;
    data1?: string;
    data2?: string;
    grade: number;
    name: string;
    lvReq?: number;
    version?: number;
    category: string;
    attributes?: { attributeId: number; value: number }[];
}

export interface IElfSkill {
    id: number;
    skillGrade: number;
    color: number;
    requiredTalents: {
       metal: number;
       wood: number;
       water: number;
       fire: number;
       earth: number;
    };
    name: string;
    description: string;
}

export interface IElfData {
    id: number;
    name: string;
    attributes: Record<'0' | '1' | '2' | '3', number>;
}

export interface IElfStaticData {
    color: { id: number; code: string; label: string; }[];
    skills: IElfSkill[];
    gear: number[];
    attributeMap: string[];
    elfs: IElfData;
}

export interface IElfStaticValueMapData extends IElfStaticData {
    color: IArrayValueMap<{ id: number; code: string; label: string; }>;
    skills: IArrayValueMap<IElfSkill>;
    gear: number[];
    attributeMap: string[];
    elfs: IElfData;
}

export interface IPetSkill {
    id: number;
    name: string;
    maxLv: number;
    color: number;
    description: string;
}

export interface IPetStaticData {
    type: Record<'Ride' | 'Battle' | 'AllClass', number>;
    skills: IPetSkill[];
}

export interface IPetStaticValueMapData extends IPetStaticData {
    type: Record<'Ride' | 'Battle' | 'AllClass', number>;
    skills: IArrayValueMap<IPetSkill>;
}

export interface IClassRaceData {
    id: number;
    name: string;
    color: string;
}

export interface ISkillData {
    id: number;
    name: string;
    maxLv: number;
    pathBased?: {
       holy: number;
       dark: number;
    },
    isMastery?: boolean;
    isPassive?: boolean;
    path?: 'holy' | 'dark';
    icon: string;
}

export interface IClassData {
    id: number;
    mask: number;
    race: number;
    name: string;
    shortName: string;
    icon: string;
    template: number;
    stats: Record<number, number>;
    version: number;
    skills: ISkillData[];
}

export interface IClassCultivationData {
    id: number;
    name: string;
    lvReq: number;
}

export interface IClassStaticData {
    maxMask: number;
    maxClass: number;
    race: IClassRaceData[];
    cultivations: IClassCultivationData[];
    classes: IClassData[];
    productionSkills: ISkillData[];
    commonSkills: ISkillData[];
}


export interface IClassDataWithValueMap extends IClassData {
    id: number;
    mask: number;
    race: number;
    name: string;
    shortName: string;
    icon: string;
    template: number;
    stats: Record<number, number>;
    version: number;
    skills: IArrayValueMap<ISkillData>;
}

export interface IClassStaticDataWithValueMap extends IClassStaticData {
    race: IArrayValueMap<IClassRaceData>;
    cultivations: IArrayValueMap<IClassCultivationData>;
    classes: IArrayValueMap<IClassDataWithValueMap>;

    productionSkills: IArrayValueMap<ISkillData>;
    commonSkills: IArrayValueMap<ISkillData>;
}

export interface ISkillTextData {
    id: number; 
    name: string; 
    description: string;
}

export interface IPwStoreData {
    classes: IClassStaticDataWithValueMap;
    item_db: IArrayValueMap<IItemData>;
    item_extra: IItemExtraValueMapData;
    elf: IElfStaticValueMapData;
    pet: IPetStaticValueMapData;
    skills_text: IArrayValueMap<ISkillTextData>;
}