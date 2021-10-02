const express = require("express");
const app = express();
require("dotenv/config");
const mongoose = require("mongoose");
const api = process.env.API_URL;
const morgan = require("morgan");
const productsRouter = require('./routers/products');

//Middleware
app.use(express.json());
app.use(morgan("tiny"));

//Routers

app.use(`${api}/products`,productsRouter)
const Product = require('./models/product')

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
