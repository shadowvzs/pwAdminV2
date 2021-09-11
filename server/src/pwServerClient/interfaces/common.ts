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

export enum Race {
    Human = 0,
    Beastkind = 2,
    WingedElf = 5,
    Tideborn = 9997,
    EarthGuard = 9998,
    Shade      = 9999
}

export enum Cls {
    Warrior = 0,
    Magician = 1,
    Psychick = 2,
    Werefox = 3,
    Werebeast = 4,
    Assassin = 5,
    Archer = 6,
    Priest = 7,
}

export enum GuildRank {
    Member             = 6,
    Captain            = 5,
    Commander          = 4,
    ViceGuildMaster    = 3,
    GuildMaster        = 2
}

export enum ClsFaction {
    Warrior = 0,
    Magician = 1,
    Psychick = 2,
    Werefox = 3,
    Werebeast = 4,
    Assassin = 5,
    Archer = 6,
    Priest = 7,
}

export enum Gender {
   Male = 0,
   Female = 1
}

export type Octets = string;
export type Byte = string; // 1 character

export interface Item {
	length: number;
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

