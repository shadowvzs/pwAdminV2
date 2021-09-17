export class Converter {

    toInt8(n: number): string {
        return n.toString(16).padStart(2, '0').substr(0, 2);
    }

    toInt16(n: number, littleEndian?: boolean): string {
        let result = n.toString(16).padStart(4, '0').substr(0, 4);
        if (littleEndian) {
            result = result.match(/.{1,2}/g)!.map(x => x.padStart(2, '0')).reverse().join('');
        }
        return result;
    }

    toInt32(n: number, littleEndian?: boolean): string {
        let result = n.toString(16).padStart(8, '0').substr(0, 8);
        if (littleEndian) {
            result = result.match(/.{1,2}/g)!.map(x => x.padStart(2, '0')).reverse().join('');
        }
        return result;
    }

    toHexText(text: string, withoutLength?: boolean): string {
        const result = [...text].map(x => this.toInt16(x.charCodeAt(0))).join('');
        if (withoutLength) { return result; }
        return this.toInt8([...text].length * 2) + result;
    }

    fromInt8(value: string): number {
        return parseInt(value, 16);
    }

    fromInt16(value: string, littleEndian?: boolean): number {
        if (littleEndian) { value = value.match(/.{1,2}/g)!.reverse().join(''); }
        return parseInt(value, 16);
    }

    fromInt32(value: string, littleEndian?: boolean): number {
        if (littleEndian) { value = value.match(/.{1,2}/g)!.reverse().join(''); }
        return parseInt(value, 16);
    }

    fromHexText(value: string, withoutLength?: boolean): string {
        if (value.length % 2 === 1) { value = '0' + value; }
        if (!withoutLength) { value = value.substr(2); }
        return value.match(/.{1,4}/g)!.map(x => String.fromCharCode(this.fromInt16(x))).join('');
    }
}