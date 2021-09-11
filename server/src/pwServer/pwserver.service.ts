import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ping } from 'src/common/helpers/ping';
import { IServer } from 'src/configs/core';
import { Config, ServerStatus } from './interfaces/serverStatus';

@Injectable()
export class PwServerService {
    private statuses: ServerStatus[] = [];
    private statusTimerId: NodeJS.Timeout;
    private cache = new Map<string, any>();
    private staticData: string[] = [
        'elf', 'classes', 'item_db', 'item_extra',
        'pet', 'skills_text',
    ];

    constructor(
        private configService: ConfigService
    ) {
        this.updateStatuses = this.updateStatuses.bind(this);
        this.startStatusMonitoring();
        setTimeout(() => this.loadStaticData(), 1000);
    }

    private loadStaticData() {
        this.staticData.forEach(name => {
            import (`../data/${name}.json`)
                .then(data => {
                    if (data && typeof data === 'object' && data.default) { data = data.default; };
                    this.cache.set(name, data);
                });
        });
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
            const servers: [string, IServer][] = Object.entries(this.configService.get('servers'));
            const statuses = await Promise.all(servers.map(([, serverData]) => ping(serverData.services.glinkd)));
            this.statuses = statuses.map((status, idx) => ({
                // id: servers[idx][0],
                name: servers[idx][1].name,
                timeZone: servers[idx][1].timezone,
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
                content: this.configService.get('SERVER_NAME')
            },
            {
                id: 'staticData',
                type: 'json',
                content: JSON.stringify([
                    'elf', 'classes', 'item_db',
                    'item_extra', 'pet', 'skills_text',
                ])
            }
        );
        return configs;
    }

    public getStaticData(name: string): Promise<any> { 
        return this.cache.get(name);
    }
}
