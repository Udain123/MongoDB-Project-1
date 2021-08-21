const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const { transporter } = require("../../keys/email_transporter");
require("dotenv").config();

router.get("/reset",(req,res,next)=>{
    console.log(req.query.resetPasstoken);
   User.findOne({
           "resetPasstoken": req.query.resetPasstoken,
           "resetPassExpire": {
               $gt: Date.now(),
       },
   })
   .then((user)=>{
       if(!user){
           console.log("error");
           res.json('Password reset link is invalid or expired');
       }else{  
        res.status(200).send({
               email: user.email,
               message: "password reset link a-ok",
           });
       }
   });   
});

router.post("/api/updatepassword",(req,res,next)=>{
    User.findOne({email: req.body.email})
        .then(user => {
            if(user){
                bcrypt.hash(req.body.password,12)
                .then(hashpass => {
                    User.updateOne({_id: user._id},{
                        $set:{
                          "password":hashpass,
                          "resetPasstoken": null,
                          "resetPassExpire": null,}
                      },function(err,res){
                          if(!err)
                          console.log("updated data");
                          else
                          console.log("error");
                      });
                })
                .then(()=>{
                   res.status(200).send({message:"password updated"});
                   console.log("updated succesfully"); 
                })
            }else{
                res.status(203).json({message:"No user exist"});
                console.log("No user");
            }
        });
});

module.exports = router;