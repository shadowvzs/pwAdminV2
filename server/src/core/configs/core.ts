export const CONFIGS = {
    NAME: 'Perfect World RetroMs',
    PORT: 4000,
    SERVERS: {
        WODAN: {
            NAME: 'Wodan',
            ADDRESS: '192.168.1.101:29000',
            TIMEZONE: 0,
            SERVICES: {
                GLINKD: {
                    service : 'glinkd',
                    address : '192.168.1.101',
                    port    : 29000,
                    timeout : 1000,
                    attempts: 1
                }
            }
        }
    },
}
