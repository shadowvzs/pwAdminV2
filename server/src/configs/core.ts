export interface IService {
    service : string;
    address : string;
    port    : number;
    timeout : number;
    attempts: number;
}

export interface IServer {
    name: string;
    address: string;
    timezone: 0; // compared with GMT
    services: Record<string, IService>;
}

export interface IConfig {
    servers: Record<string, IServer>;
}

export default (): IConfig => ({
    servers: {
        Wodan: {
            name: 'Wodan',
            address: '192.168.1.102:29000',
            timezone: 0,
            services: {
                glinkd: {
                    service : 'glinkd',
                    address : '192.168.1.102',
                    port    : 29000,
                    timeout : 1000,
                    attempts: 1
                }
            }
        }
    }
});

export const PORT = 4000;
