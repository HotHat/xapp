
var express = require('express');
var router = express.Router();

router.get('/list', function(req, res, next) {
	console.log("user list")

	res.send("user list")
})

router.post('/add', function(req, res, next) {

	console.log("user add")
	res.send("user add")
})

module.exports = router