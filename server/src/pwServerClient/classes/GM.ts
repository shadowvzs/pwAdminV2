import { WritePacket } from "../Packeter";
import { onlineListScheme } from "../scheme/GMScheme";

export class GM {
	public data: { onlineList?: any } = {};
	public roleId = -1;

	constructor(roleId = -1) {
		this.roleId = roleId;
	}
	
	async ban(target_id: number, duration = 3600, banType = 100, reason = "", bannerGM = -1): Promise<any> {
		// ban types: 100-role, 101-chat,102-?,103-?
		const packet = new WritePacket(29100);			
		packet.WriteUByte(banType); 
		packet.WriteUInt32(this.roleId || bannerGM)		// gm id
		packet.WriteUInt32(0); 							// localsid
		packet.WriteUInt32(target_id); 					// target id
		packet.WriteUInt32(duration); 					// time
		packet.WriteString(reason); 					// allways
		packet.Pack(0x16E);								// pack opcode and length
		packet.Send();		
	}
	
	async getOnlineList(): Promise<any> {
		const packet = new WritePacket(onlineListScheme);	
		packet.WriteUInt32(-1); 				// localsid
		packet.WriteUInt32(this.roleId);		// gm_role_id
		packet.WriteUInt32(1); 					// source ?
		packet.WriteOctets("31"); 				// idk ?
		packet.Pack(0x160);						// pack opcode and length		
		this.data.onlineList = (await packet.Request()).base;
		return this.data.onlineList;
	}
	
}