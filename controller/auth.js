'use strict';
const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const { User } = require('../models');
const jwtAuth = require('../lib/jwtAuth');

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

    const role = user.role;

    jwt.sign(
      { _id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' },
      (err, jwtToken) => {
        if (err) {
          next(err);
          return;
        }
        res.status(200).json({ success: true, token: jwtToken });
      },
    );
  } catch (err) {
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, birthdate } = req.body;
    console.log(email, password, name, birthdate);

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
      name,
      birthdate,
    });

    await newUser.save();

    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.get('/getUser', jwtAuth, async (req, res, next) => {
  const { _id, role } = req.user;
  res.json({ userId: _id, userRole: role });
});

router.get('/:id', jwtAuth, async (req, res, next) => {
  const userId = req.params.id;

  if (req.user._id.toString() !== userId) {
    console.log(req.user._id, userId);
    // El usuario no tiene permisos para acceder a los datos de otro usuario
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.put('/users/:id', jwtAuth, async (req, res, next) => {
  const userId = req.params.id;
  const { _id } = req.user;

  if (_id.toString() !== userId) {
    // El usuario no tiene permisos para modificar los datos de otro usuario
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
