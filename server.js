// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const opn = require('opn');

// Mongoose
const mongoose = require('mongoose');
const db_config = require('./server/configs/database');

// Get our API routes
const users = require('./server/routes/users');

// Set up the express app
const app = express();

// Log request to the console.
app.use(morgan('dev'));

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Parser Cookie
app.use(cookieParser());

// Passport authentication middleware
app.use(passport.initialize());
app.use(passport.session());

// Import passport functions
require('./server/configs/passport')(passport);

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set favicon icon
app.use(favicon(path.join(__dirname, 'dist', 'favicon.ico')));

// Enable CORS
app.use(cors());

// Set our api routes
app.use('/api/users', users);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Development error handler will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// Production error handler no stack traces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

// Use connect method to connect to the Server
mongoose.connect(db_config.DB_URL, (err) => {
  // Error handle
  if (err) {
    console.log(`Unable to connect to the MongoDB server: ${err}`);
  } else {
    console.log('Connection established to', db_config.DB_URL);
  }
});

// Get port from environment and store in Express.
const port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port, () => {
  console.log(`API running on localhost: ${port}`);
  console.log('Press Ctrl+C to quit.');
});

// Opens the url in the default browser 
// opn('http://localhost:3000');
