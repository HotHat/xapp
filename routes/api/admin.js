const express = require('express');
const router = express.Router();
const format = require('date-format');
var { expressjwt } = require("express-jwt");

const adminController = require(global.S.BASE_DIR + '/controllers/admin/adminController')

// login auth
router.use(
  expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
  }).unless({ path: ["/api/panel/login", "/api/panel/captcha"] })
);


// admin operation route
router.get('/dashboard', adminController.dashboard)

router.get('/captcha', adminController.captcha)



router.post('/password/change', adminController.password_change)

router.post('/login', adminController.admin_login)

router.get('/user/list', adminController.user_list)
router.post('/user/add', adminController.add_user)
router.post('/user/change/password', adminController.user_change_password)
router.post('/user/change/status', adminController.user_status_change)




module.exports = router