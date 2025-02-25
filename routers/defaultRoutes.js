const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get('/', (req, res) => {
    res.render('index.ejs');
});

router.get('/faq', (req, res) => {
    res.render('faq');
});

router.get('/search', searchController.search);

router.get('/kart', (req, res) => {
    res.render('kart');
});

router.get('/om', (req, res) => {
    res.render('om');
});

module.exports = router;

