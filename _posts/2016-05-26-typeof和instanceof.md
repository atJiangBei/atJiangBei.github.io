---
layout: post
title: 'typeof和instanceof'
date: 2015-05-26
author: jiangbei
tags: jsBasic
---

## typeof
* 在MDN中译为：[typeof操作符返回一个字符串，表示未经计算的操作数的类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof)
* typeof 一般返回如下几个结果："number"，"string"，"boolean"，"object"，"function" ， "undefined"
假设有一个场景，我们直接判断变量a是否存在，直接的if(a),如果a不存在，此时会抛出错误 a is not defined，因此我们可以使用typeof判断

```javascript

//console.log(a)
//err:a is not defined
typeof(a);//undefined
typeof(undefined);//undefined
typeof(Function);//function
typeof(Object);//function
typeof(Array);//function

typeof(null);//object
typeof({});//object

typeof(false);//boolean
typeof("123");//string
typeof(123);//number

typeof([1,2,3]);//object


```
**可怕的事情(忘记吧)**
在IE 6,7和8上，很多宿主对象是对象而不是函数。例如：
```javascript

typeof alert === 'object'

```


但是这也有许多不便，例如我们直接判断一个数组是数组还是对象，用typeof判断出来的都是对象，此时我们可以使用**instanceof**

## instanceof
* 在MDN中译为：[The instanceof operator tests whether the prototype property of a constructor appears anywhere in the prototype chain of an object.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)
* 中文：instanceof 运算符用来测试一个对象在其原型链中是否存在一个构造函数的 prototype 属性。
* 用法 object instanceof constructor,返回false或者true
小小的用法
```javascript
console.log([] instanceof Array);
//true
console.log({} instanceof Array);
//false

```

**具体示例**

描述：用来检测某个要检测的对象的构造函数（constructor）是否存在与 某对象 原型链上面
请看一下示例：

```javascript

const a = {};
a instanceof Object;//true

function Parent(){}
function Child(){}

console.log(Parent instanceof Function)
//true

Child.prototype = new Parent()
const child = new Child()
console.log(child instanceof Child)
//true
console.log(child instanceof Parent)
//true
class A{
	
}
class B extends A{
	
}
const b = new B()
console.log(b instanceof A);//true
console.log(b instanceof B);//true

```
