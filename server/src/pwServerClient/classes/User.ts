import { IUserInfo } from "../interfaces/user";
import { UserRoleItem } from "../interfaces/role-list";
import { WritePacket } from "../Packeter";
import { userInfoScheme, userRoleListScheme } from "../scheme/userScheme";

export class User {
	public data: any;
	public id: number;

	constructor(id = 32) {
		this.data = {};
		this.id = id;
	}
	
	async getRoleList(id?: number): Promise<UserRoleItem[]> {
		const packet = new WritePacket(userRoleListScheme);			
		packet.WriteUInt32(-1); 							  	// allways
		packet.WriteUInt32(id || this.id)		  		// userId
		packet.Pack(0xD49);							  			// pack opcode and length
		const roleList = (await packet.Request()).base.roles;
		this.data.roleList = roleList;
		return roleList;
	}
	
	async getInfo(userId?: number): Promise<IUserInfo> {
		const packet = new WritePacket(userInfoScheme);			
		packet.WriteUInt32(-1); 							  	// allways
		packet.WriteUInt32(userId || this.id)		  		// userId
		packet.Pack(0xbba);							  			// pack opcode and length
		const info = (await packet.Request()).info;
		this.data.info = info;
		return info;
	}	
	
	async setGold(amount: number): Promise<void> {
		// Warning: this not add cubi/gold, this set the cubi/gold but instant!
		const packet = new WritePacket(29400);	
		packet.WriteUInt32(this.id)					    		// which user account
		packet.WriteUInt32(amount)					 			// amount (100 = 1 gold)
		packet.Pack(0x209);							  			// pack opcode and length
		await packet.Send();	
	}
}

module.exports = User;