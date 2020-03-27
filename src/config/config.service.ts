import { Injectable } from '@nestjs/common';
import config from 'config';

@Injectable()
export class ConfigService {
    public getXportIP(): string {
        return config.get('xport.ip') as string;
    }

    public getXportPort(): number {
        return config.get('xport.port') as number;
    }
}
