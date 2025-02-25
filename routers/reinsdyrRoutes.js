const express = require('express');
const router = express.Router();
const { isAuth } = require('../middleware/authMiddleware');
const reinsdyrController = require('../controllers/reinsdyrController');

router.get('/register', isAuth, reinsdyrController.getRegisterPage);
router.post('/register', isAuth, reinsdyrController.registerReinsdyr);

module.exports = router;