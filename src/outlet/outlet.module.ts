import { Module } from '@nestjs/common';
import { OutletService } from './outlet.service';
import { DatabaseModule } from '../database/database.module';
import { OutletController } from './outlet.controller';
import { OutletOpenhabService } from './outlet.openhab.service';
import { NativeSwitchModule } from '../native-switch/native-switch.module';
import { OutletOpenhabController } from './outlet.openhab.controller';

@Module({
    providers: [OutletService, OutletOpenhabService],
    imports: [DatabaseModule, NativeSwitchModule],
    controllers: [OutletController, OutletOpenhabController],
})
export class OutletModule {}
