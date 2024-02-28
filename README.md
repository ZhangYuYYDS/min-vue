# min-vue

# 10. 实现isReactive和isReadonly方法，用于判断一个对象是否是响应式对象和只读对象
- 如何实现
  - 在get操作时已经通过isReadonly变量判断了是否为只读的对象了，所以只需要触发get操作就可以通过isReadonly变量判断是否为响应式对象了，isReadonly同理

# 11. 优化stop功能，使其只触发set操作
- 明确 obj.prop=3 和 obj.prop++ 的区别
- obj.prop=3 只触发set操作
- obj.prop++ 触发set和get操作，这样就会先执行get重新收集依赖，然后再执行set更新，此时stop没有发挥作用
- 如何优化：可以在track时加一个变量去控制它到底应不应该收集依赖
- 修改stop方法，使其在执行stop时，将变量设置为false，这样在执行set时，就不会收集依赖了，反之会收集依赖

# 12. 实现reactive 和 readonly的嵌套对象转换功能
- 修改reactive方法，使其可以接收一个嵌套的对象，并将其转换为响应式对象
  - 首先判断一下取到的值是否为对象，如果是对象，则递归调用reactive方法
- 修改readonly方法，使其可以接收一个嵌套的对象，并将其转换为只读对象
  - 首先判断一下取到的值是否为对象并且是只读的，如果是，则递归调用readonly方法

# 13. 实现shallowReadonly功能
- 首先明确什么是(shallowReadonly)浅只读
  - shallowReadonly用于创建一个代理，使得响应式对象的第一层属性是只读的，而更深层的属性和子对象属性则不是只读的。换句话说，只有最外层的属性被设置成只读，内部的数据仍然可以进行更改。
- 如何实现？
  - 通过shallow变量来控制是否只读第一层属性，shallow为true时，直接返回结果

# 14. 实现isProxy功能
- 首先明确什么是isProxy
  - 判断一个对象是否是由reactive 和 readonly 创建的响应式代理对象

# 15. 实现ref方法
- ref的功能
  - 创建一个响应式对象，该对象包含一个value属性，并且value属性是可读写的
  - 如果修改后的值和修改前的值相同，则不进行值的修改和依赖更新操作
  - 如果ref包裹的是一个对象，需要将这个对象变成一个reactive包裹后的对象
- 如何实现？
  - 首先明确ref的参数类型
  - 如果参数是对象，则需要将其变成一个reactive包裹后的对象
  - 如果参数是基本类型，则直接返回这个值
  - 然后通过track和trigger来收集依赖和触发更新操作
- 为什么这样实现？
  - 因为ref的参数类型可以是基本类型时，如果使用reactive，则返回的是一个响应式对象，所以需要用一个对象来包裹，这个对象中有value get set
  
# 16. 实现isRef方法

# 17. 实现unRef方法
- 明确unRef的功能
  - 用于获取响应式引用对象中的实际值
- 如何实现？
  - 首先明确unRef的参数类型 
  - 如果参数是ref对象，则直接返回其value属性
  - 如果参数是基本类型，则直接返回这个值


# 18. 实现proxyRefs方法
- 明确proxyRefs的功能
  - proxyRefs 在 Vue 3 中主要用于在 setup 函数内部创建一个代理对象，该对象将 ref 对象包装成可以直接访问其值的属性。这样，当你在 setup 函数内部需要访问这些 ref 属性时，你可以像访问普通属性一样访问它们，而无需每次都通过 .value 来访问。
  - 虽然 Vue 的模板系统能够自动解包 ref 对象，使你在模板中能够直接访问其值，但在 setup 函数内部，你仍然面对的是 ref 对象。如果你希望在 setup 函数内部也能够直接访问这些值，而不想每次都写 .value，那么 proxyRefs 就非常有用。
- 如何实现？
  - get时，通过unRef实现自动解构，不需要.value
  - set时
    - 如果新值是ref对象，则直接替换掉，不管原来的值是不是ref
    - 如果新值是基本类型并且原来的值是ref，则直接修改.value值

# 19. 实现computed计算属性
- 明确computed的功能
  - 创建一个计算属性，该计算属性会根据依赖的响应式数据的变化而自动更新
  - 计算属性的值可以是基本类型、引用类型或者函数
  - 计算属性可以被缓存，只有当依赖的响应式数据发生变化时，才会重新计算
  - 计算属性可以被设置为只读或可读写
  - 计算属性可以被设置为懒加载：在没有使用.value前，计算属性不执行
```js
<script setup>
import { ref, watch, reactive, computed } from 'vue';
const value = reactive({ foo: 1 });

// 计算属性
const getter = () => {
    console.log('getter函数执行了');
    return value.foo;
};
const hasPublishedBooks = computed(getter);

// 在没有使用.value前，getters函数不执行
console.log(hasPublishedBooks.value);
</script>
```

# 20. 实现初始化 component 主流程


