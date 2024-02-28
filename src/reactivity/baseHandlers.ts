import { track, trigger } from './effect';
import { ReactiveFlags, reactive, readonly } from './reactive';
import { isObject, extend } from '../share/index';

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

// 重构代码：将get提取出来
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {
        // isReactive
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly;
        } // isReadonly
        else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly;
        }

        const res = Reflect.get(target, key);

        // 如果是浅只读的，则不需要进行后续操作，直接return res就行
        if (shallow) {
            return res;
        }

        // 实现 reactive 和 readonly 的嵌套对象功能:看看res是不是一个object
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }

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

        // TODO 触发依赖
        trigger(target, key);
        return res;
    };
}

export const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`key: ${key} set 失败，因为 target 是 readonly`);
        return true;
    },
};

export const mutableHandlers = {
    get,
    set,
};

// 逻辑与readonlyHandlers类似，set相同，get不同，所以通过extend改写一下get即可
export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet,
});
