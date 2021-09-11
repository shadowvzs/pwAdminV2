import { IService } from 'src/configs/core';
import tcpp from 'tcp-ping';

export const ping = (options: IService): Promise<any> => new Promise (( resolve )=> tcpp.ping(options, ( err, data)=> resolve(!data.results[0].err)));
