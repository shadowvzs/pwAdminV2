import { Injectable } from '@nestjs/common';
import { ping } from 'src/common/helpers/ping';
import { CONFIGS } from 'src/core/configs/core';
import { Config, ServerStatus } from './interfaces/serverStatus';

@Injectable()
export class PwServerUtilityService {
    private statuses: ServerStatus[] = [];
    private statusTimerId: NodeJS.Timeout;

    constructor() {
        this.updateStatuses = this.updateStatuses.bind(this);
        this.startStatusMonitoring();
    }

    public startStatusMonitoring(): void {
        this.stopStatusMonitoring();
        this.updateStatuses();
        this.statusTimerId = setInterval(this.updateStatuses,  3000);
    }

    public stopStatusMonitoring(): void {
        if (this.statusTimerId) {
          clearInterval(this.statusTimerId);
        }
    }

    public async updateStatuses(): Promise<void> {
        try {
            const servers = Object.entries(CONFIGS.SERVERS);
            const statuses = await Promise.all(servers.map(([, serverData]) => ping(serverData.SERVICES.GLINKD)));
            this.statuses = statuses.map((status, idx) => ({
                // id: servers[idx][0],
                name: servers[idx][1].NAME,
                timeZone: servers[idx][1].TIMEZONE,
                status
            } as ServerStatus))
        } catch (err) {
            console.log('failed to ping the server');
        }
    }

    public getStatuses(): ServerStatus[] { 
        return this.statuses; 
    }

    public getConfigs(): Config[] { 
        const configs: Config[] = [];
        configs.push(
            {
                id: 'serverName',
                content: CONFIGS.NAME
            }
        );
        return configs;
    }
}
