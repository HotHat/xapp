const { sqlQuery, jsonFail, jsonSuccess, createCaptcha, password_hash, password_verify, remoteIp,
	ip2int, now, timestamp
} = require(global.S.BASE_DIR + '/tools');


exports.movie_list = function(req, res, next){

    res.json(jsonSuccess("dashboard"));
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