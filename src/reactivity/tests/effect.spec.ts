import { reactive } from '../reactive';
import { effect, stop } from '../effect';

describe('effect', () => {
    it('happy path', () => {
        const user = reactive({
            age: 10,
        });

        let nextAge;
        effect(() => {
            nextAge = user.age + 1;
        });

        expect(nextAge).toBe(11);

        // update
        user.age++;
        expect(nextAge).toBe(12);
    });

    it('should return the new value after run', () => {
        // 1. effect(fn) => function(runner) => fn => return
        // 描述：当调用effect函数时，会返回一个函数（runner），当执行runner函数时，会再次执行fn函数并返回fn的return值
        let foo = 10;
        const runner = effect(() => {
            foo++;
            return 'foo';
        });

        expect(foo).toBe(11);
        const r = runner();
        expect(foo).toBe(12);
        expect(r).toBe('foo');
    });

    it('scheduler', () => {
        // 2. effect(fn, { scheduler: fn2 }) => function(runner) => fn => return
        // 功能：
        // - 通过effect的第二个参数给定的一个scheduler的fn
        // - effect 第一次执行的时候还会执行fn
        // - 当响应式对象set update不会执行fn，而是执行第二个参数scheduler函数
        // - 如果说当执行runner的时候，会再次的执行fn
        let dummy;
        let run: any;
        const scheduler = jest.fn(() => {
            run = runner;
        });
        const obj = reactive({ foo: 1 });
        const runner = effect(
            () => {
                dummy = obj.foo;
            },
            { scheduler }
        );
        expect(scheduler).not.toHaveBeenCalled();
        expect(dummy).toBe(1);
        // should be called on first trigger
        obj.foo++;
        expect(scheduler).toHaveBeenCalledTimes(1);
        // should not run yet
        expect(dummy).toBe(1);
        // manually run
        run();
        // should have run
        expect(dummy).toBe(2);
    });

    it('stop', () => {
        // 3. stop 停止特定的effect函数的运行
        let dummy;
        const obj = reactive({ prop: 1 });
        const runner = effect(() => {
            dummy = obj.prop;
        });
        obj.prop = 2;
        expect(dummy).toBe(2);
        stop(runner);
        // should not trigger
        // obj.prop = 3;
        // expect(dummy).toBe(2);

        obj.prop++;
        expect(dummy).toBe(2);
        // stopped effect should still be manually callable
        runner();
        expect(dummy).toBe(3);
    });

    it('onStop', () => {
        // 4. 用于在某个effect函数被停止时执行特定的回调函数。
        // 当使用 stop 函数停止一个effect函数时，可以通过传入 onStop 函数来指定在停止时需要执行的逻辑。
        const obj = reactive({ prop: 1 });
        const onStop = jest.fn();
        let dummy;
        const runner = effect(
            () => {
                dummy = obj.prop;
            },
            {
                onStop,
            }
        );
        stop(runner);
        expect(onStop).toBeCalledTimes(1);
    });
});
