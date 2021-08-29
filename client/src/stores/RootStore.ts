import { AuthStore } from "./AuthStore";
import { ConfigStore } from "./ConfigStore";
import { ServerStatusStore } from "./ServerStatusStore";
import { UserStore } from "./UserStore";

export class RootStore {
    public newStore: any;
    public userStore: UserStore;
    public configStore: ConfigStore;
    public serverStatusStore: ServerStatusStore;
    public authStore: AuthStore;
    public redirect: (url: string) => void;

    public dispose() {
        this.configStore.dispose();
        this.serverStatusStore.dispose();
        this.authStore.dispose();
        this.userStore.dispose();
    }

    public init() {
        this.configStore.init();
        this.serverStatusStore.init();
        this.authStore.init();
        this.userStore.init();
    }

    constructor() {
        this.configStore = new ConfigStore(this);
        this.serverStatusStore = new ServerStatusStore(this);
        this.authStore = new AuthStore(this);
        this.userStore = new UserStore(this);
    }
}
