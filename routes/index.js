var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken')
var { expressjwt } = require("express-jwt");
var format = require('date-format');

let tools = require("../tools");
const { ip2int,remoteIp, timestamp, now  } = require('../tools');
const { password_hash, password_verify  } = require('../tools');
const { sqlQuery, createCaptcha } = require('../tools');
const { jsonFail, jsonSuccess } = require('../tools');
const mysql = require('../mysql');
const redis = require('../redis');
const { v4: uuid } = require('uuid')


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
  var captcha = req.body.captcha || ''

  let auth = req.get('Authorization')
  let token = auth.replace('Bearer ', '')
  
  let captchaCheck = new Promise(function (resolve, reject) {
    redis.get(token).then(function (tk) {
      if (tk != captcha) {
        reject('验证码错误')
      }
      // do next
      resolve(true)
    })
  }) 

  captchaCheck.then(function (val) {
    sqlQuery("select * from users where email=?", [email])
      .then(function (rows) {
        if (rows.length == 0) {
          res.json(tools.jsonFail("登录失败", 401));
          return;
        }

        let user = rows[0];

        if (!password_verify(password, user.password)) {
          res.json(tools.jsonFail("密码错误", 401));
          return;
        }

        // update login info
        let ip = remoteIp(req);
        let ipint = ip2int(ip);
        let ts = timestamp();
        // console.log(ts)
        // console.log(ipint)
        sqlQuery(
          "UPDATE users SET last_login_at=?, last_login_ip=? WHERE id=?",
          [ts, ipint, user.id]
        )
          .then(function (results) {
            // console.log('update user', results)
          })
          .catch(function (err) {
            next(err);
          });

        let token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.json(
          jsonSuccess({
            token: token,
          })
        );
      })
      .catch(function (err) {
        next(err);
      });
  }).catch (function (err) {
      res.json(
          jsonFail(err)
      );
  });

    // let token = jwt.sign({id: 1, email: '119283@qq.com'}, process.env.JWT_SECRET, { expiresIn: '1h'})

  // res.json(tools.jsonSuccess({
  // token: token
  // }))
  
});

router.post('/vmess/add', function(req, res, next) {
    let vmess = {
      v : '2',
      ps: req.body.ps || '',
      add: req.body.add || '',
      port: req.body.port || '',
      uid: req.body.id || '',
      aid: req.body.aid || '',
      scy: req.body.scy || '',
      net: req.body.net || '',
      type: req.body.type || '',
      host: req.body.host || '',
      path: req.body.path || '',
      tls: req.body.tls || '',
      sni: req.body.sni || '',
      alpn: req.body.alpn || '',
      fp: req.body.ps || '',
      created_at: now(),
      updated_at: now(),
    }

    if (vmess.uid == '' || vmess.add == '' || vmess.port == '') {
        res.json(jsonFail("数据不全"))
        return
    }

    // test duplicate id
    sqlQuery(
      "SELECT id FROM vmess WHERE uid=? limit 1", [vmess.uid]
    ).then(function (rows) { 

      if (rows.length > 0 ) {
        res.json(jsonFail("id dupilate: " + vmess.uid))
        return 
      }

      // insert data
      sqlQuery(
        "INSERT INTO vmess SET ?", vmess
      ).then(function (results) { 

        res.json(jsonSuccess({
          id: results.insertId
        }))

      }).catch(function (err) {
        next(err)
      })

    }).catch(function (err) {
      next(err)
    })

    
})

router.get('/vmess/list', function(req, res, next) {
  let page = req.query.page || 1

  var p = parseInt(page)
  if (isNaN(p))  {
    p = 1
  }

  let perPage = 2

  let start = (p-1) * perPage

  // current page
  let currentPage = sqlQuery(
    "SELECT * FROM vmess ORDER BY id DESC LIMIT ? OFFSET ?", 
    [perPage, start]
  )

  // total count
  let total = sqlQuery("select count(*) as count from vmess")

  Promise.all([currentPage, total]).then(function (results) {
    let lst = results[0]  
    let cn = results[1]
    var total = 0
    if (cn.length > 0 ) {
      total = cn[0].count
    }

    res.json(jsonSuccess({
        list: lst,
        page: {
          total_page: Math.ceil(total / perPage),
          page_size: perPage,
          current_page: page,
          total: total
        }
    }))

  }).catch (function(err) {
    next(err)
  })

})


router.get('/vmess/url', function(req, res, next) {
  let id = req.query.id || ''

  sqlQuery(
    "SELECT v, ps, `add`, port, uid AS id, aid, scy, net, type, host, path, tls, sni, alpn, fp FROM vmess WHERE id=? limit 1", 
    [id]
  ).then(function (rows) {

      if (rows.length == 0) {
        res.json(jsonFail('not data'), 404)
        return
      }

      let row = rows[0]
      let str = JSON.stringify(row)
      let url = "vmess://" + Buffer.from(str).toString('base64')
      res.json(jsonSuccess({
          url: url
      }))


  }).catch(function (err) {
    next(err)
  })
})


router.get('/captcha', function(req, res, next) {
   let code = createCaptcha()

   let id = uuid()

   redis.set(id, code.text).then(function(v) {}).catch(err => next(err))

   res.type('svg')
   res.set('Authorization', 'Bearer ' + id)

   res.status(200).send(code.data)
   res.end()
})

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


router.get('/command', function(req, res, next) {
  const { spawn } = require('node:child_process');
  const ls = spawn('ls', ['-l', '/usree']);

  ls.stdout.on('data', (data) => {
    console.log("stdout:",  data);
    console.log(`stdout: ${data}`);
    res.json({
      code: 200,
      data: {
        token:  data.toString('utf8')
      }
    })
  });

  ls.stderr.on('data', (data) => {
    console.log("stdout:",  data);
    console.log(`stdout: ${data}`);
    res.json({
      code: 400,
      data: {
        data:  data.toString('utf8')
      }
    })
  });




  
});

router.get('/promise', function(req, res, next) {
  // current page
  let curentPage = sqlQuery(
    "SELECT * FROM vmess ORDER BY id DESC LIMIT ? OFFSET ?", 
    [2, 0]
  )

  // total count
  let total = sqlQuery("select count(*) as count from vmess")

  // chain multiple querys, just like Promise.all()
  curentPage.then(function(rows) {
    return new Promise(function(resolve, reject) {
      total.then(function(results) {
        resolve([rows, results])
      }).catch(function(err) {
        reject(err)
      })
    })
  }).then( function(results) {
    res.json({
      code: 200,
      data: results
    })
  })

  // new Promise(function(resolve, reject) {

  //   setTimeout(() => resolve(1), 1000);
  
  // }).then(function(result) {
  
  //   console.log(result); // 1
  
  //   return new Promise((resolve, reject) => { // (*)
  //     setTimeout(() => resolve(result * 2), 1000);
  //   });
  
  // }).then(function(result) { // (**)
  
  //   console.log(result); // 2
  
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => resolve(result * 2), 1000);
  //   });
  
  // }).then(function(result) {
  
  //   console.log(result); // 4
  //   res.json({
  //     code: 200,
  //     data: result
  //   })
  
  // });
})



module.exports = router;
