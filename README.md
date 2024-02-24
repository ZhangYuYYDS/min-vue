# min-vue

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
  - 
