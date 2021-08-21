const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require("path");
const middleware = require("../middleware/user");
const formidable = require("formidable");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Member = mongoose.model("Member");
const EventAttendee = require("../models/eventattendee");

var csv = require('fast-csv');



router.post("/api/csvparse/:ver",middleware,async (req,res)=>{
    const id = req.params.ver;
    const user = await User.findById(id).exec();
 var form = new formidable.IncomingForm();
 if(user.isAdmin === true){
 form.parse(req, function(err, fields, files){
    var oldPath = files.file.path;
    var event = fields.event;
    event = event.toUpperCase();
    var strDate = fields.date + 'T00:00:00';
    var endDate = fields.date + 'T23:59:59';
    var string = "events."+ fields.event;
    var newPath =path.join(
                     __dirname,
                    "..",
                    "uploads",
                    "csv-" + files.file.name
                  );
    var rawData = fs.readFileSync(oldPath)
  
    fs.writeFile(newPath, rawData,async function(err){
        if(err) console.log(err)
        else {console.log(strDate,endDate,event,newPath,"Uploaded");
        setTimeout(function () {
            fs.unlinkSync(newPath); // delete this file after 30 seconds
          }, 30000);
        await csv.parseFile(newPath ,{skipLines: 1})
          .on('data',async (data)=>{
            await EventAttendee.findOne({
                email: data,
                event: event,
                eventDate:{
                $gte: strDate, $lte: endDate
                }
            })
                    .then((savedUser)=>{
                        if(savedUser) {
                            User.updateOne({email:savedUser.email},{
                                $inc:{
                                    [`${string}`]: 1,
                                    "markoknowPoints" : 10, 
                                },

                            },function(err,result){
                                if(err)
                                    console.log(err);
                                else
                                    {console.log("events updated");
                                        Member.updateOne({email:savedUser.email},{
                                            $inc:{
                                                    "point" : 10,
                                                }
                                            },function(err,res1){
                                                if(err)
                                                    console.log(err);
                                                else
                                                    console.log("Points updated everywhere");
                                        }) 
                                    }
                                })
                            }
                        })
                        .catch(err=>{
                            console.log(err);
                        })
                    })
                }
            })
            if(err){
                res.json("error");
            }

        })
        res.status(200).json("ALL THINGS DONE");
    }
    else
    {
        res.status(422).json("You don't have access to pass this request");
    }
        
})

module.exports = router;