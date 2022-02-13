import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Outlet } from '../database/entities/Outlet';
import { OutletDto } from './outlet.dto';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { ListDto, ListResultDto } from '../list.dto';
import { plainToClass } from 'class-transformer';
import { NativeSwitchService } from '../native-switch/native-switch.service';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
export class OutletService {
    constructor(
        private readonly db: DatabaseService,
        private readonly nativeSwitchService: NativeSwitchService,
        @InjectRepository(Outlet)
        private readonly outletRepository: EntityRepository<Outlet>,
    ) {}

    public async create(outletDto: OutletDto): Promise<Outlet> {
        const outlet = plainToClass(Outlet, outletDto);
        await this.outletRepository.persistAndFlush(outlet);
        return outlet;
    }

    public async update(name: string, outletDto: OutletDto): Promise<Outlet> {
        const outlet = await this.outletRepository.findOneOrFail({ name });
        wrap(outlet).assign(
            { ...outletDto, name: outlet.name },
            { mergeObjects: true, onlyProperties: true },
        );
        await this.outletRepository.flush();
        return outlet;
    }

    public async setValue(name: string, value: boolean) {
        const outlet = await this.outletRepository.findOneOrFail({ name });
        outlet.value = value;
        await this.outletRepository.flush();
    }

    public async delete(name: string) {
        await this.outletRepository.remove({ name });
        await this.outletRepository.flush();
    }

    public async get(name: string): Promise<Outlet> {
        return this.outletRepository.findOneOrFail({ name });
    }

    public async list(
        listDto: ListDto = new ListDto(),
    ): Promise<ListResultDto<Outlet>> {
        const multi = listDto.page - 1;
        const offset = multi * listDto.count;
        const [entities, count] = await this.outletRepository.findAndCount(
            {},
            { limit: listDto.count, offset },
        );

        return {
            allEntities: count,
            entities,
            page: listDto.page,
        };
    }

    public async setValueForOutlet(
        name: string,
        value: boolean,
    ): Promise<Outlet> {
        const outlet = await this.get(name);
        const nativeValue = value ? 1 : 0;
        await this.setValue(name, value);
        await this.nativeSwitchService.setValueForAddress(
            outlet.nativeAddress,
            outlet.nativeChannel,
            nativeValue,
        );
        if (outlet.multiChannel && outlet.nativeChannel2) {
            await this.nativeSwitchService.setValueForAddress(
                outlet.nativeAddress,
                outlet.nativeChannel2,
                nativeValue,
            );
        }
        await this.nativeSwitchService.commitAddress(outlet.nativeAddress);
        return outlet;
    }
}
