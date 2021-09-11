import { computed, makeObservable } from "mobx";
import { EntityId } from "../models/BaseEntity";
import { UserRoleItem } from "../models/RoleBean";
import { User, UserDto } from "../models/User";
import { BaseStore } from "./BaseStore";
import { RootStore } from "./RootStore";

export class UserStore extends BaseStore<User> {
    public rootStore: RootStore;

    public get users(): UserDto[] {
        return this.items as any[] as UserDto[];
    }

    constructor(
        rootStore: RootStore
    ) {
        super('users', User);
        makeObservable(this, { users: computed })
        this.rootStore = rootStore;
    }

    

    public async getProfile(): Promise<User> {
        const profile = await this.request<User>(this.endpoint + '/me');
        return profile;
    }

    public async addGoldToUser(userId: EntityId, amount: number) {
        await this.request<User>(`${this.endpoint}/gm/${userId}`, {
            method: 'POST',
            body: { userId, amount }
        });
    }

    public async promoteToGM(userId: EntityId) {
        await this.request<User>(`${this.endpoint}/gm/${userId}`, {
            method: 'PUT'
        });
        this.getList();
    }

    public async demoteFromGM(userId: EntityId) {
        await this.request<User>(`${this.endpoint}/gm/${userId}`, {
            method: 'DELETE'
        });
        this.getList();
    }

    public async getRoles(userId: EntityId): Promise<UserRoleItem[]> {
        return await this.request<UserRoleItem[]>(`${this.endpoint}/roles/${userId}`);
    }

    public async getUserInfo(userId: EntityId) {
        await this.request<User>(`${this.endpoint}/info/${userId}`);
    }

    public async setGold(userId: EntityId, amount: number) {
        await this.request<User>(`${this.endpoint}/set-gold/${userId}/${amount}`, { 
            method: 'POST' 
        });
        // this.getList();
    }

}