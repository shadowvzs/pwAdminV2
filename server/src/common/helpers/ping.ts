import tcpp from 'tcp-ping';

export const ping = (services) => new Promise (( resolve )=> tcpp.ping(services, ( err, data)=> resolve(!data.results[0].err)));
