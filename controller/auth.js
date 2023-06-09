'use strict';
const express = require('express');
const router = express.Router();

const { User } = require('../models');

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error('User already exists');
      error.status = 409;
      throw error;
    }

    const hash = await User.hashPassword(password, 10);

    const newUser = new User({
      email,
      password: hash,
    });

    await newUser.save();

    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
