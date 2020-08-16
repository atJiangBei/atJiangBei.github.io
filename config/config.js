'use strict'

const path = require('path')

module.exports = {
	dev: {
		port: 8022,
			proxyTable: {
				'/api': {
					target: '127.0.0.1:7001',
					ws: true,
					changeOrigin: true
				},
		},
    host: 'localhost', // can be overwritten by process.env.HOST
  }
}
		