import { ChatMessageDto } from "../dto/ChatMessage.dto";
import { ChannelType } from "../interfaces/chat";
import { IRoleGuild } from "../interfaces/guild";
import { IRoleBean } from "../interfaces/role-bean";
import { WritePacket } from "../Packeter";
import { getIdScheme, getRoleScheme, putRoleScheme, roleGuildScheme } from "../scheme/roleScheme";

const defaultRoles = {
	0: 17,
	1: 16,
	3: 23,
	4: 24,
	6: 28,
	7: 31
};	

export class RoleBean {
	public roleId: number;
	public data: { 
		role?: IRoleBean,
		guild?: IRoleGuild
	} = {};
	
	constructor(roleId?: number) {
		if (roleId) { this.roleId = roleId; }
	}
	
	async getId(name: string): Promise<number> {
		const packet = new WritePacket(getIdScheme);
		packet.WriteUInt32(-1);							// localsid		
		packet.WriteString(name);						// role name			
		packet.WriteUByte(0);							// unknown			
		packet.Pack(0x0bd9);		
		const role_id = (await packet.Request()).base.role_id;
		return (role_id > 0 && role_id < 0x7fffffff) ? role_id : false;		
	}
	
	async reset(): Promise<void> {
		const oldData = { ...(await this.load()) };
		const defRoleId = this.getDefaultRoleId(oldData.base.cls);
		const defaultRole = new RoleBean(defRoleId);
		const data = await defaultRole.load();
		this.data.role = data;
		this.data.role.base.id = oldData.base.id;
		this.data.role.base.name = oldData.base.name;
		this.data.role.base.gender = oldData.base.gender;
		this.data.role.base.user_id = oldData.base.user_id;
		this.data.role.base.spouse = oldData.base.spouse;
		this.save();
	}
	
	getDefaultRoleId(cls: number): number {

		return defaultRoles[cls] || 0;
	}
	
	async getGuild(roleId?: number): Promise<IRoleGuild> {
		if (!this.roleId && !roleId) { throw new Error('Role id missing'); }
		const packet = new WritePacket(roleGuildScheme);
		packet.WriteUInt32(-1);							// localsid			
		packet.WriteUInt32(1);							// unknown			
		packet.WriteUInt32(roleId || this.roleId);					// role id	
		packet.Pack(0x11ff);		
		this.data.guild = (await packet.Request()).details;
		return this.data.guild;
	}
		
	async delete(hard = false): Promise<void> {
		if (!this.roleId) { return; }
		if (hard) {
			const data = await this.load();
			data.base.status = 2;
			return this.save();
		}
		
		const packet = new WritePacket(29100);			
		packet.WriteUInt32(this.roleId)		  				// roleId
		packet.WriteUInt32(-1); 							  	// allways
		packet.Pack(0x56);							  		// pack opcode and length
		packet.Send();
	}
	
	async save(): Promise<void> {
		if (!this.data.role) { return console.warn('Missing id or data!'); }
		const packet = new WritePacket(putRoleScheme);			
		packet.WriteUInt32(-1); 							// allways
		packet.WriteUInt32(this.roleId)		  				// roleId
		packet.WriteUByte(1); 								// overwrite		
		packet.PackAll(this.data.role);
	}
	
	async ban(duration = 3600, banType = 100, reason = "", bannerGM = -1): Promise<any> {
		//ban types: 100-role, 101-chat,102-?,103-?
		const packet = new WritePacket(29100);			
		packet.WriteUByte(banType); 
		packet.WriteUInt32(bannerGM)		  			// gm id
		packet.WriteUInt32(0); 							// localsid
		packet.WriteUInt32(this.roleId); 				// target id
		packet.WriteUInt32(duration); 					// time
		packet.WriteString(reason); 					// allways
		packet.Pack(0x16E);							  	// pack opcode and length
		return await packet.Send();		
	}
	
	async rename(newName: string): Promise<any> {
		if (!this.roleId) { throw new Error('Role id missing'); }
		if (!this.data.role?.base) { await this.load(); }
		const packet = new WritePacket(29400);			
		packet.WriteUInt32(-1); 						// allways
		packet.WriteUInt32(this.roleId)		  			// roleId
		packet.WriteString(this.data.role.base.name);	// old name	
		packet.WriteString(newName);					// new name
		packet.Pack(0xd4c);								// pack opcode and length
		return await packet.Send();
	}
	
	async load(id?: number): Promise<IRoleBean> {
		if (id) { this.roleId = id; }
		const packet = new WritePacket(getRoleScheme);			
		packet.WriteUInt32(-1); 							  	// allways
		packet.WriteUInt32(this.roleId)		  					// roleId
		packet.Pack(0x1F43);							  		// pack opcode and length
		const role = await packet.Request();
		this.data.role = role;
		return role;
	}

	public async sendChatMessage(chatMsg: ChatMessageDto): Promise<void> {
		const packet = new WritePacket(29300);					
		packet.WriteUByte(chatMsg.channel || ChannelType.System)	// chat channel id
		packet.WriteUByte(chatMsg.emoticonId || 0)					// emoticon id
		packet.WriteUInt32(chatMsg.roleId || this.roleId)		  	// roleId
		packet.WriteString(chatMsg.message)		  					// message
		packet.WriteOctets(""); 									// allways, idk this
		packet.Pack(0x78);							  				// pack opcode and length
		await packet.Send();
	}
}