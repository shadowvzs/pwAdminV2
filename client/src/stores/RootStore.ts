import { AuthStore } from "./AuthStore";
import { ConfigStore } from "./ConfigStore";
import { ServerStatusStore } from "./ServerStatusStore";

export class RootStore {
    public newStore: any;
    public userStore: any;
    public configStore: ConfigStore;
    public serverStatusStore: ServerStatusStore;
    public authStore: AuthStore;
    public redirect: (url: string) => void;

    public dispose() {
        this.configStore.dispose();
        this.serverStatusStore.dispose();
        this.authStore.dispose();
    }

    public init() {
        this.configStore.init();
        this.serverStatusStore.init();
        this.authStore.init();
    }

    constructor() {
        this.configStore = new ConfigStore(this);
        this.serverStatusStore = new ServerStatusStore(this);
        this.authStore = new AuthStore(this);
    }
}
