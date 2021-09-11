import { IMail } from "../interfaces/mail";
import { WritePacket } from "../Packeter";
import { sysMailScheme } from "../scheme/mailScheme";

export class MailSender {
	public data: IMail;
	
	constructor(mailOptions = null) {
		
		this.data = {
			sysMsg: {
				tid: 344,
				sender_id: 32,
				sys_type: 3,
				target_id: 1024,
				title: "Test Title",
				message: "Test Message",
				item_id: 0,
				pos: 0,
				count: 0,
				max_count: 0,
				octet: "",
				proctype: 0,
				expire: 0,
				guid1: 0,
				guid2: 0,
				mask: 0,
				gold: 0
			}
		}
		mailOptions && this.update(mailOptions);
	}

	update(data: IMail['sysMsg']): void {
		Object.keys(data).forEach(e => this.data.sysMsg[e] = data[e] );
	}
	
	sendGold(gold: number): void {
		const oldGold = this.data.sysMsg.gold;
		this.data.sysMsg.gold = gold;
		this.sendSysMail();
		this.data.sysMsg.gold = oldGold;
	}

	async sendSysMail(): Promise<any> {
		const packet = new WritePacket(sysMailScheme);			
		const response = await packet.PackAll({ sys: this.data.sysMsg });
		return response;
	}
}