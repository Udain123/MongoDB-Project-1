const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const { transporter } = require("../../keys/email_transporter");
require("dotenv").config();

router.post("/forgetpassword", (req,res)=>{
    const {email} =  req.body;
    if(!email){
        res.status(203).json({message: "Input a email address"});
    }
    User.findOne({email: email})
        .then(async (savedUser)=>{
                if(!savedUser){
                    res.status(203).json({message: "Provide valid email address"});
                }else{
                        const token = crypto.randomBytes(20).toString('hex');
                        await User.updateOne({_id: savedUser._id},{
                          $set:{
                            "resetPasstoken": token,
                            "resetPassExpire": Date.now() + 3600000,}
                        },function(err,res){
                          if(!err)
                          console.log("updated");
                          else
                          console.log(err)
                        });
                        const url = `${process.env.DOMAIN}/resetpassword/${token}`;

                        await transporter.sendMail(
                            {
                              from: process.env.EMAIL_USERNAME,
                              to: email,
                              subject: "Reset Password Link",
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
                                          <h3>hii ${savedUser.name}</h3>
                                          <p>
                                          You are receiving this because you (or someone else) have requested the reset of the password for your account.<br/>
                                          Please click on the below button to complete the process within one hour of receiving it.
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
                }
            })
            .catch((err) => {
                console.log(err);
              });
});

module.exports = router;