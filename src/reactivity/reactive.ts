import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers';

export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly',
}

// reactive功能
export function reactive(raw) {
    return createActiveObject(raw, mutableHandlers);
}

// readonly只读功能
export function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers);
}

// shallowReadonly浅只读功能
export function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandlers);
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

// isProxy
export function isProxy(value) {
    return isReactive(value) || isReadonly(value);
}
