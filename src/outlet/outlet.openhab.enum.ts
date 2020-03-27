export enum OpenhabState {
    ON = 'ON',
    OFF = 'OFF'
}

export function getOpenhabStateFromPrimitive(primitive: boolean) {
    return primitive ? OpenhabState.ON : OpenhabState.OFF;
}

export function getPrimitiveFromOpenhabState(state: OpenhabState) {
    return state === OpenhabState.ON;
}
