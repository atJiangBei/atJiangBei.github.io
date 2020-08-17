const path = require("path");
const resolve = (url)=>path.resolve(__dirname,url);
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
process.env.NODE_ENV = "production";
module.exports = merge(baseWebpackConfig, {
	mode:"production",
	plugins:[
		new CleanWebpackPlugin(),
		new CopyPlugin({
		      patterns: [
		        {
					from: resolve('./../static'),
					to: resolve('./../dist/static/'),
					globOptions: {
					        ignore: ['*'],
					    },
				},
		      ],
		    }),
		new MiniCssExtractPlugin({
		      // Options similar to the same options in webpackOptions.output
		      // all options are optional
		      filename: 'css/[name].[hash].css',
		      chunkFilename: '[id].css',
		      ignoreOrder: false // Enable to remove warnings about conflicting order
		    }),
		new HtmlWebpackPlugin({
			template:resolve("./../index.html"),
			inject: true,
			chunks: ['index']
		}),
		new OptimizeCssAssetsPlugin()
	]
})
