import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { NativeSwitchModule } from './native-switch/native-switch.module';
import { OutletModule } from './outlet/outlet.module';
import { ConfigModule } from './config/config.module';
import { RollershutterModule } from './rollershutter/rollershutter.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import DatabaseConfig from './database/database-config';

@Module({
    imports: [
        MikroOrmModule.forRoot(DatabaseConfig),
        DatabaseModule,
        NativeSwitchModule,
        OutletModule,
        ConfigModule,
        RollershutterModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'nuxt-static'),
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
