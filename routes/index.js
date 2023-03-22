var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken')
var { expressjwt } = require("express-jwt");
var format = require('date-format');

let tools = require("../tools");
const { ip2int,remoteIp, timestamp  } = require('../tools');
const { password_hash, password_verify  } = require('../tools');
const { sqlQuery } = require('../tools');
const mysql = require('../mysql')


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


router.post('/login', function(req, res, next) {
  // console.log('jwt', process.env)
  // console.log('jwt', process.env.JWT_SECRET)
  var email = req.body.email || ''
  var password = req.body.password || ''

  sqlQuery('select * from users where email=?', [email]) 
  .then(function (rows) {

    if (rows.length == 0) {
      res.json(tools.jsonFail('登录失败', 401))
      return 
    }

    let user = rows[0]

    console.log('pw', password)
    console.log('upw', user.password)
    console.log('user', user)
    if (!password_verify(password, user.password)) {
      res.json(tools.jsonFail('密码错误', 401))
      return 
    }

    // update login info
    let ip = remoteIp(req)
    let ipint = ip2int(ip) 
    let ts = timestamp()
    sqlQuery(
      "update users set last_login_at=? and last_login_ip=? where id=?", 
      [ts, ipint, user.id]
    ).then(function (results) { 
      // console.log('update user', results)
    }).catch(function (err) {
      next(err)
    })

    let token = jwt.sign({id: 1, email: user.email}, process.env.JWT_SECRET, { expiresIn: '1h'})

    res.json(tools.jsonSuccess({
      token: token
    }))

  }).catch(function (err) {
    next(err)
  })

  // let token = jwt.sign({id: 1, email: '119283@qq.com'}, process.env.JWT_SECRET, { expiresIn: '1h'})

  // res.json(tools.jsonSuccess({
  // token: token
  // }))
  
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

router.post('/pa', function(req, res, next) {
  console.log(req.params)
  res.json({
    code: 200,
    data: req.params,
    body: req.body,
    qu: req.query
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
