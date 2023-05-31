const express = require('express');
const router = express.Router();
const utils = require('../utils')
const tools = require('../modules/tools')

const user = require('./modules/user/index')


router.get('/', function (req, res) {
  // res.render('index', { title: '主页' });
  const time = utils.getNowDate()
  res.send('春风得意马蹄疾，一日看尽长安花，'+time)
});

router.get('/modify', user.modify);

// router.post('/reg', function (req, res) {
// });

router.get('/login', function (req, res) {
  res.send('login登录');
});

router.get('/addUser', user.addUser);

router.get('/userinfo', user.userinfo)

router.get('/getUserinfoById', user.getUserinfoById)

router.post('/upload', tools.multer().single('file'), user.upload)

module.exports = router;
