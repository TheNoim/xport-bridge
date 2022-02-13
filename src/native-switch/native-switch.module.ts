import { Module } from '@nestjs/common';
import { NativeSwitchService } from './native-switch.service';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '../config/config.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NativeSwitch } from '../database/entities/NativeSwitch';

@Module({
    providers: [NativeSwitchService],
    imports: [
        MikroOrmModule.forFeature([NativeSwitch]),
        ConfigModule,
        DatabaseModule,
    ],
    exports: [NativeSwitchService],
})
export class NativeSwitchModule {}
