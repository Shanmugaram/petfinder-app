const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const http = require("http");
const path = require('path');
const requestIp = require('request-ip');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require("express-rate-limit");

// Load environment variables
dotenv.config();

// Express app
const app = express();

// ✅ FIXED: CORS must allow your EC2 frontend
app.use(cors({
  origin: ['http://13.56.138.189:8081', 'http://localhost:4200'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  credentials: true
}));

// Security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginOpenerPolicy: { policy: "unsafe-none" },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Middleware setup
app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());
app.use(requestIp.mw());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // max requests per minute
  keyGenerator: req => req.clientIp
});
app.use(limiter);

// ✅ Load routes after middleware
const userRoutes = require('./app/routes/sresu.routes.js');

// Database init
const dbconfigconnection = require("./app/models/index.js");
dbconfigconnection();

// Default route
app.get("/", (req, res) => {
  res.json({ status: true, message: "Welcome to pet missing report management backend application." });
});

// ✅ Correct route prefix
app.use('/api/auth', userRoutes);

// ✅ Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '/app/routes/uploads')));

// Start server
const PORT = process.env.PORT || 3000;
let server = http.createServer(app);
server.listen(PORT, () => {
  console.log('HTTP Server running on port ' + PORT);
});

