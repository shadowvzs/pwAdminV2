import { GuildRank } from "../interfaces/common";
import { IGuild } from "../interfaces/guild";
import { WritePacket } from "../Packeter";
import { guildInfoScheme, guildListScheme } from "../scheme/guildScheme";

export class Guild {
	public id: number;
	public data: { 
		info?: IGuild; list?: IGuild[];  
	} = {};
	
	constructor(id = null) {
		this.data = {};
		id && (this.id = id);
	}
	
	// create guild, need master role id, guild name and guild id (optional)
	async create(name: string, roleId: number, id?: number): Promise<any> {
		if (!id) {
			const list = await this.getAll();
			const indexs = Object.keys(list);
			if (this.id) {
				id = this.id;
			} else {
				id = indexs.length ? (list[indexs.pop()].id + 1) : 1;
			}
		}
		const packet = new WritePacket(29400);
		packet.WriteUInt32(-1);							// localsid		
		packet.WriteString(name);						// guild name			
		packet.WriteUInt32(roleId);						// guild master id			
		packet.WriteUInt32(id);							// guild id			
		packet.Pack(0x11f8);		
		await packet.Send();	
		return await this.load(id);
	}
	
	// not work this way, no error but somehow guild level not changed
	async upgrade(level: number): Promise<any> {
		if (!this.id) { return console.warn('Create or load guild before upgrade!'); }
		if (!this.data.info) {
			await this.load(this.id);
		}
		const packet = new WritePacket(29400);
		packet.WriteUInt32(-1);							// localsid		
		packet.WriteUInt32(this.id);					// guild id			
		packet.WriteUInt32(this.data.info.master_id);	// guild master id			
		packet.WriteUInt32(0);							// unknown			
		packet.WriteUByte(level);						// level		
		packet.Pack(0x1202);		
		const response = await packet.Send();
		return response;	
	}

	// not work this way, no error but somehow guild not dismissed
	async delete(): Promise<any> {
		if (!this.id) {	return console.warn('First create or load a guild!');	}
		const packet = new WritePacket(29400);
		packet.WriteUInt32(-1);							// localsid		
		packet.WriteUInt32(this.id);					// guild id			
		packet.Pack(0x11f9);		
		return await packet.Send();	
	}
	
	// change member rank in this guild
	// ranks: member - 0x06, 05 captain, 04 commander, 03 vice gm, 02 gm
	async setRoleRank(role_id: number, rank: GuildRank, forced = false): Promise<any> {
		// if forced then skip conditions and loading 
		if (!this.id) { throw new Error(`Set guild id!`); }
		const data = await this.load(this.id) || false;
		let resign_id = false;
		if (!data) { throw new Error(`Guild not exist!`); }	

		if (!forced) {
			if (!GuildRank[rank]) { 
				throw new Error(`Rank must be between 2-6 but it is ${rank}!`);
			}
			if (!data.members.find(e => e.role_id == role_id)) {
				throw new Error(`This role isn't in this guild!`);
			}
			if (role_id === data.master_id && rank != 2) {
				if (data.members.length < 2) {
					throw new Error(`Cannot resign from GM position if you are alone in guild`);
				}
				const newGuildMaster = data.members.find(e => e.role_id != role_id);
				await this.setRoleRank(newGuildMaster.role_id, GuildRank.GuildMaster, true);
				data.master_id = newGuildMaster.role_id;
			} else if (role_id !== data.master_id && rank == GuildRank.GuildMaster) {
				resign_id = Boolean(data.master_id);
			}
		}
		const packet = new WritePacket(29400);
		packet.WriteUInt32(-1);							// allways			
		packet.WriteUInt32(this.id);					// guild id			
		packet.WriteUInt32(data.master_id);				// guild master		
		packet.WriteUInt32(role_id);					// role			
		packet.WriteUByte(2); 							// unknown fix
		packet.WriteUByte(rank); 						// member - 0x06, 05 captain, 04 commander, 03 vice gm, 02 gm
		packet.WriteUInt32(0x0c); 						// unknown but fix
		packet.Pack(0x1203);							// pack opcode and length
		await packet.Send();			

		if (rank === GuildRank.GuildMaster) {
			data.master_id === role_id;
		}
		if (resign_id) {
			await this.setRoleRank(data.master_id, GuildRank.Member, true);
		}
		return true;
	}
	
	// get every guild on server with guild master and member id's
	async getAll(): Promise<any> {
		const packet = new WritePacket(guildListScheme);			
		packet.WriteUInt32(-1); 						// unknown
		packet.WriteUByte(0x80); 						// unknown
		packet.WriteString("factioninfo", 'utf8');		// table name
		packet.WriteUInt32(0); 							// unknown
		packet.Pack(0x0bef);         					// pack opcode and length
		this.data.list = await packet.Request();
		return this.data.list;
	}
	
	// simple guild data (inc members with name, level, title etc)
	async load(id = null): Promise<IGuild> {
		id && (this.id = id);
		const packet = new WritePacket(guildInfoScheme);
		packet.WriteUInt32(-1);							// allways			
		packet.WriteUInt32(this.id);						// guild id	
		packet.Pack(0x1200);
		this.data.info = (await packet.Request()).info;
		return this.data.info;		
	}
}