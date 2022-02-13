import { Injectable, Logger } from '@nestjs/common';
import { NativeSwitch } from '../database/entities/NativeSwitch';
import { Binary } from '../binary';
import spawn from 'cross-spawn-promise';
import { Queue } from '../decorators/p-queue';
import { ConfigService } from '../config/config.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

@Injectable()
export class NativeSwitchService {
    private logger: Logger = new Logger('NativeSwitchService');

    constructor(
        private readonly config: ConfigService,
        @InjectRepository(NativeSwitch)
        private readonly nativeSwitchRepository: EntityRepository<NativeSwitch>,
    ) {}

    @Queue('xport')
    public async commitAddress(address: number) {
        const state = await this.getAddressState(address);
        this.logger.verbose(`Commit Data ${state} to ${address}`);
        await spawn(
            process.execPath,
            [
                '../xport/xport.js',
                '-i',
                this.config.getXportIP(),
                '-p',
                this.config.getXportPort(),
                '-a',
                address,
                '-d',
                state,
            ],
            { stdio: 'inherit', cwd: __dirname },
        );
        this.logger.verbose(`Commit for ${address} finished successfully`);
    }

    /**
     * Get the overall data state for a specific address. You can send this to the xport.
     * @param address
     */
    public async getAddressState(address: number): Promise<number> {
        const channels = [1, 2, 3, 4].map(channel =>
            this.getValueForAddress(address, channel),
        );
        const values = await Promise.all(channels);
        const binary = new Binary(values as Array<1 | 0>);
        this.logger.verbose(
            JSON.stringify(values) + ' ' + binary.convertToString(),
        );
        return binary.getInteger();
    }

    /**
     * Get the current value for a native switch via address and channel
     * @param address
     * @param channel
     */
    public async getValueForAddress(
        address: number,
        channel: number,
    ): Promise<number> {
        let nativeSwitch = await this.nativeSwitchRepository.findOne({
            address,
            channel,
        });

        if (nativeSwitch) {
            return nativeSwitch.value;
        } else {
            nativeSwitch = new NativeSwitch(address, channel);
            await this.nativeSwitchRepository.persistAndFlush(nativeSwitch);
        }
        return 0;
    }

    /**
     * Set the value for a native switch with a certain address and channel
     * @param address
     * @param channel
     * @param value
     */
    public async setValueForAddress(
        address: number,
        channel: number,
        value: 0 | 1,
    ): Promise<void> {
        let nativeSwitch = await this.nativeSwitchRepository.findOne({
            address,
            channel,
        });

        if (nativeSwitch) {
            nativeSwitch.value = value;
            await this.nativeSwitchRepository.flush();
        } else {
            nativeSwitch = new NativeSwitch(address, channel);
            nativeSwitch.value = value;
            await this.nativeSwitchRepository.persistAndFlush(nativeSwitch);
        }
    }
}
