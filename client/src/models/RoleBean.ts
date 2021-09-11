import { IRoleBean } from "../interfaces/role-bean";
import { Base, Status, Inventory, Equipments, Banker, Tasks } from "../interfaces/role-bean-data";
import { EntityId } from "./BaseEntity";

export class RoleBean implements IRoleBean {
    public id: EntityId;
    public base: Base;
    public status: Status;
    public inventory: Inventory;
    public equipments: Equipments;
    public banker: Banker;
    public tasks: Tasks;
}

export interface UserRoleItem {
    id: number;
    name: string;
}