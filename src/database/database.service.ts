import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import { EntityManager, MikroORM } from 'mikro-orm';
import DatabaseConfig from './database-config';

@Injectable()
export class DatabaseService implements OnModuleInit {
    private orm: MikroORM;
    private logger: Logger = new Logger('DatabaseService');

    async onModuleInit(): Promise<void> {
        this.logger.log('Initialize Database...');
        this.orm = await MikroORM.init(DatabaseConfig);
        await this.orm.getSchemaGenerator().ensureDatabase();
        await this.orm.getEntityGenerator().generate();
        await this.orm.getSchemaGenerator().updateSchema();
        this.logger.log('Database initialized successfully.');
    }

    public getEm(): EntityManager {
        return this.orm.em;
    }

    public getOrm(): MikroORM {
        return this.orm;
    }
}
