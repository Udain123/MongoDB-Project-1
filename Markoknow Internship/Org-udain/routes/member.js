const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Member = mongoose.model("Member");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const { transporter } = require("../keys/email_transporter");
const middleware = require("../middleware/user");
require("dotenv").config();
const emailValidator = require('deep-email-validator');

async function isEmailValid(email) {
  return emailValidator.validate(email)
}

router.post("/membership", async (req,res) => {
    const {name, userId, designation, company, contact, email, linkedin, probono} = req.body;
    if(!name || !designation || !company || !contact || !email || !linkedin){
        res.status(422).json({error: "Please fill required fields."});
    }
    const user = await User.findById(userId).exec();
    const data = {
        userId: userId,
        name: name, 
        designation: designation, 
        about: user.bio,
        company: company, 
        contact: contact, 
        email: email, 
        linkedin: linkedin, 
        probono: probono,
        imagePath: user.imagePath,
        point: user.markoknowPoints,
    }
    
    const {valid, reason, validators} = await isEmailValid(email);
    if(valid || (reason === "smtp" && validators[reason].reason === "Timeout")){
    Member.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        //if user alredy present
        res.json({ error: "Member already exists" });
      }

      const member = new Member(data);

        member
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
            const url = `${process.env.DOMAIN}/verify_email/${emailToken}`;

            await transporter.sendMail(
              {
                from: process.env.EMAIL_USERNAME,
                to: process.env.EMAIL_USERNAME,
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
                            <h3>hii Admin!</h3>
                            <p>
                               Please go through this application and verify this for membership by
                              clicking on below link.
                            </p>
                            <p>
                            Name: ${name} <br>
                            Designation:  ${designation} <br>
                            Company: ${company} <br>
                            Contact:  ${contact} <br>
                            Email:  ${email} <br>
                            LinkedIn:  ${linkedin} <br>
                            Pro bono you can offer: ${probono} <br>
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

            res.json({ message: "saved succesfully" });
          })
          .catch((err) => {
            console.log(err);
          });
    })
    .catch((err) => {
      console.log(err);
    });
  }
  else{
    console.log("Email is invalid");
    res.json({message: "Please provide a valid email address.",
    reason: validators[reason].reason});
  }
});

router.post("/verify_email", (req, res) => {
  const token = req.body.token.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_EMAIL, (err, payload) => {
    if (err) {
      //if error then ->
      return res.status(401).json({ error: "error occured" });
    }
    //get id of token user -->
    const { _id } = payload;
    
    //update isVerified to true
    Member.findByIdAndUpdate(_id, { isVerified: true }, async (err, member) => {
      if (err) {
        //if errors
        console.log(err);
        return res.status(422).json({ message: "error occured !" });
      } else {
        // if success
        try {
          const { name, email } = member;
          const url = `${process.env.DOMAIN}/dashboard`;
          await transporter.sendMail(
            {
              from: process.env.EMAIL_USERNAME,
              to: email,
              subject: "Markoknow Verification",
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
                             You are now a member of Markoknow.
                             Don't reply on this mail.
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
                                  Go To Dashboard
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
          res.status(200).json({ name: name });
        } catch {
          return res.status(422).json({ message: "error occured !" });
        }
      }
    });
  });
});

router.get("/api/dashboard", (req,res) => {
  
  Member
    .find({isVerified: true})
    .sort("-date")
    .then((result)=>{
        res.status(200).json({result, message: "success"})
    })
    .catch((err) => {
      console.log(err);
      res.status(422).json({ message: "error" });
    })
});

router.post("/api/member/edit/:id",middleware,(req,res)=>{
  const {designation,company} = req.body;
  Member.findOne({userId:req.params.id})
            .then(async (result)=>{
                await Member.updateOne({_id:result._id},{
                    $set:{
                        "designation": designation,
                        "company": company,
                    }
                  },function(err,data){
                      if(err){
                          res.status(203).json({message:"not updated"});
                      }
                      else{
                          res.status(200).json({message:"updated"});
                      }
                })
            })
            .catch((err)=>{
                res.status(422).json({message:"not updated"});
                console.log(err);
            });
});

module.exports = router;