const path = require("path");
const resolve = (url)=>path.resolve(__dirname,url);
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const NODE_ENV = process.env.NODE_ENV
const idDev = NODE_ENV === 'development'
const devtool = idDev ? 'source-map' : 'none'
const loader =
  NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader';
const config = require("./config.js");
module.exports = {
	mode: NODE_ENV,
	entry:{
		index:resolve("./../src/main.js")
	},
	output:{
		path:resolve("./../dist"),
		filename:"js/[name][hash].js",
		publicPath:"./"
	},
	module:{
		rules:[
			{
				test:/\.js$/,
				exclude:/node_modules/,
				use:{
					loader:"babel-loader",
					options:{
						presets:["@babel/preset-env"]
					}
				},
			},
			{
				test:/\.(png|gif|jpg)/,
				exclude:/node_modules/,
				use:{
					loader:"file-loader",
					options:{
						outputPath:"img"
					}
				}
			},
			{
				test: /\.css/,
				use: [
				  loader,
				  {
					loader: 'css-loader',
					options: {
					  sourceMap: idDev
					}
				  }
				]
			},
		]
	},
	plugins:[
		new HtmlWebpackPlugin({
			template:resolve("./../index.html")
		}),
		new CleanWebpackPlugin(),
		
	]
}