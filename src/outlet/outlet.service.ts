import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Outlet } from '../database/entities/Outlet';
import { OutletDto } from './outlet.dto';
import { wrap } from 'mikro-orm';
import { ListDto, ListResultDto } from '../list.dto';
import { plainToClass } from 'class-transformer';
import { getPrimitiveFromOpenhabState, OpenhabState } from './outlet.openhab.enum';
import { NativeSwitchService } from '../native-switch/native-switch.service';

@Injectable()
export class OutletService {
    constructor(private readonly db: DatabaseService, private readonly nativeSwitchService: NativeSwitchService,) {}

    public async create(outletDto: OutletDto): Promise<Outlet> {
        const outlet = plainToClass(Outlet, outletDto);
        await this.db.getEm().persistAndFlush(outlet);
        return outlet;
    }

    public async update(name: string, outletDto: OutletDto): Promise<Outlet> {
        const outlet = await this.db.getEm().findOneOrFail(Outlet, { name });
        wrap(outlet).assign({ ...outletDto, name: outlet.name }, { mergeObjects: true, onlyProperties: true });
        await this.db.getEm().persistAndFlush(outlet);
        return outlet;
    }

    public async setValue(name: string, value: boolean) {
        const outlet = await this.db.getEm().findOneOrFail(Outlet, { name });
        outlet.value = value;
        await this.db.getEm().flush();
    }

    public async delete(name: string) {
        await this.db.getEm().remove(Outlet, { name }, true);
    }

    public async get(name: string): Promise<Outlet> {
        return this.db.getEm().findOneOrFail(Outlet, { name });
    }

    public async list(
        listDto: ListDto = new ListDto(),
    ): Promise<ListResultDto<Outlet>> {
        const multi = listDto.page - 1;
        const offset = multi * listDto.count;
        const [entities, count] = await this.db
            .getEm()
            .findAndCount(Outlet, {}, { limit: listDto.count, offset });

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
