import { extend } from '../share/index';

let shouldTrack;

class ReactiveEffect {
    deps = [];
    active = true;
    onStop?: () => void;
    private _fn: () => any;
    public scheduler: Function | undefined;
    constructor(fn, scheduler?: Function) {
        this._fn = fn;
        this.scheduler = scheduler;
    }
    run() {
        activeEffect = this;
        if (!this.active) {
            //false:已经clean过了，以后不用追踪
            return this._fn();
        }

        shouldTrack = true;
        activeEffect = this;
        const result = this._fn();
        shouldTrack = false;
        return result;
    }

    stop() {
        // 清除依赖
        if (this.active) {
            cleanupEffect(this);
            // 执行stop函数时，如果发现有onStop就执行onStop
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    }
}

function cleanupEffect(effect: ReactiveEffect) {
    effect.deps.forEach((dep: any) => dep.delete(effect));
}

function isTracking() {
    // 用shouldTrack变量控制是否应该收集依赖
    // activeEffect变量表示当前调用的对象
    return shouldTrack && activeEffect !== undefined;
}

// 收集依赖，收集的是所使用的属性的对应的函数
const targetMap = new Map();
export function track(target, key) {
    if (!isTracking()) return;

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

    // 如果activeEffect已经在dep中了，就没有必要在添加了
    if (dep.has(activeEffect)) return;
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
}

// 触发更新：将收集起来的key属性对应的所有的fn都执行一遍
export function trigger(target, key) {
    const depsMap = targetMap.get(target);
    const dep = depsMap.get(key);
    for (const effect of dep) {
        // 判断effect是否有scheduler方法
        if (effect.scheduler) {
            effect.scheduler();
        } else {
            effect.run();
        }
    }
}

// 执行函数：effect的作用就是执行函数
let activeEffect;
export function effect(fn, options: any = {}) {
    // fn
    const _effect = new ReactiveEffect(fn, options.scheduler);
    // options
    Object.assign(_effect, options);
    // extend
    extend(_effect, options);
    _effect.onStop = options.onStop;
    _effect.run();
    // 执行effect返回一个runner函数
    const runner: any = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}

export function stop(runner) {
    runner.effect.stop();
}
