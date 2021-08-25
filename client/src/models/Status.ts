import { EntityId } from "./BaseEntity";

export class ServerStatus {
    public id?: EntityId;
    public name: string;
    public status: boolean;
}