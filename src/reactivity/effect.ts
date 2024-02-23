class ReactiveEffect {
    private _fn: () => any;

    constructor(fn) {
        this._fn = fn;
    }
    run() {
        activeEffect = this;

        // 调用runner函数，执行fn并return fn的返回值
        return this._fn();
    }
}

// 收集依赖，收集的是所使用的属性的对应的函数
const targetMap = new Map();
export function track(target, key) {
    // target->key->dep
    let depsMap = targetMap.get(target);

    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }

    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }

    dep.add(activeEffect);
}

// 触发更新：将收集起来的key属性对应的所有的fn都执行一遍
export function trigger(target, key) {
    const depsMap = targetMap.get(target);
    const dep = depsMap.get(key);
    dep.forEach((effect) => effect.run());
}

// 执行函数：effect的作用就是执行函数
let activeEffect;
export function effect(fn) {
    // fn
    const _effect = new ReactiveEffect(fn);
    _effect.run();
    // 执行effect返回一个runner函数
    return _effect.run.bind(_effect);
}
