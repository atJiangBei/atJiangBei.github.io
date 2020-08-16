const path = require("path");
const resolve = (url)=>path.resolve(__dirname,url);
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyPlugin = require("copy-webpack-plugin");
module.exports = merge(baseWebpackConfig, {
	mode:"production",
	plugins:[
		new CleanWebpackPlugin(),
		new CopyPlugin({
		      patterns: [
		        {
					from: resolve('./../static'),
					to: resolve('./../dist/'),
					globOptions: {
					        ignore: ['*'],
					    },
				},
		      ],
		    }),
		// new CopyWebpackPlugin({
		// 	patterns: [
		// 	        {
		// 	          from: path.resolve(__dirname, './../static'),
		// 	          to: path.resolve(__dirname, './../dist'),
		// 	        }
		// 	]
		// })
	]
})
