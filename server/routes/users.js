const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Mongodb Config
const mongoose = require('mongoose');
const db_config = require('../configs/database');
const Users = require('../models/users');

// Generic error handler used by all endpoints.
let handleError = (res, reason, message, code) => {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({
    "error": message
  });
};

// GET all users
router.get('/', (req, res, next) => {
  // Find all existing users
  Users.getAllUsers((err, docs) => {
    if (err) {
      handleError(res, err.message, 'Failed to get users.');
    } else {
      res.status(200).json(docs);
    }
  });
});

// Register a user 
router.post('/register', (req, res, next) => {
  let user = new Users({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  // Register new user
  Users.addUser(user, (err, user) => {
    if (err) {
      handleError(res, err, 'Failed to register user.');
    } else {
      res.status(200).json({
        success: true,
        message: 'User has been registered.'
      });
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  Users.getUserByUsername(username, (err, user) => {
    if (err) {
      handleError(res, err, 'Failed to get user.');
    }

    if (!user) {
      return res.status(200).json({
        success: false,
        message: 'User not found.'
      });
    }

    if (password === undefined) {
      return res.status(200).json({
        success: false,
        message: 'Password null.'
      });
    }

    Users.comparePassword(password, user.password, (err, isMatch) => {
      if (err) {
        handleError(res, err);
      }

      if (isMatch) {
        const token = jwt.sign(user, db_config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.status(200).json({
          success: true,
          token: 'JWT ' + token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username
          }
        });
      } else {
        return res.status(200).json({
          success: false,
          message: 'Wrong password.'
        });
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.json({
    user: req.user
  });
});

module.exports = router;
