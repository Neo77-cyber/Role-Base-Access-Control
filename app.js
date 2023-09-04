const express = require('express')
require('dotenv').config()
require('express-async-errors')
const morgan = require('morgan')
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');


// Initialize app
const app = express()


app.use(express.json())
app.use(morgan('dev'));


const connectDB = require('./db/connect')


// Middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const authMiddleware = require('./middleware/authentication')
const ensureAdmin = require('./middleware/authorization')


// Route
const authroute = require('./routes/auth')
const getUsers = require('./routes/admin')


app.use('/api/v1', authroute)
app.use('/api/v1/admin', authMiddleware, ensureAdmin, getUsers)


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


// Security
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();

















