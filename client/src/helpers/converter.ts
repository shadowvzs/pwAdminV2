export class Converter {

    public toInt8 = (n: number): string => {
        return n.toString(16).padStart(2, '0').substr(0, 2);
    }

    public toInt16 = (n: number): string => {
        const result = n.toString(16).padStart(4, '0').substr(0, 4);
        return result;
    }

    public toInt32 = (n: number): string => {
        const result = n.toString(16).padStart(8, '0').substr(0, 8);
        return result;
    }

    public toAddon(id: number, modifier: number): string {
        if (id === 0) { throw new Error('invalid addon id'); }
        const str = modifier.toString(16) + id.toString(16);
        return this.byteReverse(str.padStart(8, '0'));
    }

    public toFloatLE = (n: number): string => {
        const buf = new ArrayBuffer(4);
        const dv  = new DataView(buf);
        dv.setFloat32(0, n, true);
        return dv.getUint32(0).toString(16).padStart(8, "0");
    }

    public toInt16LE = (n: number): string => {
        const result = this.toInt16(n);
        return this.byteReverse(result);
    }

    public toInt32LE = (n: number): string => {
        const result = this.toInt32(n);
        return this.byteReverse(result);
    }

    // public toFloatLE = (n: number): string => {
    //     const result = this.toFloat(n);
    //     return this.byteReverse(result);
    // }

    public toText = (text: string, withoutLength?: boolean): string => {
        if (!text) {
            if (!withoutLength) { return '00'; }
            return '';
        }
        const result = [...text].map(x => this.toInt16LE(x.charCodeAt(0))).join('');
        if (withoutLength) { return result; }
        return this.toInt8([...text].length * 2) + result;
    }

    public fromInt8 = (value: string): number => {
        return parseInt(value, 16);
    }

    public fromInt16 = (value: string): number => {
        return parseInt(value, 16);
    }

    public fromInt32 = (value: string): number => {
        return parseInt(value, 16);
    }

    public fromInt16LE = (value: string): number => {
        value = this.byteReverse(value);
        return this.fromInt16(value);
    }

    public fromInt32LE = (value: string): number => {
        value = this.byteReverse(value);
        return this.fromInt32(value);
    }

    public fromText = (str: string): string => {
        const result: string[] = [];
        const len = this.fromInt8(str.substr(0, 2));
        if (len) { return ''; }
        // str = str.substr(0, 2);
        
        for (let i = 0; i < len; i++) {
            const char = str.substr(i * 4 + 2, 4);
            result.push(String.fromCharCode(this.fromInt16(char)));
        }
        return result.join('');
    }

    public fromFloat = (str: string): number => {
        if (!str.startsWith('0x')) { str = '0x' + str; }
        let float = 0;
        let int = 0;
        let multi = 1;
        if (/^0x/.exec(str)) {
            int = parseInt(str, 16);
        } else {
            for (let i = str.length -1; i >=0; i -= 1) {
                if (str.charCodeAt(i)>255) {
                    console.warn('Wrong string parameter'); 
                    return 0;
                }
                int += str.charCodeAt(i) * multi;
                multi *= 256;
            }
        }
        const sign = (int >>> 31) ? -1 : 1;
        let exp = ((int >>> 23) & 0xff) - 127;
        const mantissa = ((int & 0x7fffff) + 0x800000).toString(2);
        for (let i = 0; i < mantissa.length; i++){
            float += parseInt(mantissa[i]) ? Math.pow(2, exp) : 0;
            exp--;
        }
        const result = float * sign;
        // fix the floatpoint numbers, make it with 2 digit accurancy
        return (Math.round(result * 100)) / 100;
    }

    public fromFloatLE = (str: string): number => {
        str = this.byteReverse(str);
        return this.fromFloat(str);
    }

    public fromAddon(str: string, valueLen: number): number[] {
        console.log(str, valueLen)
        if (!str || str.length !== (8 + valueLen * 8)) { throw new Error('invalid addon string'); }
        const int32AddonId = this.byteReverse(str.substr(0, 8)).replace(/^0+/, '').substr(1);
        console.log(int32AddonId)
        const result: number[] = [parseInt(int32AddonId, 16)];
        for (let i = 0; i < valueLen; i++) {
            console.log(str.substr((i + 1) * 8, 8))
            result.push(this.fromInt32LE(str.substr((i + 1) * 8, 8)));
        }
        return result;
    }

    public getAddonType(str: string): number {
        return parseInt(this.byteReverse(str.substr(0, 8)).replace(/^0+/, '')[0], 16);
    }

    public fromArray(str: string, len: number): number[] {
        const countStr = str.substr(0, len);
        const methodName = `fromInt${len*4}LE` as 'fromInt32LE';
        const count = this[methodName](countStr);
        const arr: number[] = new Array<number>(count);
        for (let i = 0; i < count; i++) {
            arr[i] = this[methodName](str.substr((i + 1) * len, 8));
        }
        return arr;
    }

    private byteReverse = (v: string): string => {
        return v
            .match(/.{1,2}/g)!
            .map(x => x.padStart(2, '0'))
            .reverse()
            .join('');
    }
}