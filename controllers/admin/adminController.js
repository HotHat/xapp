const { sqlQuery, jsonFail, jsonSuccess, createCaptcha, password_hash, password_verify, remoteIp,
	ip2int, now, timestamp
} = require(global.S.BASE_DIR + '/tools');
const redis = require(global.S.BASE_DIR + '/redis');

const format = require('date-format');
const { v4: uuid } = require('uuid')
let jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('express-jwt');


exports.dashboard = function(req, res, next) {
    res.json(jsonSuccess("dashboard"));
}

exports.captcha = function (req, res, next) {
  let code = createCaptcha();

  let id = uuid();

  redis
    .set(id, code.text, {
      EX: 60,
      NX: true,
    })
    .then(function (v) {})
    .catch((err) => next(err));

  res.type("svg");
  res.set("Authorization", "Bearer " + id);
  res.set("Content-Type", "application/json");

  let bs =
    "data:image/svg+xml;base64," + Buffer.from(code.data).toString("base64");
  res.status(200).send({ code: 200, data: { url: bs } });
  res.end();
};

exports.user_list = function(req, res, next) {
	let page = req.query.page || 1

  var p = parseInt(page)
  if (isNaN(p))  {
    p = 1
  }

  let perPage = 2

  let start = (p-1) * perPage

	let currentPage = sqlQuery(
    "SELECT id,name,email,thumb,last_login_at,created_at FROM users ORDER BY id DESC LIMIT ? OFFSET ?", 
    [perPage, start]
  )

  // total count
  let total = sqlQuery("select count(*) as count from users ")

  // chain multiple query, just like Promise.all()
  currentPage.then(function(rows) {
    return new Promise(function(resolve, reject) {
      total.then(function(results) {
        resolve([rows, results])
      }).catch(function(err) {
        reject(err)
      })
    })
  }).then( function(results) {
		let lst = results[0]  
    let cn = results[1]
    var total = 0
    if (cn.length > 0 ) {
      total = cn[0].count
    }

		let result = []
		lst.forEach(function(it) {
			result.push({
				id: it.id,
				name: it.name,
				email: it.email,
				loginAt: it.last_login_at===0 ? "" : format("yyyy-MM-dd hh:mm:ss", new Date(it.last_login_at*1000)),
				createdAt: format("yyyy-MM-dd hh:mm:ss", it.created_at)
			})
		})

    res.json({
      code: 200,
      data: {
				list: result,
				page: {
					total_page: Math.ceil(total / perPage),
          page_size: perPage,
          current_page: page,
          total: total
				}
			}
    })
  })
}

exports.add_user = function(req, res, next) {
	let user = {
		name: req.body.name || '',
		email: req.body.email || '',
		password: req.body.password || ''
	}

	// 
	if (user.name == '' || user.email == '' || user.password == '') {
		res.json(jsonFail("数据不全"))
		return
	}

	user.password = password_hash(user.password)
	user.created_at = now()
	user.updated_at = now()

	// test duplicate id
	sqlQuery(
		"SELECT id FROM user WHERE email=? limit 1", [user.email]
	).then(function (rows) { 

		if (rows.length > 0 ) {
			res.json(jsonFail("email duplicate: " + user.email))
			return 
		}

		// insert data
		sqlQuery(
			"INSERT INTO users SET ?", user
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

}

exports.admin_login = function(req, res, next) {
  // console.log('jwt', process.env)
  // console.log('jwt', process.env.JWT_SECRET)
  var email = req.body.email || ''
  var password = req.body.password || ''
  var captcha = req.body.captcha || ''

  let auth = req.get('Authorization')
  if (!auth) {
    res.json(jsonFail("验证码错误", 401));
    return;
  }
  let token = auth.replace('Bearer ', '')
  
  let captchaCheck = new Promise(function (resolve, reject) {
    redis.get(token).then(function (tk) {
      if (!tk || tk.toLowerCase() != captcha.toLowerCase()) {
        reject('验证码错误')
      }
      // do next
      resolve(true)
    })
  }) 

  captchaCheck.then(function (val) {
    sqlQuery("select * from admin where email=?", [email])
      .then(function (rows) {
        if (rows.length == 0) {
          res.json(jsonFail("登录失败", 401));
          return;
        }

        let user = rows[0];

        if (!password_verify(password, user.password)) {
          res.json(jsonFail("密码错误", 401));
          return;
        }

        // update login info
        let ip = remoteIp(req);
        let ipint = ip2int(ip);
        let ts = timestamp();
        // console.log(ts)
        // console.log(ipint)
        sqlQuery(
          "UPDATE admin SET last_login_at=?, last_login_ip=? WHERE id=?",
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
				console.log('token', token)
        res.json(
          jsonSuccess({
            token: token,
            id: user.id,
            email: user.email,
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
}

function getAdminUserById(id) {
	return  new Promise(function (resolve, reject) {
		sqlQuery("SELECT * FROM admin WHERE id=?", [id]).then((rows) => {
			resolve(rows[0] || null)
		}).catch((err) => {
			reject(err)
		})
	});
}

exports.password_change = function(req, res, next) {
  var old_password = req.body.old_password || ''
  var new_password = req.body.new_password || ''
  var confirm_password = req.body.confirm_password || ''


	if (new_password !== confirm_password) {
		res.json(jsonFail("密码不匹配"))
		return 
	}
	
	if (new_password == "") {
		res.json(jsonFail("密码不能为空"))
		return 
	}


	let adminPromise = getAdminUserById(req.auth.id || '')


	let err = new Error("")
	err.status = 400
	adminPromise.then(function (user) {
		if (!user) {
			err.message = "未登录"
			next(err)
		}

		if (!password_verify(old_password, user.password)) {
      console.log("3333");
			err.message = "旧密码不匹配"
      next(err);
    } else {
      sqlQuery("UPDATE admin SET password=? WHERE id=?", [
        password_hash(new_password),
        user.id,
      ])
        .then(function (results) {
          res.json(jsonSuccess());
          // console.log('update user', results)
        })
        .catch(function (err) {
          next(err);
        });
    }
		
	}).catch(function (err) {
		next(err)
	})

}

