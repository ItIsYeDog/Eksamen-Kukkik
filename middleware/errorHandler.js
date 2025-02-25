const errorHandler = (err, req, res, next) => {
    // Debug
    console.error(err.stack);

    // Custom error handlinger
    if (err.name === 'ValidationError') {
        return res.status(400).render('error', {
            statusCode: 400,
            error: 'Ugyldig input data'
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).render('error', {
            statusCode: 401,
            error: 'Ugyldig eller utløpt sesjon'
        });
    }

    // Default svar
    res.status(err.status || 500).render('error', {
        statusCode: err.status || 500,
        error: process.env.NODE_ENV === 'development' 
            ? err.message 
            : 'En uventet feil har oppstått'
    });
};

module.exports = errorHandler;