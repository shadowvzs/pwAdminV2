import { Byte, Forbidden, Gender, IItem, Octets } from "./common";

export interface Base {
    version: any;
    id: number;
    name: string;
    race: number,
    cls: number
    gender: Gender,
    custom_data: Octets;
    config_data: Octets;
    custom_stamp: number;
    status: number;
    delete_time: number;
    create_time: number;
    lastlogin_time: number;
    forbidden: Forbidden[];
    help_states: Octets;
    spouse: number;
    user_id: number;
    cross_data: Octets;
    reserved2: Byte;
    reserved3: Byte;
    reserved4: Byte;
}

export interface Status {
    version: number;
    level: number;
    culti: number;
    exp: number;
    sp: number;
    pp: number;
    hp: number;
    mp: number;
    pos_x: number;
    pos_y: number;
    pos_z: number;
    map: number;
    pk_status: number;
    pk_time: number;
    hero_time: number;
    reputation: number;
    custom_status: Octets;
    filter_data: Octets;
    charactermode: Octets;
    instancekeylist: Octets;
    dbltime_expire: number;
    dbltime_mode: number;
    dbltime_begin: number;
    dbltime_used: number;
    dbltime_max: number;
    time_used: number;
    dbltime_data: Octets;
    storesize: number;
    petcorral: Octets;
    property: Octets;
    var_data: Octets;
    skills: Octets;
    storehousepasswd: Octets;
    waypointlist: Octets;
    coolingtime: Octets;
    npc_relation: Octets;
    multi_exp_ctrl: Octets;
    storage_task: Octets;
    guild_contrib: Octets;
    force_data: Octets;
    online_award: Octets;
    profit_time_data: Octets;
    country_data: Octets;
    // [ if version is 1.5.1+ then v80+
    // [ king_data", "Octets" ],
    // [ meridian_data", "Octets" ],
    // [ extraprop", "Octets" ],
    // [ title_data", "Octets" ],
    // [ reincarnation_data", "Octets" ],
    // [ realm_data", "Octets" ],
    reserved4: number;
    reserved5: number;
}

export interface Inventory {
    capacity: number;
    timestamp: number;
    gold: number;
    items: IItem;
    reserved1: number;
    reserved2: number;
}

export type Equipments = IItem[];

export interface Banker {
    capacity: number;
    gold: number;
    items: IItem[];
    materials_capacity: number;
    fashion_capacity: number;
    materials: IItem[];
    fashions: IItem[];
    // if version is 1.5.1+ then
    // cards: [
    //		cardCap", "UByte" ],
    // 		items": ["Array", itemScheme] ]
    // ]
}

export interface Tasks {
    reserved: number;
    task_data: Octets;
    task_complete: Octets;
    task_finishtime: Octets;
    items: IItem[];
}

export enum ProcTypes {
    DoesNotDropUponDeath = 1,
    UnableToDrop = 2,
    UnableToSell = 4,
    UnableToTrade = 16,
    BoundOnEquip = 64,
    ExpireWhenLeavingArea = 256,
    UsedWhenPickedUp = 512,
    DropOnDeath = 1024,
    LostWhenPlayerLogsOut = 2048,
    CannotRepair = 4096,
    UnableToAccountStash = 16384
}