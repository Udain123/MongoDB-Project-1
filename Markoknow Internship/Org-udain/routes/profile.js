const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Member = mongoose.model("Member");
const fileupload = require("express-fileupload");
const path = require("path");
const middleware = require("../middleware/user");
require("dotenv").config();





router.get("/api/profile/:id",middleware,(req,res) => {
    User
      .findById(req.params.id)
      .then((result)=>{
          res.status(200).json({result, message:"success"});
      })
      .catch((err)=>{
          res.status(203).json({message: "error"});
      });
      
});

router.post("/api/profile/edit/:id",middleware,(req,res)=>{
    const {bio} = req.body;
    User.findById(req.params.id)
              .then(async (result)=>{
                  await User.updateOne({_id:result._id},{
                      $set:{
                          "bio": bio,
                      }
                    },function(err,data){
                        if(err){
                            res.status(203).json({message:"not updated"});
                        }
                        else{
                            Member.updateOne({userId:result._id},{
                                $set:{
                                    "about": bio,
                                }
                            },function(err,res1){
                                if(err){
                                    res.status(203).json({message:"not updated"});
                                }
                                else{
                                    res.status(203).json({message:"updated"});
                                }
                            })
                        }
                  })
              })
              .catch((err)=>{
                  res.status(422).json({message:"not updated"});
                  console.log(err);
              });
});

router.post("/api/uploadpic/:id",fileupload(),(req,res)=>{
    let fileImg = req.files.imagePath; 
       if(fileImg.mimetype === "image/png" || fileImg.mimetype === "image/jpeg"){
           User.findById(req.params.id)
                .then((result)=>{
                    var newPath =path.join(
                        __dirname,
                       "..",
                       "imageUploads",
                       "IMG-" + req.files.imagePath.name
                     );
                    fileImg.mv(newPath,function(err){
                        if(err)
                            console.log(err,"error while creating file")
                        else{
                            User.updateOne({_id:result._id},{
                                $set:{
                                    "imagePath": "IMG-"+fileImg.name,
                                }
                            },function(err,res1){
                                if(err)
                                    console.log("Updation error")
                                else
                                   {  
                                    Member.updateOne({userId:result._id},{
                                          $set:{
                                              "imagePath": "IMG-"+fileImg.name,
                                          }
                                      },function(err,res2){
                                          if(err)
                                          console.log(err);
                                          else
                                          console.log("Updated Both");
                                      }) 
                                   }
                            })
                        }

                    })
                })
                .catch(err=>{
                    console.log(err);
                    res.status(422).json({message:"Error while Uploading image"});
                });
            res.status(200).json({message: "photo uploaded"});
       } 
       else{
           res.status(203).json({message:"wrong format"});
       }
    });
    


module.exports = router;