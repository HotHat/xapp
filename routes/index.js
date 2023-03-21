var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken')
var { expressjwt } = require("express-jwt");

let tools = require("../tools")


// router.use(
  // expressjwt({
  //   secret: process.env.JWT_SECRET,
  //   algorithms: ["HS256"],
  // }).unless({ path: ["/api/login", '/api'] })
// );


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


router.get('/login', function(req, res) {
  // console.log('jwt', process.env)
  // console.log('jwt', process.env.JWT_SECRET)
  let token = jwt.sign({id: 1, email: '119283@qq.com'}, process.env.JWT_SECRET, { expiresIn: '1h'})

  res.json(tools.jsonSuccess({
    token: token
  }))
  
});

router.get('/query', function(req, res, next) {
  const mysql = require('../mysql')
  
  mysql.conn.query('SELECT * from users limit 1', (err, rows, fields) => {
    if (err) {
      next(err)
      return
    }
  
    console.log('The solution is: ', rows)
    // console.log('The solution is: ', fields)
    res.json(tools.jsonSuccess({
      data: rows
    }));
  })
  
});




router.post('/vmess/add', function(req, res, next) {
  res.json({
    code: 200,
    data: {
      token: "298372893"
    }
  })
});



module.exports = router;
