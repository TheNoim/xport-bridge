import {
    BadRequestException,
    Controller,
    Get,
    Post,
    Query,
} from '@nestjs/common';
import {RollershutterOpenhabService} from "./rollershutter.openhab.service";
import {RollershutterOpenhabEnum} from "./rollershutter.openhab.enum";

@Controller('openhab/rollershutter')
export class RollershutterOpenhabController {
    constructor(private readonly rollershutterOpenhabService: RollershutterOpenhabService) {}

    @Post()
    async setOutlet(
        @Query('value') value: RollershutterOpenhabEnum,
        @Query('name') name: string,
    ) {
        if ([RollershutterOpenhabEnum.STOP, RollershutterOpenhabEnum.UP, RollershutterOpenhabEnum.DOWN].indexOf(value) > -1) {
            return await this.rollershutterOpenhabService.setStateForRollershutter(
                name,
                value,
            );
        } else {
            throw new BadRequestException(`Invalid value (${value})`);
        }
    }

    @Get()
    async getValue(@Query('name') name: string) {
        return await this.rollershutterOpenhabService.getStateForRollershutter(name);
    }
}
