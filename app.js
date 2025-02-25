const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const defaultRoutes = require('./routers/defaultRoutes');
const authRoutes = require('./routers/authRoutes');
const userMiddleware = require('./middleware/userMiddleware');
const reinsdyrRoutes = require('./routers/reinsdyrRoutes');
const flokkRoutes = require('./routers/flokkRoutes');
const notFoundHandler = require('./middleware/notFoundHandler');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Global Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(userMiddleware);

// Routes
app.use('/', defaultRoutes);
app.use('/auth', authRoutes);
app.use('/reinsdyr', reinsdyrRoutes);
app.use('/flokk', flokkRoutes);

// Error handling (Må være sist)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});