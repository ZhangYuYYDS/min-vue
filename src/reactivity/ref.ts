import { trackEffects, triggerEffects, isTracking } from './effect';
import { hasChanged, isObject } from '../share';
import { reactive } from './reactive';

class RefImpl {
    private _rawValue: any;
    private _value: any;
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
