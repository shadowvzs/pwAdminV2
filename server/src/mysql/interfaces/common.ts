export type Operator = '=' | '<' | '>' | '>=' | '<=';
export type SQLBindValue = string | number;
export type SQLCondition = [value: SQLBindValue, field?: string, operator?: Operator];
