import { ITerritory } from "../interfaces/territory";
import { WritePacket } from "../Packeter";
import { territoriesScheme } from "../scheme/territoryScheme";

export class Territory {
	public data: { list?: ITerritory[] } = {};
	public id: number;
	
	constructor(id?: number) {
		this.id = id;
	}
	
	async getList(): Promise<ITerritory[]> {
		const packet = new WritePacket(territoriesScheme);
		packet.WriteUInt32(-1);							// localsid			
		packet.WriteUInt32(1);							// unknown		
		packet.Pack(0x35f);	
		const result = await packet.Request();
		this.data.list = result;
		return result;
	}
}