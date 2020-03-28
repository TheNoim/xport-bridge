import { Entity, PrimaryKey, PrimaryKeyType, Property } from 'mikro-orm';
import { Channels } from '../../xport.enum';

@Entity()
export class Outlet {
    @PrimaryKey()
    name!: string;

    @Property({ nullable: true })
    description?: string;

    @Property()
    nativeAddress!: number;

    @Property({ type: Number })
    nativeChannel!: Channels;

    @Property({ type: Number, nullable: true })
    nativeChannel2?: Channels;

    @Property()
    multiChannel: boolean = false;

    @Property()
    value: boolean = false;

    [PrimaryKeyType]: [string];

    constructor(name: string, nativeAddress: number, nativeChannel: Channels) {
        this.name = name;
        this.nativeAddress = nativeAddress;
        this.nativeChannel = nativeChannel;
    }
}
