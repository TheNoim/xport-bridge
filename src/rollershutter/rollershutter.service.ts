import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { plainToClass } from 'class-transformer';
import { wrap } from 'mikro-orm';
import { ListDto, ListResultDto } from '../list.dto';
import { RollershutterDto } from './rollershutter.dto';
import {
    Rollershutter,
    RollershutterState,
} from '../database/entities/Rollershutter';

@Injectable()
export class RollershutterService {
    constructor(private readonly db: DatabaseService) {}

    public async create(
        rollershutterDto: RollershutterDto,
    ): Promise<Rollershutter> {
        const rollershutter = plainToClass(Rollershutter, rollershutterDto);
        await this.db.getEm().persistAndFlush(rollershutter);
        return rollershutter;
    }

    public async update(
        name: string,
        rollershutterDto: RollershutterDto,
    ): Promise<Rollershutter> {
        const rollershutter = await this.db
            .getEm()
            .findOneOrFail(Rollershutter, { name });
        wrap(rollershutter).assign(
            { ...rollershutterDto, name: rollershutter.name },
            { mergeObjects: true, onlyProperties: true },
        );
        await this.db.getEm().persistAndFlush(rollershutter);
        return rollershutter;
    }

    public async setValue(name: string, state: RollershutterState) {
        const rollershutter = await this.db
            .getEm()
            .findOneOrFail(Rollershutter, { name });
        rollershutter.state = state;
        await this.db.getEm().flush();
    }

    public async delete(name: string) {
        await this.db.getEm().remove(Rollershutter, { name }, true);
    }

    public async get(name: string): Promise<Rollershutter> {
        return this.db.getEm().findOneOrFail(Rollershutter, { name });
    }

    public async list(
        listDto: ListDto = new ListDto(),
    ): Promise<ListResultDto<Rollershutter>> {
        const multi = listDto.page - 1;
        const offset = multi * listDto.count;
        const [entities, count] = await this.db
            .getEm()
            .findAndCount(Rollershutter, {}, { limit: listDto.count, offset });

        return {
            allEntities: count,
            entities,
            page: listDto.page,
        };
    }
}
