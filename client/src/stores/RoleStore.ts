import { RoleBean } from '../models/RoleBean';
import { BaseStore } from "./BaseStore";
import { RootStore } from "./RootStore";

export class RoleStore extends BaseStore<RoleBean> {
    public rootStore: RootStore;

    constructor(
        rootStore: RootStore
    ) {
        super('roles', RoleBean);

        this.rootStore = rootStore;
    }

    public async get(roleId: number): Promise<RoleBean> {
        const result = await super.get(roleId);
        console.log(result);
        return result;
    }
}