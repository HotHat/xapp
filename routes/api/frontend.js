const express = require('express');
const router = express.Router();
const format = require('date-format');
var { expressjwt } = require("express-jwt");
const cors = require('cors')

const movieController = require(global.S.BASE_DIR + '/controllers/frontend/movieController')

var corsOptions = {
    origin: 'http://127.0.0.1:5173',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


router.use(cors(corsOptions));

// movie module
router.get('/movie/list', movieController.movie_list)
router.get('/movie/detail', movieController.movie_detail)


module.exports = router