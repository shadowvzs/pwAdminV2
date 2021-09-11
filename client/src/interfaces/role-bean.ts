import * as Role from "./role-bean-data";

export interface IRoleBean {
    base: Role.Base;
    status: Role.Status;
    inventory: Role.Inventory;
    equipments: Role.Equipments;
    banker: Role.Banker;
    tasks: Role.Tasks;
}