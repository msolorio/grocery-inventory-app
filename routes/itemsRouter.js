const express = require('express');

const router = express.Router({mergeParams: true});

const { item } = require('../models');

router.get('/items', (req, res) => {
	
});
