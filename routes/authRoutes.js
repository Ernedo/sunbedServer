const express = require('express');
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticatetoken');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/getuser', authController.getUser);

module.exports = router;
