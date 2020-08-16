---
layout: post
title: 'react之自定义hook'
date: 2020-08-03
author: jiangbei
tags: react
---


# 自定义hook


## hook基本使用

我们只实现一个简单的功能，首先请求数据，并且在数据请求过程中展示loading，数据请求结束关闭loading，并展示数据

**class写法**

```js
import React from 'react';
import axios from "axios"
import { Spin  } from 'antd';

class App entends React.Component{
	state = {
		visibility:false,
		msg:null
	}
	componentDidMount(){
		this.init()
	}
	async init(){
		this.setState({
			visibility:true
		})
		let msg = ""
		try{
			msg = await axios.get('http://127.0.0.1:3000/signin')
		}catch(){
			msg = "请求失败"
		}
		finally {
			this.setState({
				visibility:false,
				msg
			})
		}
		
	}
	render(){
		const { msg,visibility } = this.state
		return <div className="App">
			<Spin spinning={visibility}>
				我是好大一段文字啊
				{ msg }
			</Spin>
		</div>
	}
}


```


**hook写法**


```js
import React,{ useState, useEffect } from "react"

function App(){
	const [visibility,setVisibility] = useState(true);
	const [msg,setMsg] = useState("");
	const init = async ()=>{
		setVisibility(true);
		let resMsg = ''
		try{
			resMsg = await axios.get('http://127.0.0.1:3000/signin')
		}catch(){
			resMsg = "请求失败"
		}
		finally {
			setVisibility(false);
			setMsg(resMsg);
		}
	}
	useEffect(()=>{
		init()
	},[])
	
	return <div className="App">
		<Spin spinning={visibility}>
			我是好大一段文字啊
			{ msg }
		</Spin>
	</div>
	
}


```

**自定义hook写法**

```js

function useGetMsg(){
	const [visibility,setVisibility] = useState(true);
	const [msg,setMsg] = useState([]);
	useEffect(()=>{
		axios.get('http://127.0.0.1:3000/signin').then(res=>{
			setMsg(res);
			setVisibility(false);
		})
	},[])
	return [visibility,msg]
}
function App() {
	const [visibility,msg] = useGetMsg()
	
  return (
    <div className="App">
		<Spin spinning={visibility}>
			我是好大一段文字啊
			{ msg }
		</Spin>
    </div>
  );
}


```