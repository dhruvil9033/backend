const express = require("express");
const app = express();
require("dotenv/config");

const api = process.env.API_URL;
const morgan = require("morgan");
const mongoose = require("mongoose");

//Middleware
app.use(express.json());
app.use(morgan("tiny"));

const productSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: true,
  },
});
const Product = mongoose.model("Product", productSchema);

app.get(`${api}/products`, async (req, res) => {
  const productLIst = await Product.find();
  if (!productLIst) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(productLIst);
});

app.post(`${api}/products`, (req, res) => {
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

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "milkapp-database",
  })
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(3000, () => {
  console.log("App running on port 3000");
  //   console.log(api);
});
