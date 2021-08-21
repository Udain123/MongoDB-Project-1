const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { transporter } = require("../keys/email_transporter");
const { JWT_SECRET } = require("../keys/key");
require("dotenv").config();

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    res.status(422).json({ message: "please Fill All the details" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        //if user alredy present
        res.status(422).json({ message: "user already exists" });
      }
      //hashing password
      else{
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          email,
          password: hashedpassword,
          name,
        });

        user
          .save()
          .then(async (user) => {
            //sending emails
            const emailToken = jwt.sign(
              { _id: user._id },
              process.env.JWT_EMAIL,
              {
                expiresIn: "1d",
              }
            );
            //token url
            const url = `${process.env.DOMAIN}/verify_signup_email/${emailToken}`;

            await transporter.sendMail(
              {
                from: process.env.EMAIL_USERNAME,
                to: email,
                subject: "Email Verification",
                html: `<div style="background-color: #525759; color: white">
                          <div
                            style="
                              margin: auto;
                              width: 80%;
                              border: 0px solid;
                              padding: 10px;
                              max-width: 500px;
                            "
                          >
                            <h3>hii ${name}!</h3>
                            <p>
                              Thank you for joining Markoknow community. Please verify your email address by
                              clicking on below link.
                            </p>
                            <div style="text-align: center; margin-bottom: 20%; font-size: 1.5rem">
                            <a href=${url}>
                              <button
                                  class="click_button"
                                  style="
                                    background-color: #c41d3c;
                                    height: 3rem;
                                    color: white;
                                    font-weight: bold;
                                    border-radius: 10px;
                                    cursor: pointer;
                                  "
                                  variant="contained"
                                  color="primary"
                                >
                                  VERIFY EMAIL
                                </button>
                            </a>
                              
                            </div>

                            <div>THANK YOU</div>
                            Markoknow
                          </div>
                       </div>`,
              },
              (err, info) => {
                if (err) {
                  //
                  console.log(err);
                } else {
                  console.log("email send : " + info.response);
                }
              }
            );

            res.json({ message: "Verification Email has been sent to your given email." });
          })
          .catch((err) => {
            console.log(err);
          });
      });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

//login
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  const { authorization } = req.headers;
  if (!email || !password) {
    res.status(203).json({ message: "Please provide email or password" });
  }
  User.findOne({ email: email })
  .then((savedUser) => {
    if (!savedUser) {
      //if email not present
      res.status(203).json({ message: "Invalid email" });
      //console.log("Invalid email or password");
    }
    else{
    if(savedUser.isVerified){
    bcrypt
      .compare(password, savedUser.password)
      .then((domatch) => {
        if (domatch) {
          //if password correct
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, markoknowPoints, isAdmin, eventNumber, email, office } = savedUser;
          res.status(200).json({ authorization, token, user: { _id, name, eventNumber, markoknowPoints, isAdmin, email, office } });
        } else {
          //if wrong password
          res.status(203).json({message: "Invalid Password" });
          console.log("Invalid Password")
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(422).json({message: "error occured" });
      });
      }
      else{
        res.status(203).json({message: "Email is not verified"})
      }
    }
  });
});

router.post("/verify_signup_email", (req, res) => {
  const token = req.body.token.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_EMAIL, (err, payload) => {
    if (err) {
      //if error then ->
      return res.status(401).json({ error: "error occured" });
    }
    //get id of token user -->
    const { _id } = payload;
    //update isVerified to true
    User.findByIdAndUpdate(_id, { isVerified: true }, (err, user) => {
      if (err) {
        //if errors
        console.log(err);
        return res.status(422).json({ message: "error occured !" });
      } else {
        // if success
        try {
          const { name } = user;
          res.status(200).json({ name: name });
        } catch {
          return res.status(422).json({ message: "error occured !" });
        }
      }
    });
  });
});

module.exports = router;