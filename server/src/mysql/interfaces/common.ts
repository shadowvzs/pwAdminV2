export type Operator = '=' | '<' | '>' | '>=' | '<=';
export type SQLBindValue = string | number;
export type SQLCondition = [value: SQLBindValue] | [field: string, value: SQLBindValue, operator?: Operator];

export interface SQLCrendetials {
    host: string;
    port?: number;
    user: string;
    password: string;
    database: string;
}