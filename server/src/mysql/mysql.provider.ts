import { Injectable } from '@nestjs/common';
import mysql from 'mysql2/promise';

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

    public disconnect(): void {
        this.isActive = false;
        this.connection.end();
    }    
}
