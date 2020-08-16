const path = require("path");
const resolve = (url)=>path.resolve(__dirname,url);
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const NODE_ENV = process.env.NODE_ENV
const isDev = NODE_ENV === 'development'
const devtool = isDev ? 'source-map' : 'none'
const loader = NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader';
const config = require("./config.js");
module.exports = {
	mode: NODE_ENV,
	entry:{
		index:resolve("./../src/main.js")
	},
	output:{
		path:resolve("./../dist"),
		filename:"js/[name][hash].js",
		publicPath:isDev?"/":'./'
	},
	module:{
		rules:[
			{
				test:/\.js/,
				exclude:/node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
				  limit: 10000,
				  name: path.posix.join('', 'img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.css/,
				use: [
				  loader,
				  "postcss-loader",
				  {
					loader: 'css-loader',
					options: {
					  sourceMap: isDev
					}
				  }
				]
			},
			{
				test: /\.less/,
				use: [
				  loader,
				  {
					loader: 'css-loader',
					options: {
					  sourceMap: isDev
					}
				  },
				  "postcss-loader",
				  "less-loader"
				]
			},
		]
	}
}