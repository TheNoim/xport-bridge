export class Binary {
    constructor(private readonly binaryArray: Array<0 | 1>) {}

    public convertToString(): string {
        return this.binaryArray.join('');
    }

    public getInteger(): number {
        const str = this.convertToString();
        return parseInt(str, 2);
    }
}
