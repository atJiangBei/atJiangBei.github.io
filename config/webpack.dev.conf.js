const path = require("path");
const resolve = (url)=>path.resolve(__dirname,url);
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const config = require("./config.js");
const baseWebpackConfig = require('./webpack.base.conf');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = merge(baseWebpackConfig, {
	devServer: {
	    port: config.dev.port,
	    quiet: true,
	    host: '0.0.0.0',
	    compress: true,
	    overlay: true,
	    proxy: config.proxy
	},
	plugins:[
		new HtmlWebpackPlugin({
			template:resolve("./../index.html"),
			inject: true,
			chunks: ['index']
		}),
		new FriendlyErrorsWebpackPlugin({
			compilationSuccessInfo: {
				messages: [`You application is running here http://localhost:${config.dev.port}`],
			}
		}),
	]
})