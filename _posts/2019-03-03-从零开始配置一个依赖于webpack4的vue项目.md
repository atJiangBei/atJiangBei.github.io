---
layout: post
title: '从零开始配置一个依赖于webpack4的vue项目'
date: 2019-03-03
author: jiangbei
tags: projectBuilding
---

**引：**现在我们写vue也好，react也好，都有对应的脚手架可以用，（vue-cli）(create-react-app)，
但是我们也可以自己从零开始搭建一个。（不要问我为什么不想用，偶尔不想用就是不想用，没有理由）

## 一些依赖包的作用
先介绍一下一些主要包的作用吧，我感觉这个是最重要的

* 1.webpack,webpack-cli,这两个是基本包，不用说了吧（我记得3.0之前这两个并不是分开的）
* 2.webpack-dev-server，启动一个开发环境服务，支持实时更新修改的代码
* 3.vue-loader，这个很明显，编译.vue文件用的
* 4.html-webpack-plugin，指定你生成的文件所依赖哪一个html文件模板，我们这里使用html模板（其实还支持jade、ejs）
* 5.clean-webpack-plugin，我们这里打包的时候用它来清除dist文件夹的内容
* 6.copy-webpack-plugin，负责拷贝静态文件
* 7.friendly-errors-webpack-plugin，负责清理服务启动后控制台输出的过多信息
* 8.mini-css-extract-plugin，压缩css代码

## 先看一下项目目录
>根目录
>>config ->（配置文件）

>>hometown ->（公用ui组件）

>>src -> （项目目录）

>>static -> （静态文件）

>>package.json


#### 基本配置（config.js）

```javascript

module.exports = {
	dev: {
		entry:path.resolve(__dirname, './../src/main.js'),
		filename: '[name].[hash].bundle.js',
		path: path.resolve(__dirname, './../dist'),
		contentBase: path.join(__dirname, "./../dist"),
		port: 9900,
			proxyTable: {
				'/api': {
					target: '127.0.0.1:7001',
					ws: true,
					changeOrigin: true
				},
		},
    host: 'localhost', // can be overwritten by process.env.HOST
  },
  build: {
		entry:path.resolve(__dirname, './../src/main.js'),
    filename: 'static/js/[name].[hash].bundle.js',
    path: path.resolve(__dirname, './../dist'),
    publicPath:"./"
  }
}


```

#### 公共配置（webpack.base.config.js）

```javascript

'use strict'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require("path")
const loader = process.env.NODE_ENV === 'production'? MiniCssExtractPlugin.loader:'vue-style-loader';
console.log(process.env.NODE_ENV)
module.exports = {
	alias: {
	  "@": path.resolve(__dirname, '../src'),
	  "root-directory": path.resolve(__dirname, '../hometown/index.js'),
	},
	rules: [
		{
			test: /\.vue$/,
			loader: 'vue-loader',
		},
		{
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/
		},
		{
			test: /\.css$/,
			use: [
				loader,
			  {
			  loader: 'css-loader',
			  options: {
					// 开启 CSS Modules
					//modules: true,
					// 自定义生成的类名
					localIdentName: '[local]_[hash:base64:8]'
				  }
			  },
			//"postcss-loader"
			]
		},
		{
		  test: /\.less$/,
		  use: [
			'vue-style-loader',
			loader,
			{
			  loader: 'css-loader',
			  //options: { modules: true }
			},
			'less-loader'
		  ]
		},
		{
			test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
			loader: 'url-loader',
			options: {
				limit: 10000,
				name: process.env.NODE_ENV === 'production'?path.posix.join("static",'img/[name].[hash:7].[ext]'):"",
			}
		},
		{
			test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
			loader: 'url-loader',
			options: {
				limit: 10000,
			}
		},
		{
			test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
			loader: 'url-loader',
			options: {
				limit: 10000,
			}
		}
	]
}

```

#### 开发环境的配置（webpack.dev.config.js）

