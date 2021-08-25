export type EntityId = number | string;
export class BaseEntity {
    public id?: EntityId;
    public createdAt?: Date;
    public createdBy?: string;
    public updatedAt?: Date;
    public updatedBy?: string;
}