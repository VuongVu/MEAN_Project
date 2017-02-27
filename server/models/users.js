// Users Model
const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;
const db_config = require('../configs/database');
const bcrypt = require('bcryptjs');

// Users Schema
const UsersSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },  
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const Users = module.exports = mongoose.model(db_config.USERS_COLLECTION, UsersSchema);

module.exports.getAllUsers = (callback) => {
  Users.find({}, callback);
};

module.exports.getUserById = (id, callback) => {
  Users.findById(id, callback);
};

module.exports.getUserByUsername = (username, callback) => {
  const query = {
    username: username
  };

  Users.findOne(query, callback);
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;

    callback(null, isMatch);
  });
};

module.exports.addUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};
