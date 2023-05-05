const { sqlQuery, jsonFail, jsonSuccess, createCaptcha, password_hash, password_verify, remoteIp,
	ip2int, now, timestamp
} = require(global.S.BASE_DIR + '/tools');


exports.movie_list = function (req, res, next) {
	let page = req.query.page || 1

	var p = parseInt(page)
	if (isNaN(p)) {
		p = 1
	}

	let perPage = parseInt(process.env.LIST_PER_PAGE)

	let start = (p - 1) * perPage

	let currentPage = sqlQuery(
		"SELECT * FROM movie where thumb != '' ORDER BY site_id DESC LIMIT ? OFFSET ?",
		[perPage, start]
	)

	// total count
	let total = sqlQuery("select count(*) as count from movie where thumb != '' ")

	let top5 = sqlQuery("select * from movie where thumb != '' order by site_id desc limit 5")

	
	Promise.all([currentPage, total, top5])
	.then((results) => {
		let lst = results[0]  
		let cn = results[1]
		let top5 = results[2]

		var total = 0
		if (cn.length > 0 ) {
			total = cn[0].count
		}

		res.json({
			code: 200,
			data: {
				list: lst,
				top5: top5,
				page: {
					total_page: Math.ceil(total / perPage),
					page_size: perPage,
					current_page: page,
					total: total
				}
			}
		})
		console.log(values);
	})
	.catch(function (err) {
		next(err)
	});

}


exports.movie_detail = function(req, res, next) {
	var id = req.query.id || 0


	var id = parseInt(id)
	

	let detail = sqlQuery(
		"SELECT * FROM movie WHERE id=? LIMIT 1", 
		[id]
	)

	detail.then(function (movie) {
		res.json(jsonSuccess(movie.length == 0 ? null : movie[0]))
	})
	.catch(function (err) {
        next(err);
    });

}