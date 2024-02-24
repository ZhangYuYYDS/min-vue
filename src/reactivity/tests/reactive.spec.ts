import { reactive, isReactive, isProxy } from '../reactive';

describe('reactive', () => {
    it('happy path', () => {
        const original = {
            nested: {
                foo: 1,
            },
            array: [{ bar: 2 }],
        };
        const observed = reactive(original);

        expect(observed).not.toBe(original);
        expect(isReactive(observed.nested)).toBe(true);
        expect(isReactive(observed.array)).toBe(true);
        expect(isReactive(observed.array[0])).toBe(true);

        // isProxy
        expect(isProxy(observed)).toBe(true);
        expect(isProxy(original)).toBe(false);
    });
});
