import { ServerStatus } from "../models/Status";
import { BaseStore } from "./BaseStore";
import { RootStore } from "./RootStore";

export class ServerStatusStore extends BaseStore<ServerStatus> {
    public rootStore: RootStore;
    public timerId: any;

    constructor(
        rootStore: RootStore
    ) {
        super('pwserver-utility/statuses', ServerStatus);
        this.rootStore = rootStore;
    }

    init = () => {
        this.getList();
        this.timerId = setInterval(() => {
            this.getList();
        }, 2000);
        this.disposers.push(() => clearInterval(this.timerId));
    }
}