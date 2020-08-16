---
layout: post
title: 'fetch,ajax,axios几种请求的中断'
date: 2020-07-29
author: jiangbei
tags: jsBasic
---


似乎依旧有不少的小伙伴不知道请求该如何中断，本文就此介绍一下，废话不多说，直接开始

**假设我们的后端代码如下**

```js

router.get('/signin', async (ctx, next) => {
	//5秒后返回结果
	await awaitfn(5000)
	ctx.body = {
		title: 'koa2 json'
	}
})


```



## ajax


```js

const xhr = new XMLHttpRequest();

xhr.open('GET', 'http://127.0.0.1:3000/signin');

xhr.onreadystatechange = function() {
  if (xhr.status === 200 && xhr.readyState === 4) {
    console.log(xhr.response);
  }
};

xhr.onabort = function() {
  console.log('请求被中断');
};

setTimeout(() => {
  xhr.abort();
}, 1000);

xhr.send();

//请求被中断

```


## fetch

先介绍一个新的api，[AbortController](https://developer.mozilla.org/zh-CN/docs/Web/API/FetchController/AbortController)

```js

const url = 'http://127.0.0.1:3000/signin';

var controller = new AbortController();
var signal = controller.signal;

fetch(url, { signal })
  .then(function(response) {
    console.log(response);
  })
  .catch(function(e) {
    console.error(e);
    //2秒后输出,用户中止了一个请求
    //DOMException: The user aborted a request.
  });

setTimeout(() => {
  controller.abort();
}, 2000);



```



## axios

[中文官方文档](http://www.axios-js.com/zh-cn/docs/#取消)


```js
import axios from 'axios'

const url = 'http://127.0.0.1:3000/signin';

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios
  .get(url, {
    cancelToken: source.token,
  })
  .catch(function(thrown) {
    if (axios.isCancel(thrown)) {
      console.error('Request canceled', thrown.message);
    } else {
      // 处理错误
    }
  });

// 取消请求（message 参数是可选的）
setTimeout(() => {
  source.cancel('Operation canceled by the user.');
}, 1000);

```