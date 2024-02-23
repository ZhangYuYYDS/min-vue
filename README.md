# min-vue

# 11. 优化stop功能，使其只触发set操作
- 明确 obj.prop=3 和 obj.prop++ 的区别
- obj.prop=3 只触发set操作
- obj.prop++ 触发set和get操作，这样就会先执行get重新收集依赖，然后再执行set更新，此时stop没有发挥作用
- 如何优化：可以在track时加一个变量去控制它到底应不应该收集依赖
- 修改stop方法，使其在执行stop时，将变量设置为false，这样在执行set时，就不会收集依赖了，反之会收集依赖