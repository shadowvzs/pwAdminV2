export type ItemData = string;

export interface IMail {
    sysMsg: {
        tid: number;
        sender_id: number;
        sys_type: number;
        target_id: number;
        title: string;
        message: string;
        item_id: number;
        pos: number;
        count: number;
        max_count: number;
        octet: ItemData,
        proctype: number;
        expire: number;
        guid1: number;
        guid2: number;
        mask: number;
        gold: number;
    }
}
