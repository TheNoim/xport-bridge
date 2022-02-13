import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';

@Injectable()
export class DatabaseService implements OnModuleInit {
    constructor(private readonly orm: MikroORM) {
    }

    private logger: Logger = new Logger('DatabaseService');

    async onModuleInit(): Promise<void> {
        this.logger.log('Initialize Database...');
        await this.orm.getSchemaGenerator().ensureDatabase();
        await this.orm.getEntityGenerator().generate();
        await this.orm.getSchemaGenerator().updateSchema();
        this.logger.log('Database initialized successfully.');
    }
}
