const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require("path");
const middleware = require("../middleware/user");
const formidable = require("formidable");
const mongoose = require("mongoose");
const shortid = require('shortid');
const User = mongoose.model("User");
const EventModel = require("../models/eventlist");

var csv = require('fast-csv');

router.post("/api/eventupload/:ver",middleware,async (req,res)=>{
    const id = req.params.ver;
    const user = await User.findById(id).exec();
    const eventNum = shortid.generate();
 var form = new formidable.IncomingForm();
 if(user.isAdmin === true){
 form.parse(req, function(err, fields, files){
    var oldPath = files.file.path;
    var event = fields.event;
    var credit = fields.credit;
    var date = fields.date;
    var eventfee = fields.fee;
    var link = fields.link
    var newPath =path.join(
                     __dirname,
                    "..",
                    "eventUploads",
                    files.file.name
                  );
    var rawData = fs.readFileSync(oldPath)
  
    fs.writeFile(newPath, rawData,async function(err){
        if(err){ console.log(err); }
        else {console.log(event,credit,date,"Uploaded");
        const data = {
            event: event,
            credit: credit,
            eventNumber: eventNum,
            eventDate: date,
            eventfee: eventfee,
            posterPath: files.file.name,
            link: link,
        }
        
        let eventlist = new EventModel(data);
        eventlist
        .save()
        .then((response) => {
            console.log("Successfully uploaded")
        })
        .catch((err) => {
            console.log(err);
        });
      }
    })
    if(err){
        res.json("error");
    }

})
res.status(200).json("Event Created");
}
else
    {
        res.status(422).json("You don't have access to pass this request");
    }
        
});


router.get("/api/eventboard",middleware,(req,res) => {
    EventModel
      .find()
      .sort("date")
      .then((result)=>{
          res.status(200).json({result, message: "success"})
      })
      .catch((err) => {
        console.log(err);
        res.status(422).json({ message: "error" });
      })
  });


  router.get("/api/eventAbout",(req,res) => {
    EventModel
      .find()
      .sort("date")
      .limit(3)
      .then((result)=>{
          res.status(200).json({result, message: "success"})
      })
      .catch((err) => {
        console.log(err);
        res.status(422).json({ message: "error" });
      })
  });


module.exports = router;