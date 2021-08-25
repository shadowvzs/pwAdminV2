import { observable, runInAction } from "mobx";
import { Config } from "../models/Config";
import { BaseStore } from "./BaseStore";
import { RootStore } from "./RootStore";

type UsedConfigs = 'serverName' | string;

export class ConfigStore extends BaseStore<Config> {
    public config: Map<UsedConfigs, any> = observable.map();
    public rootStore: RootStore;

    constructor(
        rootStore: RootStore
    ) {
        super('pwserver-utility/configs', Config);
        this.rootStore = rootStore;
        this.getList().then(items => {
            runInAction(() => {
                items.forEach(item => this.config.set(item.id as string, item.content));
            });
        });
    }

}