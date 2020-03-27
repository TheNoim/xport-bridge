import { Module } from '@nestjs/common';
import { RollershutterService } from './rollershutter.service';
import { DatabaseModule } from '../database/database.module';
import { NativeSwitchModule } from '../native-switch/native-switch.module';
import { RollershutterController } from './rollershutter.controller';
import { RollershutterOpenhabService } from './rollershutter.openhab.service';
import { RollershutterOpenhabController } from './rollershutter.openhab.controller';

@Module({
    providers: [RollershutterService, RollershutterOpenhabService],
    imports: [DatabaseModule, NativeSwitchModule],
    controllers: [RollershutterController, RollershutterOpenhabController],
})
export class RollershutterModule {}
