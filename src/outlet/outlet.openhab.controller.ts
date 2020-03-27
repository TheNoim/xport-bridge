import {
    BadRequestException,
    Controller,
    Get,
    Param,
    Post,
} from '@nestjs/common';
import { OpenhabState } from './outlet.openhab.enum';
import { OutletOpenhabService } from './outlet.openhab.service';

@Controller('openhab/outlet')
export class OutletOpenhabController {
    constructor(private readonly outletOpenhabService: OutletOpenhabService) {}

    @Post(':name/:value')
    async setOutlet(
        @Param('name') name: string,
        @Param('value') value: string,
    ) {
        if (value === OpenhabState.ON || value === OpenhabState.OFF) {
            return await this.outletOpenhabService.setValueForOutlet(
                name,
                value,
            );
        } else {
            throw new BadRequestException(`Invalid value (${value})`);
        }
    }

    @Get(':name')
    async getValue(@Param('name') name: string) {
        return await this.outletOpenhabService.getValueForOutlet(name);
    }
}
