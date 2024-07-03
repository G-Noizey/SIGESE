const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../services/verifyToken');

router.post('/login', adminController.loginAdmin); 

module.exports = router;
