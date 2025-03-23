const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const {xss} = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

dotenv.config({ path: './config/config.env' });

connectDB();
const app = express();
app.use(express.json());

// CORS configuration
const allowedOrigins = ["http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));  // CORS middleware should be above routes

// Security and sanitization middlewares
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(rateLimit({
  windowMs: 10 * 60 * 1000,  // 10 min
  max: 10000
}));
app.use(hpp());
app.use(cookieParser());

// Routes
const campgrounds = require('./routes/campgrounds');
const appointments = require('./routes/appointments');
const auth = require('./routes/auth');

app.use('/api/v1/campgrounds', campgrounds);
app.use('/api/v1/appointments', appointments);
app.use('/api/v1/auth', auth);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});
