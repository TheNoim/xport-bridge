import {Injectable} from '@nestjs/common';
import {RollershutterState} from '../database/entities/Rollershutter';
import {RollershutterService} from './rollershutter.service';
import {NativeSwitchService} from '../native-switch/native-switch.service';
import {RollershutterOpenhabEnum} from './rollershutter.openhab.enum';

export enum RollershutterDirections {
    UP,
    DOWN,
}

@Injectable()
export class RollershutterOpenhabService {
    constructor(
        private readonly rollershutterService: RollershutterService,
        private readonly nativeSwitchService: NativeSwitchService,
    ) {}

    public async setStateForRollershutter(
        name: string,
        state: RollershutterOpenhabEnum,
    ) {
        const rollershutter = await this.rollershutterService.get(name);
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

            await this.rollershutterService.setValue(name, newState);
            await this.nativeSwitchService.commitAddress(address);
        } else {
            if (state === RollershutterOpenhabEnum.UP) {
                await this.rollershutterService.setValue(name, RollershutterState.UP);
                await this.nativeSwitchService.setValueForAddress(
                    address,
                    directionChannel,
                    RollershutterDirections.UP,
                );
                await this.nativeSwitchService.commitAddress(address);
            } else if (state === RollershutterOpenhabEnum.DOWN) {
                await this.rollershutterService.setValue(name, RollershutterState.DOWN);
                await this.nativeSwitchService.setValueForAddress(
                    address,
                    directionChannel,
                    RollershutterDirections.DOWN,
                );
                await this.nativeSwitchService.commitAddress(address);
            } else {
                await this.rollershutterService.setValue(name, RollershutterState.STOP);
            }
        }

        return rollershutter;
    }

    public async getStateForRollershutter(name: string) {
        const rollershutter = await this.rollershutterService.get(name);
        if (rollershutter.state === RollershutterState.UP) {
            return RollershutterOpenhabEnum.UP;
        } else if (rollershutter.state === RollershutterState.DOWN) {
            return RollershutterOpenhabEnum.DOWN;
        } else {
            return RollershutterOpenhabEnum.STOP;
        }
    }
}
