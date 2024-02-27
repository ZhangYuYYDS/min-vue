import { ReactiveEffect } from './effect';

class ComputedRefImpl {
    private _getter: any;
    private _dirty: boolean = true;
    private _value: any;
    private _effect: any;
    constructor(getter) {
        this._getter = getter;
        // set的时候，应该只会执行一次getter函数，但是却会执行两次，这是因为
        // 所以使用scheduler
        this._effect = new ReactiveEffect(getter, () => {
            if (!this._dirty) {
                this._dirty = true;
            }
        });
    }

    get value() {
        // 当依赖的响应式对象发生改变时，将_dirty设置为true
        if (this._dirty) {
            this._dirty = false;
            this._value = this._effect.run();
        }
        return this._value;
    }

    set value(newValue) {
        console.log('set value', newValue);
    }
}

export function computed(getter) {
    return new ComputedRefImpl(getter);
}
