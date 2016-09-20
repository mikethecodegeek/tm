var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', (req,res)=> {
    res.redirect(path.resolve('dashboard/dashboard.html'));
});

module.exports = router;
