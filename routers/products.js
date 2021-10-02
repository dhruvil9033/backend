const express = require('express')
const router = express.Router()
// const api = process.env.API_URL;
const Product = require('../models/product')

router.get(`/`, async (req, res) => {
    const productLIst = await Product.find();
    if (!productLIst) {
      res.status(500).json({
        success: false,
      });
    }
    res.send(productLIst);
  });
  
  router.post(`/`, (req, res) => {
    const product = new Product({
      name: req.body.name,
      image: req.body.image,
      countInStock: req.body.countInStock,
    });
  
    product
      .save()
      .then((createdProduct) => {
        res.status(201).json(createdProduct);
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
          success: false,
        });
      });
  });

module.exports = router