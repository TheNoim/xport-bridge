import { Entity, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core';

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