```javascript

'use strict'
process.env.NODE_ENV = "development"
const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpackBaseConf = require("./webpack.base.config")
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const config = require("./config")
module.exports = {
	mode: process.env.NODE_ENV,
	entry:config.dev.entry,
	output:{
		filename: config.dev.filename,
		path:config.dev.path,
	},
	module: {
		rules: webpackBaseConf.rules,
	},
	resolve:{
		alias:webpackBaseConf.alias,
	},
	plugins: [
		new HtmlWebpackPlugin({
				filename: './index.html',
				template: './index.html',
				inject: true,
			}),
		new VueLoaderPlugin(),
		new FriendlyErrorsWebpackPlugin({
			 compilationSuccessInfo: {
				messages: [`You application is running here http://localhost:${config.dev.port}`],
			  },
		}),
		new CopyWebpackPlugin([
		  {
		    from: path.resolve(__dirname, './../static'),
		    to: path.resolve(__dirname, './../dist/static'),
		    ignore: ['.*']
		  }
		]),
	],
	devServer: {
	  contentBase: config.dev.contentBase,
	  compress: true,
	  overlay: true, // 编译出现错误时，将错误直接显示在页面上
	  quiet: true,
	  port: config.dev.port,
	  proxy:config.dev.proxyTable,
	  disableHostCheck: true
	}
}


```

#### 生产环境配置

```javascript

'use strict'
process.env.NODE_ENV = 'production';
const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件
const VueLoaderPlugin = require('vue-loader/lib/plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin'); 
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpackBaseConf = require("./webpack.base.config")
const config = require("./config")


module.exports = {
	mode: "production",
	entry:config.build.entry,
	output:{
		filename: config.build.filename,
		path: config.build.path,
		publicPath:config.build.publicPath,
	},
	module: {
		rules: webpackBaseConf.rules,
	},
	resolve:{
		alias:webpackBaseConf.alias,
	},
	plugins: [
		new HtmlWebpackPlugin({
				filename: './index.html',
				template: './index.html',
				inject: true,
			}),
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin({filename: "static/css/style.css"}),
		new CleanWebpackPlugin(["dist"],{ 
		  root: path.resolve(__dirname, '../'),
		  dry: false // 启用删除文件
		}),
		new CopyWebpackPlugin([
		  {
		    from: path.resolve(__dirname, './../static'),
		    to: path.resolve(__dirname, './../dist/static'),
		    ignore: ['.*']
		  }
		]),
	]
}


```

#### package.json
```javascript

"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack-dev-server --inline --progress --config ./config/webpack.dev.config.js",
    "start": "npm run dev",
    "build": "webpack --inline --progress --config ./config/webpack.production.config.js"
  },
"devDependencies": {
    "autoprefixer": "^9.5.0",
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.5",//这里用8版本的会报错
    "clean-webpack-plugin": "^1.0.1",
    "copy-webpack-plugin": "^5.0.0",
    "css-loader": "^2.0.2",
    "extract-text-webpack-plugin": "^3.0.2",
    "file-loader": "^3.0.1",
    "friendly-errors-webpack-plugin": "^1.7.0",
    "html-webpack-plugin": "^3.2.0",
    "less": "^3.9.0",
    "less-loader": "^4.1.0",
    "mini-css-extract-plugin": "^0.5.0",
    "node-notifier": "^5.4.0",
    "postcss": "^7.0.14",//这几个以postcss开头的是用来兼容css的，总之功能很强大
    "postcss-import": "^12.0.1",
    "postcss-loader": "^3.0.0",
    "postcss-pxtorem": "^4.0.1",
    "postcss-url": "^8.0.0",
    "url-loader": "^1.1.2",
    "vue": "^2.5.21",
    "vue-loader": "^15.4.2",
    "vue-router": "^3.0.2",
    "vue-style-loader": "^4.1.2",
    "vue-template-compiler": "^2.5.21",
    "vuex": "^3.0.1",
    "webpack": "^4.28.2",
    "webpack-cli": "^3.1.2",
    "webpack-dev-server": "^3.1.13"
  }
}
```


[github地址](https://github.com/atJiangBei/hometown-ui)