import { Module } from '@nestjs/common';
import { NativeSwitchService } from './native-switch.service';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '../config/config.module';

@Module({
    providers: [NativeSwitchService],
    imports: [ConfigModule, DatabaseModule],
    exports: [NativeSwitchService]
})
export class NativeSwitchModule {}
