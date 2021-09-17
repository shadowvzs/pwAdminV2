import { action, makeObservable, observable, runInAction } from "mobx";
import { PW_STORE_DATA } from "../constants/core";
import { afterResponseMapping, IMappableTypes, IPostMappableTypes, responseMappers } from "../helpers/responseMapper";
import { IPwStoreData } from "../interfaces/responses";
import { Config } from "../models/Config";
import { ServerStatus } from "../models/Status";
import { Role, User } from "../models/User";
import { BaseStore } from "./BaseStore";
import { RootStore } from "./RootStore";

type UsedConfigs = 'serverName' | string;

export class PwServerStore extends BaseStore<any> {
    public rootStore: RootStore;
    public timerId: any;
    public serverStatuses: ServerStatus[] = [];
    public setServerStatuses(serverStatuses: ServerStatus[]) { this.serverStatuses = serverStatuses; }
    public config: Map<UsedConfigs, any> = observable.map();
    public data: IPwStoreData = {} as IPwStoreData;

    constructor(
        rootStore: RootStore
    ) {
        super('pwserver');
        this.rootStore = rootStore;
        makeObservable(this, {
            serverStatuses: observable,
            setServerStatuses: action.bound,
        });
    }

    public async loadServerStatuses() {
        const result = await this.request<ServerStatus[]>(this.endpoint + '/statuses');
        this.setServerStatuses(result);
    }

    public async loadConfigs() {
        const result = await this.request<Config[]>(this.endpoint + '/configs');
        runInAction(() => {
            result.forEach(item => {
                if (item.type === 'json') {
                    this.config.set(item.id as string, JSON.parse(item.content));
                } else {
                    this.config.set(item.id as string, item.content);
                }
                
            });
        });
    }

    public loadStaticData = async (user: User | null) => {
        if (!user || user.role !== Role.Admin) { return; }
        const staticData = (this.config.get('staticData') as string[]).filter(x => !this.config.has(x));
        if (staticData && staticData.length < 1) { return; }
        const promises = staticData.map(x => this.request(this.endpoint + `/static-data/${x}`));
        const result = await Promise.all(promises);
        result.forEach((data, idx) => {
            const key = staticData[idx] as keyof IPwStoreData;
            if (responseMappers.hasOwnProperty(key)) {
                data = responseMappers[key as IMappableTypes](data);
            }
            this.data[key] = data;
        });
        Object.assign(PW_STORE_DATA, this.data);
        Object.entries(this.data)
            .filter(([key]) => afterResponseMapping
            .hasOwnProperty(key)).forEach(([key, data]) => {
                afterResponseMapping[key as IPostMappableTypes](data);
            }
        );
    }

    public async init() {
        this.loadServerStatuses();
        this.timerId = setInterval(() => {
            this.loadServerStatuses();
        }, 2000);
        this.disposers.push(() => clearInterval(this.timerId));
        this.rootStore.userSubscriptions.push(this.loadStaticData)
        await this.loadConfigs();
    }
}