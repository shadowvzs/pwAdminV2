import { BaseEntity, EntityId } from "./BaseEntity";

export class Config extends BaseEntity {
    public id: EntityId
    public type?: 'string' | 'json';
    public content: string;
}