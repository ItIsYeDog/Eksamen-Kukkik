const notFoundHandler = (req, res) => {
    res.status(404).render('error', {
        statusCode: 404,
        error: 'Siden ble ikke funnet'
    });
};

module.exports = notFoundHandler;