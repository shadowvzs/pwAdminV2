import { reaction } from "mobx";
import { User } from "../models/User";
import { AuthStore } from "./AuthStore";
import { PwServerStore } from "./PwServerStore";
import { RoleStore } from "./RoleStore";
import { UserStore } from "./UserStore";

export class RootStore {
    public roleStore: RoleStore;
    public userStore: UserStore;
    public pwServerStore: PwServerStore;
    public authStore: AuthStore;

    public redirect: (url: string) => void;

    public userSubscriptions: ((user: User | null) => void)[] = [];
    private disposers: (() => void)[] = [];

    public dispose() {
        this.pwServerStore.dispose();
        this.authStore.dispose();
        this.userStore.dispose();
        this.roleStore.dispose();
        this.disposers.forEach(x => x());
    }

    public async init() {
        const inits = [
            this.pwServerStore.init(),
            this.authStore.init(),
            this.userStore.init(),
            this.roleStore.init(),                
        ];
        this.disposers.push(
            reaction(
                () => this.authStore.currentUser!,
                (user: User) => this.userSubscriptions.forEach(x => x(user))
            )
        );
        await Promise.all(inits);
    }

    constructor() {
        this.pwServerStore = new PwServerStore(this);
        this.authStore = new AuthStore(this);
        this.userStore = new UserStore(this);
        this.roleStore = new RoleStore(this);
    }
}
