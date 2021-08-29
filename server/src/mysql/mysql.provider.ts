import { Injectable } from '@nestjs/common';
import mysql from 'mysql2/promise';
import { SQLBindValue, SQLCondition } from './interfaces/common';

@Injectable()
export class MySQLProvider {
    private config = { 
        host: 'localhost',
        // port: 30006,
        user: 'newuser',
        password: 'passworD1!',
        database: 'pw'
    };

    public connection: mysql.Pool;
    public isActive: boolean;

    constructor() {
        this.connect();
    }

    public connect(): mysql.Pool {
        this.isActive = true;
        this.connection = mysql.createPool(this.config);
        return this.connection;
    }

    public async findOne<T = any>(sql: string, args?: (number | string)[]): Promise<T> { 
        const result = await this.query<T>(sql, args);
        return result[0][0];
    }

    public async query<T = any>(sql: string, args?: (number | string)[]): Promise<T> { 
        const result = await this.connection.query(sql, args);
        return result as any;
    }

    public async execute<T = any>(sql: string, args?: (number | string)[]): Promise<T> { 
        const result = await this.connection.execute(sql, args);
        return result as any;
    }

    public async update<T>(table: string, fields: Record<string, SQLBindValue>, conditions?: SQLCondition[]): Promise<boolean> {
        const [valueStrArr, valueParams] = this.getPreparedFields(fields);
        const [conditionStr, conditionParams] = this.getPreparedConditions(conditions);
        const params = [...valueParams, ...conditionParams];
        const query = await this.query<T>(`UPDATE ${table} SET ${valueStrArr.join(',')} WHERE ${conditionStr}`, params)[0];
        return query?.affectedRows > 0;
    }

    private getPreparedFields(fields: Record<string, SQLBindValue>): [string[], SQLBindValue[]] {
        if (!fields || Object.keys(fields).length === 0) { return [[] as string[], [] as SQLBindValue[]]; }
        const fieldStr: string[] = [];
        const fieldVal: SQLBindValue[] = []
        Object.entries(fields).forEach(([k, v]) => {
            fieldStr.push(k+'=?');
            fieldVal.push(v);
        });
        return [fieldStr, fieldVal];
    }

    public async delete<T>(table: string, conditions?: SQLCondition[]): Promise<T[]> {
        const [conditionStr, conditionParams] = this.getPreparedConditions(conditions);
        const query = (await this.execute<T>(`DELETE FROM ${table} WHERE ${conditionStr}`, conditionParams))[0];
        return query as T[];
    }

    public async select<T>(table: string, fields?: string| string[], conditions?: SQLCondition[]): Promise<T[]> {
        const fieldsStr = fields ? (Array.isArray(fields) ? fields.join(',') : fields) : '*';
        const [conditionStr, conditionParams] = this.getPreparedConditions(conditions);
        const query = (await this.execute<T>(`SELECT ${fieldsStr} FROM \`${table}\` WHERE ${conditionStr}`, conditionParams))[0];
        return query as T[];
    }

    private getPreparedConditions(conditions: SQLCondition[]): [string, SQLBindValue[]] {
        if (!conditions || conditions.length === 0) { return ['1', [] as SQLBindValue[]]; }
        const conditionStr: string[] = [];
        const conditionVal: SQLBindValue[] = []
        conditions.forEach(c => {
            if (c.length === 1) { c.unshift('id'); }
            if (c.length === 2) { c.push('='); }
            const [field, value, operator] = c;
            conditionStr.push(field+operator+'?');
            conditionVal.push(value);
        });
        
        return [conditionStr.join(' AND '), conditionVal];
    }

    public disconnect(): void {
        this.isActive = false;
        this.connection.end();
    }    
}
