const primaryKey = Symbol('primaryKey');

export interface IArrayValueMap<T> extends Array<T> {
    [primaryKey]: string;
    valueMap: Record<string | number, T>;
    add: (item: T) => void;
    remove: (primaryKey: string | number) => void;
    setValues: (array: T[]) => void;
    filter: (predicate: (value: T, index: number, array: T[]) => boolean, thisArg?: any) => IArrayValueMap<T>; 
}


export class ArrayValueMap<T> extends Array<T> implements IArrayValueMap <T> {

    public static create<T>(initArray?: T[], pKey = 'id') {
        const arr = new ArrayValueMap<T>();
        arr[primaryKey] = pKey
        if (Array.isArray(initArray)) { 
            arr.setValues(initArray); 
        }
        return arr;
    }

    public [primaryKey]: string;
    public valueMap: Record<string | number, T> = {};
    
    public setValues(arr: T[]) {
        arr.forEach(i => this.add(i));
    }

    public add(item: T) {
        this.push(item);
        const key = (item as unknown as any)[this[primaryKey]];
        this.valueMap[key] = item;
    }

    public remove(pKey: string | number) {
        const idx = this.findIndex(x => (x as any)[this[primaryKey]] === pKey);
        this.splice(idx, 1);
        delete this.valueMap[pKey];
    }

    public filter(cb: (item: T, idx: number, valami: T[]) => boolean): IArrayValueMap<T> {
        return ArrayValueMap.create<T>(super.filter(cb), this[primaryKey]);
    }
}
