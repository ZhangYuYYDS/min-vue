import { reactive } from '../reactive';
import { effect } from '../effect';

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
});
