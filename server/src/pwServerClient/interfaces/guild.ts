import { Byte, Cls, GuildRank, Octets } from "./common";

export interface IRoleGuild {
    role_id: number;
    name: string;
    guild_id: number;
    cls: Cls;
    rank: GuildRank;
    unknown: Byte,
    extend: Octets;
    title: string;
}

export interface IGuildMember {
	length: number;
	role_id: number;
	level: number;
	rank: number;
	login_day: number;
	unknown1: Byte;
	unknown2: Byte;
	unknown3: Byte;
	name: string;
	title: string;
}

export interface IGuild {
    length: number;
    unknown1: number;
    unknown2: Byte;
    unknown3: Byte;
    id: number;
    name: string;
    level: number;
    master_id: number;
    master_role: number;
    members: IGuildMember[];
    slogan: string;
    unknown4: Byte;
}
