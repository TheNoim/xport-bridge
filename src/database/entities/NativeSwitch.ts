import {
    Entity,
    PrimaryKey,
    PrimaryKeyType,
    Property,
    Unique,
} from 'mikro-orm';

@Entity()
export class NativeSwitch {
    @PrimaryKey()
    address!: number;

    @PrimaryKey()
    channel!: number;

    @Property()
    value: 0 | 1 = 0;

    [PrimaryKeyType]: [number, number];

    constructor(address: number, channel: number) {
        this.address = address;
        this.channel = channel;
    }
}
