'use strict';

require('dotenv').config();

require('../models/connectMongoose');

const fileJson = require('./products.json');
const { mongoose, Products, User } = require('../models');

main().catch(err => console.error(err));

async function main() {
  await initUsers();
  await initProducts();

  mongoose.connection.close();
}

async function initProducts() {
  try {
    const delet = await Products.deleteMany();
    console.log('Deleted:', delet);

    const chargedProducts = await Products.insertMany(fileJson);
    console.log('Loaded products from products.json:', chargedProducts);
  } catch (error) {
    console.log('Initialization failed:', error);
  }
}

async function initUsers() {
  const { deletedCount } = await User.deleteMany();
  console.log(`Deleted ${deletedCount} users.`);

  const result = await User.insertMany({
    email: 'admin@gmail.com',
    password: await User.hashPassword('123456'),
  });
  console.log(`Insert ${result.length} user${result.length > 1 ? 's' : ''}.`);
}
