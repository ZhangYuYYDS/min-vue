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
- 修改track方法，使其可以递归处理嵌套的对象