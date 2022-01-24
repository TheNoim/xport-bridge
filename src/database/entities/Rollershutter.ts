import { Entity, Enum, PrimaryKey, PrimaryKeyType, Property } from 'mikro-orm';
import { Channels } from '../../xport.enum';

export enum RollershutterState {
    STOP,
    UP,
    DOWN,
}

@Entity()
export class Rollershutter {
    @PrimaryKey()
    name!: string;

    @Property({ nullable: true })
    description?: string;

    @Property()
    nativeAddress!: number;

    @Property({ type: Number })
    nativeChannel!: Channels;

    @Property({ default: false })
    supportsHalf: boolean = false;

    @Enum(() => RollershutterState)
    state: RollershutterState = RollershutterState.STOP;

    @Property({ onUpdate: () => new Date(), nullable: true })
    updatedAt?: Date = new Date();

    @Property({ default: 30 })
    timeToOpen!: number;

    @Property({ persist: false })
    get assumeInMotion(): boolean {
        if (this.updatedAt && this.state !== RollershutterState.STOP) {
            return (new Date().getTime() - (1000 * this.timeToOpen)) < this.updatedAt.getTime();
        } else {
            return false;
        }
    }

    [PrimaryKeyType]: [string];

    constructor(name: string, nativeAddress: number, nativeChannel: Channels) {
        this.name = name;
        this.nativeAddress = nativeAddress;
        this.nativeChannel = nativeChannel;
    }
}
