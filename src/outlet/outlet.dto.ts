import {
    IsBoolean,
    IsIn,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { Channels } from '../xport.enum';

export class OutletDto {
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

    @IsOptional({ groups: ['update', 'create'] })
    @IsNumber({}, { always: true })
    @IsIn([1, 2, 3, 4], { always: true })
    nativeChannel2?: Channels;

    @IsOptional({ always: true })
    @IsBoolean({ always: true })
    multiChannel?: boolean;

    @IsOptional({ always: true })
    @IsString({ always: true })
    homeAssistantType?: string;
}

export class UpdateStateDto {
    @IsBoolean()
    value: boolean;
}
