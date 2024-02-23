import { track, trigger } from './effect';

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

// 重构代码：将get提取出来
function createGetter(isReadonly = false) {
    return function get(target, key) {
        const res = Reflect.get(target, key);

        // TODO 依赖收集，如果是只读的则不需要收集依赖
        if (!isReadonly) {
            track(target, key);
        }
        return res;
    };
}

// 重构代码：将set提取出来
function createSetter(isReadonly = false) {
    return function set(target, key, val) {
        const res = Reflect.set(target, key, val);

        // TODO 触发依赖，如果是只读的则不需要触发依赖
        if (!isReadonly) {
            trigger(target, key);
        }
        return res;
    };
}
export const readonlyHandlers = {
    readonlyGet,
    set(target, key, value) {
        console.warn(`key: ${key} set 失败，因为 target 是 readonly`);
        return true;
    },
};

export const mutableHandlers = {
    get,
    set,
};