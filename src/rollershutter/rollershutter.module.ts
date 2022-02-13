import { Module } from '@nestjs/common';
import { RollershutterService } from './rollershutter.service';
import { DatabaseModule } from '../database/database.module';
import { NativeSwitchModule } from '../native-switch/native-switch.module';
import { RollershutterController } from './rollershutter.controller';
import { RollershutterOpenhabService } from './rollershutter.openhab.service';
import { RollershutterOpenhabController } from './rollershutter.openhab.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Rollershutter } from '../database/entities/Rollershutter';

@Module({
    providers: [RollershutterService, RollershutterOpenhabService],
    imports: [MikroOrmModule.forFeature([Rollershutter]), DatabaseModule, NativeSwitchModule],
    controllers: [RollershutterController, RollershutterOpenhabController],
})
export class RollershutterModule {}
