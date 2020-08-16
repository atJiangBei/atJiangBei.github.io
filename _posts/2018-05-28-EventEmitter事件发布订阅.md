---
layout: post
title: '手动实现一个EventEmitter发布订阅'
date: 2018-05-28
author: jiangbei
tags: designPattern
---

## EventEmitter
我们知道node里面有一个event模块，用法如下

```javascript

var events = require('events'); 
var emitter = new events.EventEmitter(); 
emitter.on('someEvent', function(arg1, arg2) { 
    console.log('listener1', arg1, arg2); 
}); 
emitter.on('someEvent', function(arg1, arg2) { 
    console.log('listener2', arg1, arg2); 
}); 
emitter.emit('someEvent', 'arg1 参数', 'arg2 参数'); 

```

以上：同一个事件名，注册了两个监听函数，然后触发这个事件
**本文不解释观察者模式和发布订阅模式的区别，也不考虑本文实现的EventEmitter是观察者模式还是发布订阅模式**

```javascript

class EventEmitter{
	constructor(){
		this.events = Object.create(null)
	}
	on(event,fn){
		this.__addEvent(event,fn)
	}
	emit(event){
		const attr = this.events[event] || [];
		[].shift.call(arguments);
		const arg = arguments;
			let l = attr.length;
			for(let i=0;i<l;i++){
				const {fn,once}  = attr[i];
				fn.apply(this,arg)
				if(once){
					attr.splice(i,1)
					i--;
					l--;
				}
			}
		return this;
	}
	removeEvent(event,fn){
		if(!event){
			this.events = Object.create(null);
		}else if(!fn){
			delete this.events[event]
		}else{
			const attr = this.events[event] || [];
			let l = attr.length;
			for(let i=0;i<l;i++){
				if(attr[i].fn === fn){
					attr.splice(i,1);
					l--;
					i--;
				}
			}
		}
		
		return this;
	}
	once(event,fn){
		this.__addEvent(event,fn,true)
		return this;
	}
	__addEvent(event,fn=function(){},once = false){
		if(!this.events[event]){
			this.events[event] = [];
			this.events[event].push({
				fn,once
			})
			return this;
		}
		this.events[event].push({
			fn,once
		});
	}
}

const emitter = new EventEmitter();
function cb(){
	console.log(1)
}
emitter.on("hehe",cb)
emitter.once("hehe",function(a){
	console.log(2)
})
emitter.once("hehe",function(a){
	console.log(3)
})
emitter.emit("hehe");//1,2,3
emitter.emit("hehe");//1
emitter.removeEvent("hehe",cb)
emitter.emit("hehe");//不执行，cb函数已移除


```

太简单了，不知道该说啥，翻阅了源码，翻阅了很的例子，模式又不是自己原创，没啥可说的，大家看看理解就好了
[node events模块源码地址](https://github.com/nodejs/node/blob/master/lib/events.js)