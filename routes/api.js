var express = require('express');
var router = express.Router();

router.use('/users', require('./user'));
router.use('/inbox', require('./messages'));
router.use('/mail', require('./mail'));
router.use('/listings', require('./listing'));
module.exports = router;
