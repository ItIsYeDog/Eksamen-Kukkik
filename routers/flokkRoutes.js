const express = require('express');
const router = express.Router();
const { isAuth } = require('../middleware/authMiddleware');
const flokkController = require('../controllers/flokkController');

router.get('/register', isAuth, flokkController.getRegisterPage);
router.post('/register', isAuth, flokkController.registerFlokk);
router.get('/:id', isAuth, flokkController.getFlokkDetails);

module.exports = router;