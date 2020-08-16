---
layout: post
title: 'EventLoop'
date: 2017-12-08
author: jiangbei
tags: jsBasic
---

## Event Loop

* 同步和异步任务分别进入不同的执行"场所"，同步的进入主线程，异步的进入Event Table并注册函数。
* 当指定的事情完成时，Event Table会将这个函数移入Event Queue。
* 主线程内的任务执行完毕为空，会去Event Queue读取对应的函数，进入主线程执行。
* 上述过程会不断重复，也就是常说的Event Loop(事件循环)。


JavaScript的事件分两种，宏任务(macro-task)和微任务(micro-task)

**宏任务：**包括整体代码script，setTimeout，setInterval
**微任务：**Promise.then(非new Promise)，process.nextTick(node中)
**事件的执行顺序：**是先执行宏任务，然后执行微任务，此为基础，任务可以有同步任务和异步任务，同步的进入主线程，
异步的进入Event Table并注册函数，先把宏任务放入Event Queue，再把微任务放入Event Queue，（不同的的Event Queue）
同步任务执行完成后，会从Event Queue中读取事件放入主线程执行，先读取微任务，再读取宏任务，

```javascript

console.log(1)
setTimeout(()=>{
	console.log(2)
},0)
new Promise(res=>{
	console.log(3)
	res()
}).then(()=>{
	console.log(4)
})


```

以上：同步的进入主线程，再把宏任务(setTimeout)加入事件队列，微任务(.then)加入事件队列，主线程完成后输出(1，3)，再执行微任务
输出4，再执行宏任务输出2

再看一个例子

```javascript
function sleep(num){
	let start = Date.now();
	while(true){
		if(Date.now()-start>=num){
			console.log(1)
			return
		}
	}
}

setTimeout(()=>{
	console.log(2)
})
sleep(6000)
console.log(3)
Promise.resolve().then(()=>{
	console.log(4)
})

```

以上：不要被sleep函数的阻塞所迷惑，依旧是先把sleep函数和console.log(3)加入主线程,把延时器和.then假如队列，
主线程输出1，3。再执行微任务.then输出4，最后执行宏任务输出2。


最后看一个比较复杂的例子

```javascript

console.log('1');

setTimeout(function() {
    console.log('2');
    process.nextTick(function() {
        console.log('3');
    })
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
})
process.nextTick(function() {
    console.log('6');
})
new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    console.log('8')
})

setTimeout(function() {
    console.log('9');
    process.nextTick(function() {
        console.log('10');
    })
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
})


```
**第一轮循环：**
* 整体script作为第一个宏任务进入主线程，遇到console.log，输出1。
* 遇到setTimeout，其回调函数被分发到宏任务Event Queue中。我们暂且记为setTimeout1。
* 遇到process.nextTick()，其回调函数被分发到微任务Event Queue中。我们记为process1。
* 遇到Promise，new Promise直接执行，输出7。then被分发到微任务Event Queue中。我们记为then1。
* 又遇到了setTimeout，其回调函数被分发到宏任务Event Queue中，我们记为setTimeout2。
* 宏任务执行完输出1，7，然后执行微任务process1和then1输出了6，8
* 所以第一轮输出：1，7，6，8

**第二轮循环：**
* 第二轮循环从宏任务setTimeout1开始
* 首先输出2。接下来遇到了process.nextTick()，同样将其分发到微任务Event Queue中，记为process2。new Promise立即执行输出4，then也分发到微任务Event Queue中，记为then2
* 第二轮事件循环宏任务结束，我们发现有process2和then2两个微任务可以执行，输出3和5
* 第二轮输出2，4，3，5

**第三轮循环**
* 第三轮循环从setTimeout2开始
* 直接输出9。将process.nextTick()分发到微任务Event Queue中。记为process3。直接执行new Promise，输出11。将then分发到微任务Event Queue中，记为then3。
* 第三轮事件循环宏任务执行结束，执行两个微任务process3和then3。输出10和12
* 第三轮输出9，11，10，12。

综上：1，7，6，8，2，4，3，5，9，11，10，12。