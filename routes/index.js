var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken')
var { expressjwt } = require("express-jwt");
var format = require('date-format');

let tools = require("../tools");
const { timestamp } = require('../tools');
const { ip2int } = require('../tools');
const { remoteIp } = require('../tools');
const { password_hash } = require('../tools');
const { password_verify } = require('../tools');


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

  let now = format("yyyy-MM-dd hh:mm:ss", new Date())
  let ip = remoteIp(req)

  let user = {
    name: 'lyh02', 
    email: 'haha@qq.com', 
    password: password_hash('123456'), 
    thumb: '', 
    last_logon_at: timestamp(), 
    last_logon_ip: ip2int(ip), 
    created_at: now, 
    updated_at: now
  }

  console.log('ip: ', ip)
  console.log('user: ', user)

  mysql.conn.query('INSERT INTO users set ? ', user, (err, results, fields) => {
    if (err) {
      next(err)
      return
    } 

    console.log('Insert into users: ', results)

    res.json(tools.jsonSuccess({
      data: results
    }));
  })
  
  // mysql.conn.query('SELECT * from users limit 1', (err, rows, fields) => {
    // if (err) {
      // next(err)
      // return
    // } 
// 
    // let a = rows[0]
// 
    // console.log(format("yyyy-MM-dd hh:mm:ss", new Date(a.created_at)))
    // console.log(format("yyyy-MM-dd hh:mm:ss", new Date()))
  // 
    // console.log('select : ', rows)
    // console.log('The solution is: ', fields)
    // res.json(tools.jsonSuccess({
      // data: rows
    // }));
  // })

  console.log('outof callback: ')
  
});

router.get('/pw', function(req, res, next) {
  pw = '123456'

  h = password_hash(pw)
  console.log(h)
  
  res.json({
    code: 200,
    data: {
      check: password_verify('1234', h),
      check2: password_verify(pw, h) 
    }
  })
})


router.post('/vmess/add', function(req, res, next) {
  res.json({
    code: 200,
    data: {
      token: "298372893"
    }
  })
});



module.exports = router;
