import { Injectable } from '@nestjs/common';
import { BanRoleDto } from './dto/BanRole.dto';
import { ChatMessageDto } from './dto/ChatMessage.dto';
import { IRoleBean } from './interfaces/role-bean';
import { IUserInfo } from './interfaces/user';
import { UserRoleItem } from './interfaces/role-list';

import { WritePacket } from './Packeter';
import { onlineListScheme } from './scheme/GMScheme';
import { userInfoScheme, userRoleListScheme } from './scheme/userScheme';
import { RoleBean } from './classes/RoleBean';
import { AddGoldDto } from 'src/users/dto/AddGold.dto';

@Injectable()
export class PwServerClientProvider {

    public async getRoleList(userId: number): Promise<UserRoleItem[]> {
		const packet = new WritePacket(userRoleListScheme);			
		packet.WriteUInt32(-1); 							  	// allways
		packet.WriteUInt32(userId)		  						// userId
		packet.Pack(0xD49);							  			// pack opcode and length
		const result = await packet.Request();
		return result.base.roles;
	}
	
	public async getInfo(userId: number): Promise<IUserInfo> {
		const packet = new WritePacket(userInfoScheme);			
		packet.WriteUInt32(-1); 							  	// allways
		packet.WriteUInt32(userId)		  						// userId
		packet.Pack(0xbba);							  			// pack opcode and length
		const result = await packet.Request();
		return result.info;
	}	
	
	public async setGold(addGoldDto: AddGoldDto): Promise<boolean> {
		// Warning: this not add cubi/gold, this set the cubi/gold but instant!
		const packet = new WritePacket(29400);	
		packet.WriteUInt32(addGoldDto.userId)					 		// which user account
		packet.WriteUInt32(addGoldDto.amount)					 		// amount (100 = 1 gold)
		packet.Pack(0x209);							  		// pack opcode and length
		packet.Send();	
		const result = true;
		return result;
	}

    async sendChatMessage(chatMsg: ChatMessageDto): Promise<any> {
		const role = new RoleBean(chatMsg.roleId);
		role.sendChatMessage(chatMsg);
	}

    async ban(data: BanRoleDto): Promise<void> {
		const packet = new WritePacket(29100);			
		packet.WriteUByte(data.type); 
		packet.WriteUInt32(data.bannerRoleId)		  	// gm id
		packet.WriteUInt32(0); 							// localsid
		packet.WriteUInt32(data.targetRoleId); 			// target id
		packet.WriteUInt32(data.duration); 				// duration timestamp
		packet.WriteString(data.reason); 				// allways
		packet.Pack(0x16E);							    // pack opcode and length
		packet.Send();		
	}

	async getOnlineList(gmRoleId: number): Promise<number> {
		const packet = new WritePacket(onlineListScheme);	
		packet.WriteUInt32(-1); 				// localsid
		packet.WriteUInt32(gmRoleId);		    // gm_role_id
		packet.WriteUInt32(1); 				    // source ?
		packet.WriteOctets("31"); 			    // idk ?
		packet.Pack(0x160);				        // pack opcode and length		
		const result = await packet.Request();
		return result.base;
	}

	async getRoleBean(roleId: number): Promise<IRoleBean> {
		const rolebean = new RoleBean(roleId);
		const roleData = await rolebean.load(roleId);
		return roleData;
	}
}
