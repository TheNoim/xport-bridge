import {
    IsBoolean,
    IsIn,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { RollershutterOpenhabEnum } from './rollershutter.openhab.enum';
import { Channels } from '../xport.enum';

export class RollershutterDto {
    @IsOptional({ groups: ['update'] })
    @IsString({ groups: ['create'] })
    name?: string;

    @IsOptional({ always: true })
    @IsString({ always: true })
    description?: string;

    @IsOptional({ groups: ['update'] })
    @IsNumber({}, { always: true })
    nativeAddress?: number;

    @IsOptional({ groups: ['update'] })
    @IsNumber({}, { always: true })
    @IsIn([1, 2, 3, 4], { always: true })
    nativeChannel?: Channels;

    @IsOptional({ always: true })
    @IsBoolean({ always: true })
    supportsHalf?: boolean;

    @IsOptional({ groups: ['update'] })
    @IsNumber({}, { always: true })
    timeToOpen?: number;
}

export class DoRollershutterDto {
    @IsString()
    @IsIn([
        RollershutterOpenhabEnum.STOP,
        RollershutterOpenhabEnum.UP,
        RollershutterOpenhabEnum.DOWN,
    ])
    value: RollershutterOpenhabEnum;
}
