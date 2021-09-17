import { makeAutoObservable } from "mobx";
import { IItem, ItemKey } from "../interfaces/common";

export class Item implements IItem {
    public id: number;
    public grade: number = 1;
    public mask: number = 0;
    public pos: number = 0;
    public proctype: number = 0;
    public count: number = 1;
    public max_count: number = 1;
    public expire_date: number = 0;
    public guid1: number = 0;
    public guid2: number = 0;
    public data: string = '';

    public set(field: ItemKey | Partial<Record<ItemKey, any>>, value?: Item[ItemKey]) {
        const item = (this as Record<ItemKey, any>);
        if (typeof field === 'object') {
            Object.entries<IItem>(field).forEach(([k, v]) => {
                item[k as ItemKey] = v;
            });
        } else {
            item[field] = value;
        }
    }

    constructor(initData?: Partial<Record<ItemKey, any>>) {
        makeAutoObservable(this);
        if (initData) { this.set(initData); }
    }
}