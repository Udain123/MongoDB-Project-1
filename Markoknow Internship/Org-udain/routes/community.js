const router = require("express").Router();
const mongoose = require("mongoose");
const middleware = require("../middleware/user");
const User = mongoose.model("User");
CheckModel = require("../models/community");

router.post("/bookevent", middleware, async (req, res) => {
    const { userId, mobileNumber, checkbox } = req.body;
    if ( !userId || !mobileNumber || !checkbox) {
      return res.status(422).json({ message: "provide all field" });
    }

    const user = await User.findById(userId).exec();
    const data = {
      userId: userId,
      mobileNumber: mobileNumber,
      checkbox: checkbox,
      email: user.email,
    }

    let checkmodel = new CheckModel(data);
    checkmodel
      .save()
      .then((Checkvalue) => {
        res.status(200).json({ Checkvalue: "Information added successfully" });
      })
      .catch((err) => {
        res.status(400).send("unable to save to database");
      });
  });

  module.exports = router;