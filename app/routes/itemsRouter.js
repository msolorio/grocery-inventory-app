const express = require('express');
const User = require('../models/user');
const router = express.Router({mergeParams: true});

router.get('/', (req, res) => {
	res.send(`hit ${req.originalUrl}`);
});

module.exports = router;