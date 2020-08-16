---
layout: post
title: 'js的深拷贝与浅拷贝'
date: 2017-01-01
author: jiangbei
tags: jsBasic
---

## js数据类型
Javascript有六种数据类型
基本数据类型（原始类型）：Undefined，Null，Boolean，Number，String
引用数据类型：Object

### 基本数据类型
* 基本类型的值是不能添加属性的
* 它们的值在内存中占据着固定大小的空间，并被保存在栈内存中。
* 当一个变量向另一个变量复制基本类型的值，则会创建相同的值赋给它
```javascript
var un;
console.log(un);
//undefined
var oDom = document.getElementById("root");//"root"假设一个不存在的元素
console.log(oDom);
//null
var a = 1;
var b = a;
a = 2;
console.log(b) 
//1
a.name = "阿黄";
console.log(b.name) 
//undefined
console.log(a.name) 
//undefined
```
以上代码：un被声明但是却没有被赋值，所以类型为undefined。页面上并不存在id为root的dom元素，所以oDom类型为null。
a赋值为数字1，然后b又赋值a的值，两者值相等，但是同时占据着相同的内存空间，改变一方时，另一方并不会改变

### 引用数据类型
* 引用数据类型的值为对象，保存在堆内存中
* 包含引用类型的变量值并不是对象本身，而是一个指向该对象的指针
* 当一个变量从另一个变量复制引用类型的值得时候，其实只是复制了一个指向该对象的指针，两个变量同时指向该对象
```javascript
var dog1 = {
	name:"阿黄"
}
var dog2 = dog1;
dog2.name = "狗子";
console.log(dog1.name);
//狗子
```
以上代码：dog1复制给dog2时，只是让dog2指向了dog1原本指向的那个对象，当改变了dog2.name的值时，相当于直接改变了该对象的值，
而dog1也指向该对象，所以dog1的name跟着改变了，此种情况为 **浅拷贝**

### 深拷贝
#### 数组
```javascript
//数组
//slice方法
var arr1 = [1,2,3];
var arr2 = arr1.slice(0);
console.log(arr2);
//[1,2,3]
arr1.push(4)
console.log(arr1)
//[1,2,3,4]
console.log(arr2)
//[1,2,3]

//concat方法
var arr3 = [1,2,3];
var arr4 = arr3.concat();
console.log(arr4);
//[1,2,3]
arr3.push(4)
console.log(arr3)
//[1,2,3,4]
console.log(arr4)
//[1,2,3]

// for in 或者 for循环
var arr5 = [1,2,3];
const copy = function(arr){
	const newArr = [];
	for(let k in arr){
		newArr[k] = arr[k]
	}
	return newArr;
}
var arr6 = copy(arr5);
console.log(arr6);
//[1,2,3]
arr5.push(4)
console.log(arr5)
//[1,2,3,4]
console.log(arr6)
//[1,2,3]
```
#### 对象
```javascript
//对象
//Object.assign()
var person1 = {name:"大黄",age:3};
var person2 = Object.assign({},person1);
console.log(person2);
//{name:"大黄",age:3}
person1.age = 4;
console.log(person1.age);// 4
console.log(person2.age);// 3
//for in 
var person3 = {name:"大黄",age:3};
const copyObj = function(obj){
	const newObj = {};
	for(let k in obj){
		newObj[k] = obj[k]
	}
	return newObj;
}
var person4 = copyObj(person3);
console.log(person4);
//{name:"大黄",age:3}
person3.age = 4;
console.log(person3.age);// 4
console.log(person4.age);// 3
```

#### 总结
* 其实以上代码只比浅拷贝深了一层，并不完善，如以下代码
```javascript
var dog = {
	weight:"5-200(kg)",
	life:"0-20"
}
var animal =  {
	cat:{
		weight:"0.5-15(kg)",
		life:"0-20"
	},
	dog,
}
var newAnimal = Object.assign({},animal);
console.log(newAnimal.dog.life);
//"0-20"
animal.dog.life = "0-50";
console.log(animal.dog.life);
//"0-50";
console.log(newAnimal.dog.life);
//"0-50";
```

以上代码：animal.dog.life 赋值 "0-50" 之后  newAnimal.dog.life的值也已经改变，因为引用的是同一个 dog 对象

* 综合以上代码

```javascript
const deepCopy = function (val) {
		let result;
		if(Object.prototype.toString.call(val)==="[object Object]"){
			result = {}
		}else if(Object.prototype.toString.call(val)==="[object Array]"){
			result = []
		}else{
			return val
		}
		for(var key in val) {                
			if(val[key] && typeof(val[key]) === 'object') {
				result[key] = deepCopy(val[key])
			} else {
				result[key] = val[key]
			}
		}            
		return result;
}
var arrChild = [4,5,6];
var arr = [1,2,3,arrChild];
var copyArr = deepCopy(arr);
arrChild.push("小明")
console.log(arr)
// [1,2,3,[4,5,6,"小明"]]
console.log(copyArr)
//[1,2,3,[4,5,6]]
```

以上：arrChild改变之后，copyArr内部的值并没有改变