import {
    Body,
    Controller,
    Delete,
    Get,
    Param, Patch,
    Post,
    Put,
} from '@nestjs/common';
import { OutletDto, UpdateStateDto } from './outlet.dto';
import { OutletService } from './outlet.service';
import { ListDto } from '../list.dto';
import { Validation } from '../validation/pipe';

@Controller('outlet')
export class OutletController {
    constructor(private readonly outletService: OutletService) {}

    @Post()
    async create(@Body(Validation('create')) outletDto: OutletDto) {
        return await this.outletService.create(outletDto);
    }

    @Patch(':name')
    async update(
        @Body(Validation('update')) outletDto: OutletDto,
        @Param('name') name: string,
    ) {
        return await this.outletService.update(name, outletDto);
    }

    @Delete(':name')
    async delete(@Param('name') name: string) {
        return await this.outletService.delete(name);
    }

    @Get(':name')
    async get(@Param('name') name: string) {
        return await this.outletService.get(name);
    }

    @Post("updateState/:name")
    async updateState(@Param('name') name: string, @Body() payload: UpdateStateDto) {
        return await this.outletService.setValueForOutlet(name, payload.value);
    }

    @Get()
    async list() {
        return await this.outletService.list();
    }

    @Put()
    async listPost(@Body(Validation()) listDto: ListDto) {
        return await this.outletService.list(listDto);
    }
}
