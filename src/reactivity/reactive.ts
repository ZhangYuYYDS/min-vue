import { mutableHandlers, readonlyHandlers } from './baseHandlers';

export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly',
}

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

// isReactive
export function isReactive(value) {
    return !!value[ReactiveFlags.IS_REACTIVE];
}

// isReadonly
export function isReadonly(value) {
    return !!value[ReactiveFlags.IS_READONLY];
}
