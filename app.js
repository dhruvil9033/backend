const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const users = require("./routes/users");
const app = express();


// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").CONNECTION_STRING;

// Connect to MongoDB
mongoose
    .connect(
        db,
        { useNewUrlParser: true }
    )
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/users", users);


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));































// const express = require("express");
// const app = express();
// const morgan = require("morgan");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const passport = require("passport");
// const cors = require("cors");
// require("dotenv/config");
// const authJwt = require("./helpers/jwt");
// const errorHandler = require("./helpers/error-handler");
// app.use(cors());
// app.options("*", cors());
//
//
//
//
//
// //middleware
// app.use(express.json());
// app.use(morgan("tiny"));
// app.use(authJwt()); //use braces whenever we call any function app.use
// app.use(errorHandler);
// app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
//
//
//
// // Passport middleware
// app.use(passport.initialize());
// // Passport config
// // require("./config/passport")(passport);
//
//
//
//
// //this is moved in hadle js
// // app.use((err, req, res, next)=>{
// //   console.log(err)
// //   if(err){
// //     if (err.name === "UnauthorizedError") {
// //           // jwt authentication error
// //           return res.status(401).json({ message: "The user is not authorized" });
// //         }
//
// //         if (err.name === "ValidationError") {
// //           //  validation error
// //           return res.status(401).json({ message: err });
// //         }
// //     res.status(500).json({
// //       message: err
// //     })
// //   }
// // })
//
// //Routes
// // const categoriesRoutes = require("./routes/categories");
// // const productsRoutes = require("./routes/products");
// const usersRoutes = require("./routes/users");
// // const ordersRoutes = require("./routes/orders");
//
// const api = process.env.API_URL;
//
// // app.use(`${api}/categories`, categoriesRoutes);
// // app.use(`${api}/products`, productsRoutes);
// app.use(`${api}/users`, usersRoutes);
// // app.use(`${api}/orders`, ordersRoutes);
//
// const db = require("./config/keys").CONNECTION_STRING;
//
//
//
// //Database
// mongoose
//   .connect(db, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     dbName: "studentNetwork",
//   })
//   .then(() => {
//     console.log("Database Connection is OK");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
//
// //Server
// // app.listen(3000, () => {
// //   console.log("Server is running http://localhost:3000");
// // });
//
//
//  var server = app.listen(process.env.PORT || 5000,  ()=> {
//     var port = server.address().port;
//     console.log("server on "+ port);
//
//  });
// //
// // app.get('/express_backend', (req, res) => { //Line 9
// //     res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); //Line 10
// // }); //Line 11
