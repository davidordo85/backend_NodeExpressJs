'use strict';

require('dotenv').config();

require('../models/connectMongoose');

const fileJson = require('./products.json');
const Products = require('../models/Products');

async function initDB() {
  try {
    const delet = await Products.deleteMany();
    console.log('Deleted:', delet);

    const chargedProducts = await Products.insertMany(fileJson);
    console.log('Loaded products from products.json:', chargedProducts);
  } catch (error) {
    console.log('Initialization failed:', error);
  }
}

initDB().catch(err => {
  console.log(err);
});
