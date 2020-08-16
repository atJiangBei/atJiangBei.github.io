---
layout: post
title: '远程linux下安装mongodb'
date: 2019-12-06
author: jiangbei
tags: network
---


* <font  color="#2ca6cb">本文实用工具，xshell,FileZilla,Edit plus5</font>  

## 1，下载并解压

[下载](https://www.mongodb.com/download-center#community)

```
//解压
tar -zxvf mongodb-linux-x86_64-3.0.6.tgz
//把文件从当前文件夹下移动到另外一个文件夹
mv  mongodb-linux-x86_64-3.0.6/ /usr/local/server/mongodb
```

## 2，添加环境变量，全局执行命令

* /etc/profile文件最后添加export PATH=$PATH:/usr/local/server/mongodb/bin 
* 然后执行source /etc/profile使配置生效


```
//就是刚才移动的那个路径
export PATH=$PATH:/usr/local/server/mongodb/bin
//
source /etc/profile
```

## 3，创建配置文件等

* 在root 文件夹下 创建mongodb文件夹 mkdir mongodb 
* 进入文件夹并创建data文件夹存储数据 mkdir data
* 创建logs文件作为日志输出 touch logs
* 创建配置文件touch mongodb.conf
* 编辑配置文件

```

dbpath = /root/mongodb/data  # 数据
logpath = /root/mongodb/logs # 日志
logappend = true
port = 27017 # 端口号
fork = true # 后台启动
auth = false

```


## 4，启动服务
 
```
mongod --config /root/mongodb/mongodb.conf
```

## 5，关闭和查看进程

```
ps -ef | grep mongo  //查看进程
kill -9 pid  //关闭进程

```