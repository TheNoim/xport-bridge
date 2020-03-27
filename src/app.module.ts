import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { NativeSwitchModule } from './native-switch/native-switch.module';
import { OutletModule } from './outlet/outlet.module';
import { ConfigModule } from './config/config.module';
import { RollershutterModule } from './rollershutter/rollershutter.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
    imports: [
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
