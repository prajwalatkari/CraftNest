const express = require('express');
const router = express.Router();
const { getCategories } = require('../controllers/productController');

router.get('/', getCategories);

module.exports = router;
