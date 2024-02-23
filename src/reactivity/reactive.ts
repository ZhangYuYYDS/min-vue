import { mutableHandlers, readonlyHandlers } from './baseHandlers';

export function reactive(raw) {
    return createActiveObject(raw, mutableHandlers);
}

// 只读功能
export function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers);
}

function createActiveObject(raw: any, baseHandlers) {
    return new Proxy(raw, baseHandlers);
}
