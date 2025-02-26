const express = require('express');
const router = express.Router();
const { isAuth } = require('../middleware/authMiddleware');
const reinsdyrController = require('../controllers/reinsdyrController');

router.get('/register', isAuth, reinsdyrController.getRegisterPage);
router.post('/register', isAuth, reinsdyrController.registerReinsdyr);
router.delete('/:id', isAuth, reinsdyrController.deleteReinsdyr);
router.post('/intern-overforing', isAuth, reinsdyrController.internOverforing);

module.exports = router;