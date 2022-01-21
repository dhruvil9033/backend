const User = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const sendEmail = require("../utils/sendEmail");

router.post("/register", async (req, res) => {
  // Form validation
  //   const { errors, isValid } = validateRegisterInput(req.body);
  // // Check validation
  //   if (!isValid) {
  //     return res.status(400).json(errors);
  //   }
  User.findOne({ email: req.body.email }).then(async (user) => {
    if (user) {
      console.log("email already exist");
      // return res.json({)
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });
      // Hash password before saving in database
      //       bcrypt.genSalt(10, (err, salt) => {
      //         bcrypt.hash(newUser.password, salt, (err, hash) => {
      //           if (err) throw err;
      //           newUser.password = hash;
      console.log("before");
      //       console.log("after");
      await newUser.save();
      await sendEmail(
        req.body.email,
        "Register Successfully",
        "Welcome to Student Network..."
      );
      return res.json({ status: true, user });
      // .then(user => res.json({status: true, user}))
      // .catch(err => console.log(err));
      // res.redirect("http://localhost:3000/login");

      // });
      // });
    }
  });
  // await sendEmail(req.body.email, "Register Successfully", "Welcome to Student Network...")
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    // const secret = process.env.secret;
    if (!user) {
      console.log(req.body.email);
      return res.status(400).send("The user not found");
    }

    if (
      user &&
      user.password == req.body.password

      // bcrypt.compareSync(req.body.password.toString(), user.passwordHash)
    ) {
      // res.json({ status: true})
      // res.redirect("http://localhost:3000/home1");
      res.status(200).json(user);
      // const token = jwt.sign(
      //     {
      //       userId: user.id,
      //       // isAdmin: user.isAdmin,
      //     },
      //     secret,
      //     {
      //       expiresIn: "1d",
      //     }
      // );
      // res.status(200).send({ user: user.email, token: token });
    } else {
      res.status(400).send("password is wrong!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//reset password
router.post("/forgotpassword", async (req, res) => {
  User.findOne({ email: req.body.email }).then(async (user) => {
    if (user) {
      const link = `http://localhost:3000/reset?email=${req.body.email}`;
      await sendEmail(
        req.body.email,
        "Here Is Your Password Reset Link!!",
        link
      );
      return res.json({ status: true, email: req.body.email });
    } else {
      return res.json({ status: false });
    }
  });
});

//update Password
router.put("/resetpassword", async (req, res) => {
  User.findOne({ email: req.body.email }).then(async (user) => {
    if (user) {
      user.password = req.body.password;
      await user.save();
      return res.json({ status: true, msg: "Account Updated Succesfully..." });
    } else {
      // console.log("email doesn't exist");
      return res.status(400).json({ msg: "Account not Matched.." });
    }
  });
});

//update user
// router.put("/:id", async (req, res) => {
//   if (req.body.userId === req.params.id || req.body.isAdmin) {
//     if (req.body.password) {
//       try {
//         const salt = await bcrypt.genSalt(10);
//         req.body.password = await bcrypt.hash(req.body.password, salt);
//       } catch (err) {
//         return res.status(500).json(err);
//       }
//     }
//     try {
//       const user = await User.findByIdAndUpdate(req.params.id, {
//         $set: req.body,
//       });
//       res.status(200).json("Account has been updated");
//     } catch (err) {
//       return res.status(500).json(err);
//     }
//   } else {
//     return res.status(403).json("You can update only your account!");
//   }
// });

//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

//get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow a user

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});

// router.get(`/`, async (req, res) => {
//   const userList = await User.find().select("-passwordHash");
//
//   if (!userList) {
//     res.status(500).json({ success: false });
//   }
//   res.send(userList);
// });
// router.get("/:id", async (req, res) => {
//   const user = await User.findById(req.params.id).select("-passwordHash");
//
//   if (!user) {
//     res
//       .status(500)
//       .json({ message: "The user with the given ID was not found." });
//   }
//   res.status(200).send(user);
// });
// router.post("/", async (req, res) => {
//   let user = new User({
//
//     // passwordHash: bcrypt.hashSync(req.body.password.toString(), 10), //? null safety
//     // phone: req.body.phone,
//     // isAdmin: req.body.isAdmin,
//     // street: req.body.street,
//     // apartment: req.body.apartment,
//     // zip: req.body.zip,
//     // city: req.body.city,
//     // country: req.body.country,
//   });
//   user = await user.save();
//
//   if (!user) return res.status(400).send("the user cannot be created!");
//
//   res.status(200).send(user);
// });
// // router.put("/:id", async (req, res) => {
// //   const userExist = await User.findById(req.params.id);
// //   let newPassword;
// //   if (req.body.password) {
// //     newPassword = bcrypt.hashSync(req.body.password, 10);
// //   } else {
// //     newPassword = userExist.passwordHash;
// //   }
// //
// //   // const user = await User.findByIdAndUpdate(
// //   //   req.params.id,
// //   //   {
// //   //     name: req.body.name,
// //   //     email: req.body.email,
// //   //     passwordHash: newPassword,
// //   //     phone: req.body.phone,
// //   //     isAdmin: req.body.isAdmin,
// //   //     street: req.body.street,
// //   //     apartment: req.body.apartment,
// //   //     zip: req.body.zip,
// //   //     city: req.body.city,
// //   //     country: req.body.country,
// //   //   },
// //   //   { new: true }
// //   // );
// //
// //   if (!user) return res.status(400).send("the user cannot be created!");
// //
// //   res.send(user);
// // });

// router.post("/register", async (req, res) => {
//   let user = new User({
//     fname: req.body.fname,
//     lname: req.body.lname,
//     email: req.body.email,
//     role: req.body.role,
//     password: req.body.pwd,
//     // name: req.body.name,
//     // email: req.body.email,
//     // passwordHash: bcrypt.hashSync(req.body.password.toString(), 10), //? null safety
//     // phone: req.body.phone,
//     // isAdmin: req.body.isAdmin,
//     // street: req.body.street,
//     // apartment: req.body.apartment,
//     // zip: req.body.zip,
//     // city: req.body.city,
//     // country: req.body.country,
//
//   });
//   console.log(req.body.fname);
//   user = await user.save();
//
//   if (!user) return res.status(400).send("the user cannot be created!");
//
//   res.send(user);
// });
//
// // router.delete("/:id", (req, res) => {
// //   User.findByIdAndRemove(req.params.id)
// //     .then((user) => {
// //       if (user) {
// //         return res
// //           .status(200)
// //           .json({ success: true, message: "the user is deleted!" });
// //       } else {
// //         return res
// //           .status(404)
// //           .json({ success: false, message: "user not found!" });
// //       }
// //     })
// //     .catch((err) => {
// //       return res.status(500).json({ success: false, error: err });
// //     });
// // });
//
// // router.get(`/get/count`, async (req, res) => {
// //   const userCount = await User.countDocuments();
// //   console.log(userCount);
// //   if (!userCount) {
// //     res.status(500).json({ success: false });
// //   }
// //   res.send({
// //     userCount: userCount,
// //   });
// // });
module.exports = router;
