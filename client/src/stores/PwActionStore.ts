import { observable } from "mobx";
import { EntityId } from "../models/BaseEntity";

import { User } from "../models/User";
import { BaseStore } from "./BaseStore";
import { RootStore } from "./RootStore";

type UsedConfigs = 'serverName' | string;

export class ConfigStore extends BaseStore<User> {
    public config: Map<UsedConfigs, any> = observable.map();
    public rootStore: RootStore;

    constructor(
        rootStore: RootStore
    ) {
        super('pwserver-actions', User);
        this.rootStore = rootStore;
    }

    public async addGoldToUser(userId: EntityId, amount: number) {
        const result = await this.request<User>(`${this.endpoint}/gm/${userId}`, {
            method: 'POST',
            body: { userId, amount }
        });
        console.log(result);
    }

    public async promoteToGM(userId: EntityId) {
        const result = await this.request<User>(`${this.endpoint}/gm/${userId}`, {
            method: 'PUT'
        });
        console.log(result);
    }

    public async demoteFromGM(userId: EntityId) {
        const result = await this.request<User>(`${this.endpoint}/gm/${userId}`, {
            method: 'DELETE'
        });
        console.log(result);
    }

}