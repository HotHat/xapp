const redis = require('redis')

const client = redis.createClient({
	socket: {
		port: process.env.REDIS_PORT,
		host: process.env.REDIS_HOST,
	},
	// username: '',
	// password: ''
})

client.on('error', err => {
	console.log("Redis Client Error", err)
})

client.connect();


module.exports =  client