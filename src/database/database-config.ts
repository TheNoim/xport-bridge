import { MikroORMOptions } from '@mikro-orm/core';

export default {
    entities: ['./dist/database/entities'],
    entitiesTs: ['./src/database/entities'],
    dbName: 'xport-bridge.sqlite3',
    type: 'sqlite',
    debug: true,
    cache: {
        enabled: true,
    },
} as MikroORMOptions;
