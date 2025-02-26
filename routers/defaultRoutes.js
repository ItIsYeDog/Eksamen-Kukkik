const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const searchController = require('../controllers/searchController');

router.get('/', homeController.getHomePage);
router.get('/search', searchController.search);
router.get('/faq', (req, res) => res.render('faq'));
router.get('/kart', (req, res) => res.render('kart'));
router.get('/om', (req, res) => res.render('om'));

module.exports = router;