import { shallowReadonly, isReadonly } from '../reactive';

describe('shallowReadonly', () => {
    test('should not make non-reactive properties reactive', () => {
        const props = shallowReadonly({ n: { foo: 1 } });
        // 表层是readonly的
        expect(isReadonly(props)).toBe(true);
        // 内部的数据不是readonly
        expect(isReadonly(props.n)).toBe(false);
    });
});
