const express = require('express');
const router = express.Router();
const format = require('date-format');
var { expressjwt } = require("express-jwt");

const movieController = require(global.S.BASE_DIR + '/controllers/frontend/movieController')


// movie module
router.get('/movie/list', movieController.movie_list)
router.get('/movie/detail', movieController.movie_detail)


module.exports = router