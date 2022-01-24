import {MikroORMOptions} from "mikro-orm";

export default {
    entitiesDirs: ['./dist/database/entities'],
    entitiesDirsTs: ['./src/database/entities'],
    dbName: 'xport-bridge.sqlite3',
    type: 'sqlite',
    debug: true,
} as MikroORMOptions;
