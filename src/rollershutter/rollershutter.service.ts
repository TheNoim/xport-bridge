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
import { NativeSwitchService } from '../native-switch/native-switch.service';
import { RollershutterOpenhabEnum } from './rollershutter.openhab.enum';
import { RollershutterDirections } from './rollershutter.openhab.service';

@Injectable()
export class RollershutterService {
    constructor(
        private readonly db: DatabaseService,
        private readonly nativeSwitchService: NativeSwitchService,
    ) {}

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

    public async setStateForRollershutter(
        name: string,
        state: RollershutterOpenhabEnum,
    ) {
        const rollershutter = await this.get(name);
        const address = rollershutter.nativeAddress;
        const directionChannel = rollershutter.nativeChannel === 1 ? 1 : 3;
        const controlChannel = rollershutter.nativeChannel === 1 ? 2 : 4;

        if (rollershutter.supportsHalf) {
            if (
                state === RollershutterOpenhabEnum.DOWN &&
                rollershutter.state !== RollershutterState.DOWN
            ) {
                await this.nativeSwitchService.setValueForAddress(
                    address,
                    directionChannel,
                    RollershutterDirections.DOWN,
                );
                await this.nativeSwitchService.setValueForAddress(
                    address,
                    controlChannel,
                    1,
                );
            } else if (
                state === RollershutterOpenhabEnum.UP &&
                rollershutter.state !== RollershutterState.UP
            ) {
                await this.nativeSwitchService.setValueForAddress(
                    address,
                    directionChannel,
                    RollershutterDirections.UP,
                );
                await this.nativeSwitchService.setValueForAddress(
                    address,
                    controlChannel,
                    1,
                );
            } else {
                await this.nativeSwitchService.setValueForAddress(
                    address,
                    controlChannel,
                    0,
                );
            }

            const newState =
                state === RollershutterOpenhabEnum.DOWN
                    ? RollershutterState.DOWN
                    : state === RollershutterOpenhabEnum.UP
                    ? RollershutterState.UP
                    : RollershutterState.STOP;

            await this.setValue(name, newState);
            await this.nativeSwitchService.commitAddress(address);
        } else {
            if (state === RollershutterOpenhabEnum.UP) {
                await this.setValue(
                    name,
                    RollershutterState.UP,
                );
                await this.nativeSwitchService.setValueForAddress(
                    address,
                    directionChannel,
                    RollershutterDirections.UP,
                );
                await this.nativeSwitchService.commitAddress(address);
            } else if (state === RollershutterOpenhabEnum.DOWN) {
                await this.setValue(
                    name,
                    RollershutterState.DOWN,
                );
                await this.nativeSwitchService.setValueForAddress(
                    address,
                    directionChannel,
                    RollershutterDirections.DOWN,
                );
                await this.nativeSwitchService.commitAddress(address);
            } else {
                await this.setValue(
                    name,
                    RollershutterState.STOP,
                );
            }
        }

        return rollershutter;
    }
}
