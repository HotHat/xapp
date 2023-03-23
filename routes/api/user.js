
const express = require('express');
const router = express.Router();
const { sqlQuery } = require('../../tools');

router.get('/list', function(req, res, next) {
	let page = req.query.page || 1

  var p = parseInt(page)
  if (isNaN(p))  {
    p = 1
  }

  let perPage = 2

  let start = (p-1) * perPage

	let currentPage = sqlQuery(
    "SELECT id,name,email,thumb,created_at FROM users ORDER BY id DESC LIMIT ? OFFSET ?", 
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

    res.json({
      code: 200,
      data: {
				list: lst,
				page: {
					total_page: Math.ceil(total / perPage),
          page_size: perPage,
          current_page: page,
          total: total
				}
			}
    })
  })
})

router.post('/add', function(req, res, next) {
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
			res.json(jsonFail("email dupilate: " + user.email))
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

})

module.exports = router