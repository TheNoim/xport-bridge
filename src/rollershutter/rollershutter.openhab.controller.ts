import {
    BadRequestException,
    Controller,
    Get,
    Param,
    Post,
} from '@nestjs/common';
import { RollershutterOpenhabService } from './rollershutter.openhab.service';
import { RollershutterOpenhabEnum } from './rollershutter.openhab.enum';

@Controller('openhab/rollershutter')
export class RollershutterOpenhabController {
    constructor(
        private readonly rollershutterOpenhabService: RollershutterOpenhabService,
    ) {}

    @Post(':name/:value')
    async setOutlet(
        @Param('value') value: RollershutterOpenhabEnum,
        @Param('name') name: string,
    ) {
        if (
            [
                RollershutterOpenhabEnum.STOP,
                RollershutterOpenhabEnum.UP,
                RollershutterOpenhabEnum.DOWN,
            ].indexOf(value) > -1
        ) {
            return await this.rollershutterOpenhabService.setStateForRollershutter(
                name,
                value,
            );
        } else {
            throw new BadRequestException(`Invalid value (${value})`);
        }
    }

    @Get(':name')
    async getValue(@Param('name') name: string) {
        return await this.rollershutterOpenhabService.getStateForRollershutter(
            name,
        );
    }
}
