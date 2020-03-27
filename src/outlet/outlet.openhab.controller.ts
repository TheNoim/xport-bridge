import {
    BadRequestException,
    Controller,
    Get,
    Post,
    Query,
} from '@nestjs/common';
import { OpenhabState } from './outlet.openhab.enum';
import { OutletOpenhabService } from './outlet.openhab.service';

@Controller('openhab/outlet')
export class OutletOpenhabController {
    constructor(private readonly outletOpenhabService: OutletOpenhabService) {}

    @Post()
    async setOutlet(
        @Query('value') value: string,
        @Query('name') name: string,
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

    @Get()
    async getValue(@Query('name') name: string) {
        return await this.outletOpenhabService.getValueForOutlet(name);
    }
}
