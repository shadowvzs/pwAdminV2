import { computed, makeObservable } from "mobx";
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

}