import { readonly, isReadonly } from '../reactive';

describe('readonly', () => {
    it('happy path', () => {
        const original = { foo: 1, bar: { bar2: 2 } };
        const wrapped = readonly(original);
        expect(isReadonly(wrapped)).toBe(true);
        expect(isReadonly(wrapped.bar)).toBe(true);
        expect(isReadonly(original)).toBe(false);
        expect(isReadonly(original.bar)).toBe(false);
        expect(wrapped).not.toBe(original);
        expect(wrapped.foo).toBe(1);
    });

    it('should not fail when proxy is nested', () => {
        // console.warn();
        // mock

        console.warn = jest.fn();

        const user = readonly({
            age: 10,
        });

        user.age = 20;
        expect(console.warn).toBeCalled();
    });
});
