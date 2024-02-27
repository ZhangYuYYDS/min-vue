import { trackEffects, triggerEffects, isTracking } from './effect';
import { hasChanged, isObject } from '../share';
import { reactive } from './reactive';

class RefImpl {
    private _rawValue: any;
    private _value: any;
    private __v_isRef = true;
    public dep;
    constructor(value) {
        this._rawValue = value;
        // 如果传递过来的value是一个对象，需要将value变成reactive包裹之后的值
        this._value = isObject(value) ? reactive(value) : value;

        this.dep = new Set(); // 收集依赖
    }
    get value() {
        trackRefValue(this);
        return this._value;
    }

    set value(newValue) {
        // 先判断一下修改后的值和原来的值是否相等，ref包裹的值有两种形式，变量和对象
        // - 如果相等，不进行依赖触发操作和修改值的操作
        if (hasChanged(newValue, this._rawValue)) return;

        // 一定是先修改了value的值再进行触发依赖
        this._rawValue = newValue;
        this._value = isObject(newValue) ? reactive(newValue) : newValue;

        triggerEffects(this.dep); // 触发依赖
    }
}

function trackRefValue(ref) {
    if (isTracking()) {
        trackEffects(ref.dep); // 收集依赖
    }
}
export function ref(value) {
    // 创建了一个响应式对象
    return new RefImpl(value);
}

export function isRef(ref) {
    return !!ref.__v_isRef;
}

export function unRef(ref) {
    return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objectWithRefs) {
    return new Proxy(objectWithRefs, {
        get(target, key) {
            return unRef(Reflect.get(target, key));
        },

        // 判断一下之前的key是不是ref类型,并且新的值不是一个ref:修改value的值
        set(target, key, value) {
            if (isRef(target[key]) && !isRef(value)) {
                return (target[key].value = value);
            } else {
                // 如果是新的值是ref：直接替换掉
                return Reflect.set(target, key, value);
            }
        },
    });
}
