import { Module } from '@nestjs/common';
import { OutletService } from './outlet.service';
import { DatabaseModule } from '../database/database.module';
import { OutletController } from './outlet.controller';
import { OutletOpenhabService } from './outlet.openhab.service';
import { NativeSwitchModule } from '../native-switch/native-switch.module';
import { OutletOpenhabController } from './outlet.openhab.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Outlet } from '../database/entities/Outlet';

@Module({
    providers: [OutletService, OutletOpenhabService],
    imports: [MikroOrmModule.forFeature([Outlet]), DatabaseModule, NativeSwitchModule],
    controllers: [OutletController, OutletOpenhabController],
})
export class OutletModule {}
