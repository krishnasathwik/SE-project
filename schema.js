// schema.js
const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures no two users have the same email
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true, // Ensures no two users have the same phone number
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true, // Ensures no two users have the same account number
  },
  accountBalance: {
    type: Number,
    default: 5000, // Sets the default account balance to 5000
  },
  role: {
    type: String,
    enum: ['employee', 'user'], // Limits the role to 'employee' or 'user'
    default: 'user', // Sets the default role to 'user'
  },
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
