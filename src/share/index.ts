export const extend = Object.assign;

export function isObject(value: unknown): value is Record<any, any> {
    return value !== null && typeof value === 'object';
}

export const hasChanged = (newValue, oldValue) => {
    return Object.is(newValue, oldValue);
};
