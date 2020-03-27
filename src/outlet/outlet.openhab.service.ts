import {Injectable, Logger} from '@nestjs/common';
import { NativeSwitchService } from '../native-switch/native-switch.service';
import { OutletService } from './outlet.service';
import { Outlet } from '../database/entities/Outlet';
import {getOpenhabStateFromPrimitive, getPrimitiveFromOpenhabState, OpenhabState} from "./outlet.openhab.enum";

@Injectable()
export class OutletOpenhabService {
    private logger: Logger = new Logger('OutletOpenhabService');

    constructor(
        private readonly nativeSwitchService: NativeSwitchService,
        private readonly outletService: OutletService,
    ) {}

    public async setValueForOutlet(
        name: string,
        state: OpenhabState,
    ): Promise<Outlet> {
        const outlet = await this.outletService.get(name);
        const value = getPrimitiveFromOpenhabState(state);
        const nativeValue = value ? 1 : 0;
        await this.nativeSwitchService.setValueForAddress(
            outlet.nativeAddress,
            outlet.nativeChannel,
            nativeValue,
        );
        await this.nativeSwitchService.commitAddress(outlet.nativeAddress);
        await this.outletService.setValue(name, value);
        return outlet;
    }

    public async getValueForOutlet(name: string): Promise<OpenhabState> {
        const { value } = await this.outletService.get(name);
        return getOpenhabStateFromPrimitive(value);
    }
}
