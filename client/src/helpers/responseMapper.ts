import { IClassStaticData, IClassStaticDataWithValueMap, IElfStaticData, IElfStaticValueMapData, IItemData, IItemExtraData, IItemExtraValueMapData, IMenuCategoryValueMapData, IPetStaticData, IPetStaticValueMapData, ISkillTextData } from "../interfaces/responses";
import { ArrayValueMap, IArrayValueMap } from "./arrayValueMap";

export const responseMappers = {
    classes: (data: IClassStaticData): IClassStaticDataWithValueMap => {
        const newData = JSON.parse(JSON.stringify(data)) as IClassStaticDataWithValueMap;
        newData.productionSkills = ArrayValueMap.create(data.productionSkills);
        newData.commonSkills = ArrayValueMap.create(data.commonSkills);
        newData.race = ArrayValueMap.create(data.race);
        newData.cultivations = ArrayValueMap.create(data.cultivations);        
        newData.classes = ArrayValueMap.create(
            data.classes.map(x => ({ ...x, skills: ArrayValueMap.create(x.skills) }))
        );
        return newData;
    },
    item_db: (data: IItemData[]): IArrayValueMap<IItemData> => ArrayValueMap.create(data),
    item_extra: (data: IItemExtraData): IItemExtraValueMapData => {
        const newData = JSON.parse(JSON.stringify(data)) as IItemExtraValueMapData;
        newData.stats = ArrayValueMap.create(data.stats);
        newData.addons = ArrayValueMap.create(data.addons);
        newData.weaponAddons = ArrayValueMap.create(data.weaponAddons);
        newData.proctypes = ArrayValueMap.create(data.proctypes);
        newData.itemColor = ArrayValueMap.create(data.itemColor);
        newData.equipments = ArrayValueMap.create(data.equipments);
        newData.menu = ArrayValueMap.create(
            data.menu.map(x => ({...x, subCategory: ArrayValueMap.create(x.subCategory) } as IMenuCategoryValueMapData)), 
            'shortId'
        );
        return newData;
    },
    skills_text: (data: ISkillTextData[]): IArrayValueMap<ISkillTextData> => ArrayValueMap.create(data),
    pet: (data: IPetStaticData): IPetStaticValueMapData => ({ ...data, skills: ArrayValueMap.create(data.skills) }),
    elf: (data: IElfStaticData): IElfStaticValueMapData => { 
        const newData = JSON.parse(JSON.stringify(data)) as IElfStaticValueMapData;
        newData.color = ArrayValueMap.create(data.color);
        newData.skills = ArrayValueMap.create(data.skills);
        return newData;
    },
};

export type IMappableTypes = keyof typeof responseMappers;

// export interface IItemExtraValueMapData extends IItemExtraData {
//     version: number;
//     soulStoneType: string[];
//     statType: string[];
//     stats: IArrayValueMap<IStatData>;
//     addons: IArrayValueMap<IAddonData>;
//     weaponAddons: IArrayValueMap<IWeaponAddonData>;
//     proctypes: IArrayValueMap<IProctypeData>;
//     menu: IMenuCategoryData[];
//     mapQuests: number[][];
//     itemColor: IArrayValueMap<IItemColorData>;
//     fashionColors: string[];
//     equipments: IArrayValueMap<IEquipmentData>;
//     soulStones: {
//         stat: number[];
//         element: number[];
//         rare: number[];
//     }
// export interface IPwStoreData {
//     classes: IClassStaticDataWithValueMap;
//     item_db: IArrayValueMap<IItemData>;
//     item_extra: IItemExtraData;
//     elf: IElfStaticData;
//     pet: IPetStaticData;
//     skills_text: IArrayValueMap<ISkillTextData>;
// }