const express = require("express");
const router = express.Router();
const middleware = require("../../middleware/user");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Member = mongoose.model("Member");
const EventAttendee = require("../../models/eventattendee");
const EventModel = require("../../models/eventlist");



router.post("/api/usepoint/:id2",middleware,async(req,res)=>{
    const id2 = req.params.id2;
    const {eventNum, userId, event, eventDate, credit,contact} = req.body;
    const eventDetail = await EventModel.findById(id2).exec();
    const link = eventDetail.link;
    User.findById(userId)
        .then(async (result)=>{
            if(result){
                const newPoint = result.markoknowPoints - credit;
                const eventNumber = result.eventNumber;
                eventNumber.push(eventNum);
                User.updateOne({_id:userId},{
                    $inc:{
                        "markoknowPoints": -credit,
                    },
                    $push:{
                        "eventNumber": eventNum,
                    }
                },function(err,res1){
                    if(err)
                        console.log(err);
                    else{
                        Member.updateOne({userId: userId},{
                            $set:{
                                "point": newPoint,
                            }
                        },function(err,res2){
                           if(err){
                               console.log(err);
                           } 
                           else{
                            let data = {
                                name: result.name,
                                email: result.email,
                                event: event,
                                eventDate: eventDate,
                                eventId: id2,
                                contact: contact,
                            }
    
                            let eventattendee = new EventAttendee(data);
                            eventattendee
                                .save()
                                .then((res3) => {
                                    res.status(200).json({newPoint,eventNumber,link});
                                  })
                                  .catch((err) => {
                                    console.log(err);
                                  });
                                }
                            })
                        }
                })
            }
        })
        .catch(err=>{
            console.log(err);
        });
        
});

module.exports = router;