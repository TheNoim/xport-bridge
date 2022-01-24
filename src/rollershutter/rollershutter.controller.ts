import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
} from '@nestjs/common';
import { Validation } from '../validation/pipe';
import { ListDto } from '../list.dto';
import { RollershutterService } from './rollershutter.service';
import { DoRollershutterDto, RollershutterDto } from './rollershutter.dto';

@Controller('rollershutter')
export class RollershutterController {
    constructor(private readonly rollershutterService: RollershutterService) {}

    @Post()
    async create(
        @Body(Validation('create')) rollershutterDto: RollershutterDto,
    ) {
        return await this.rollershutterService.create(rollershutterDto);
    }

    @Patch(':name')
    async update(
        @Body(Validation('update')) rollershutterDto: RollershutterDto,
        @Param('name') name: string,
    ) {
        return await this.rollershutterService.update(name, rollershutterDto);
    }

    @Delete(':name')
    async delete(@Param('name') name: string) {
        return await this.rollershutterService.delete(name);
    }

    @Get(':name')
    async get(@Param('name') name: string) {
        return await this.rollershutterService.get(name);
    }

    @Post('do/:name')
    async do(@Param('name') name: string, @Body() payload: DoRollershutterDto) {
        return await this.rollershutterService.setStateForRollershutter(name, payload.value);
    }

    @Get()
    async list() {
        return await this.rollershutterService.list();
    }

    @Put()
    async listPost(@Body(Validation()) listDto: ListDto) {
        return await this.rollershutterService.list(listDto);
    }
}
