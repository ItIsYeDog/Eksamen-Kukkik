const express = require('express');
const router = express.Router();
const { isAuth } = require('../middleware/authMiddleware');
const transaksjonController = require('../controllers/transaksjonController');

router.post('/start', isAuth, transaksjonController.startTransaksjon);
router.post('/nyEierRespons', isAuth, transaksjonController.håndterNyEierRespons);
router.post('/endeligBekreftelse', isAuth, transaksjonController.håndterEndeligBekreftelse);
router.get('/mine', isAuth, transaksjonController.getMineTranaksjoner);
router.post('/velg-flokk', isAuth, transaksjonController.håndterValgAvFlokk);

module.exports = router;