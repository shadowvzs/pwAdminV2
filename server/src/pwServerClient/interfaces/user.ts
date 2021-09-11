import { Autolock, ExpLog, Forbidden } from "./common";

export interface IUserInfo {
    role_id: number;
    logicuid: number;
    cash: number;
    money: number;
    cash_add: number; // user shop gold
    cash_buy: number;
    cash_sell: number;
    cash_used: number;  
    add_serial: number; // 2
    use_serial: number; // 0
    exp_log: ExpLog[];
    addiction: string;
    cash_password: string;
    autolock: Autolock[];
    status: number;
    forbidden: Forbidden;
    reference: string; // octet, not decoded
    consume_reward: string;
    task_counter: string;
    cash_sysauction: string;
    login_record: string;
    mall_consumption: string;
}