import { readonly } from '../reactive';

describe('readonly', () => {
    it('happy path', () => {
        const original = { foo: 1, bar: { bar2: 2 } };
        const proxy = readonly(original);
        expect(proxy).not.toBe(original);
        expect(proxy.foo).toBe(1);
        expect(proxy.bar).toBe(original.bar);
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
