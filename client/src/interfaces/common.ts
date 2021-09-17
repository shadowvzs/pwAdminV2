export interface Forbidden {
	length: number;
	type: BanType;
	time: number;
	created_time: number;
	reason: string;
};

export type ExpLog = any;

export interface Autolock {
	length: number;
	key: number;
	value: number;
};

export type IBaseHeaderInfo = {
    port: number;
    request: number;
    response: string;
}

export enum BanType {
    Role     = 100,
    Chat     = 101,
    Unknown1 = 102,
    Unknown2 = 103
}

export type IScheme = {protocol?: IBaseHeaderInfo } & Record<string, any>;

export enum CharmType {
    HP = 0,
    MP = 1,
    PAttack = 2,
    MAttack = 3,
    PHarm = 4,
    MHarm = 5
}

export enum GuildRank {
    Member             = 6,
    Captain            = 5,
    Commander          = 4,
    ViceGuildMaster    = 3,
    GuildMaster        = 2
}

export interface IProctype {
    value: number;
    text: string;
}

export enum Gender {
   Male = 0,
   Female = 1
}

export type Octets = string;
export type Byte = string; // 1 character

export interface IItem {
	id: number;
	pos: number;
	count: number;
	max_count: number;
	data: Octets;
	proctype: number;
	expire_date: number;
	guid1: number;
	guid2: number;
	mask: number;
}

export type ItemKey = keyof IItem;

export enum Equipmentslots {
    Weapon           = 0,
    Helm             = 1,
    Necklance        = 2,
    Manteau          = 3,
    Chest            = 4,
    Belt             = 5,
    Leg              = 6,
    Shoes            = 7,
    Arm              = 8,
    Ring1            = 9,
    Ring2            = 10,
    Ammo             = 11,
    Flyer            = 12,
    FashionTop       = 13,
    FashionLeg       = 14,
    FashionShoes     = 15,
    FashionArm       = 16,
    AttackCharm      = 17,
    Tome             = 18,
    ChatSmiley       = 19,
    HPCharm          = 20,
    MPCharm          = 21,
    BlessBox         = 22,
    Genie            = 23,
    VendorShop       = 24,
    FashionHair      = 25,
    OrderBadge       = 26,
    MarkOfMight      = 27,
    FashionWeapon    = 29,
    DestroyerCard    = 32,
    BattleCard       = 33,
    LongevityCard    = 34,
    DuratibilityCard = 35,
    SoulprimeCard    = 36,
    LifeprimeCard    = 37,
    Starchart        = 38,
}

export enum Equipmentmasks {
    Weapon        = 1,
    Helm          = 2,
    Necklance     = 4,
    Manteau       = 8,
    Chest         = 16,
    Belt          = 32,
    Leg           = 64,
    Shoes         = 128,
    Arm           = 256,
    Ring1         = 1536,
    Ring2         = 1536,
    Ammo          = 2048,
    Flyer         = 4096,
    FashionTop    = 8192,
    FashionLeg    = 16384,
    FashionShoes  = 32768,
    FashionArm    = 65536,
    AttackCharm   = 131072,
    Tome          = 262144,
    ChatSmiley    = 524288,
    HPCharm       = 1048576,
    MPCharm       = 2097152,
    BlessBox      = 1077936128,
    Elf           = 8388608,
    VendorShop    = 16777216,
    FashionHair   = 33554432,
    OrderBadge       = 67108864,
    MarkOfMight      = 402653184,
    FashionWeapon    = 536870912,
    DestroyerCard    = 2147483585,
    BattleCard       = 2147483585,
    LongevityCard    = 2147483585,
    DuratibilityCard = 2147483585,
    SoulprimeCard    = 2147483585,
    LifeprimeCard    = 2147483585,
    Starchart        = -2147483584,
}