import { BaseEntity, EntityId } from "./BaseEntity";

export class Config extends BaseEntity {
    public id: EntityId
    public content: string;
}