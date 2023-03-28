const express = require('express');
const router = express.Router();
const format = require('date-format');

const adminController = require(global.S.BASE_DIR + '/controllers/admin/adminController')

// login auth
// router.use(
  // expressjwt({
  //   secret: process.env.JWT_SECRET,
  //   algorithms: ["HS256"],
  // }).unless({ path: ["/api/login", '/api'] })
// );


// admin operation route
router.get('/dashboard', adminController.dashboard)

router.get('/captcha', adminController.captcha)



router.post('/login', adminController.admin_login)

router.get('/user/list', adminController.user_list)
router.post('/user/add', adminController.add_user)




module.exports = router