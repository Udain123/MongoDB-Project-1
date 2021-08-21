const express = require("express");
const router = express.Router();
// const middleware = require("../../middleware/user");
const mongoose = require("mongoose");
const Razorpay = require('razorpay');
const User = mongoose.model("User");
const Member = mongoose.model("Member");
const crypto = require('crypto');
const shortid = require('shortid');
const EventModel = require("../../models/eventlist");
const EventAttendee = require("../../models/eventattendee");
require("dotenv").config();

router.post('/api/orderpayment',async (req,res)=>{
    
    const {amount} = req.body;

    try {
        const instance = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID, 
          key_secret: process.env.RAZORPAY_SECRET, 
        });
    
        const options = {
          amount: amount*100,
          currency: 'INR',
          receipt: shortid.generate(),
        };
    
        const order = await instance.orders.create(options);
    
        if (!order) return res.status(500).send('Some error occured');
    
        res.json(order);
      } catch (error) {
        res.status(500).send(error);
      }
})

router.post('/api/paymentsuccess', async (req, res) => {
    try {
      const {
        orderCreationId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        event,
        eventDate,
        email,
        name,
        eventId,
        amount,
        userId,
      } = req.body;
      const eventDetail = await EventModel.findById(id2).exec();
      const link = eventDetail.link;
      const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;

      const shasum = crypto.createHmac('sha256', RAZORPAY_SECRET);
      shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
      const digest = shasum.digest('hex');
  
      if (digest !== razorpaySignature)
        return res.status(400).json({ msg: 'Transaction not legit!' });
  
      let data = {
            name: name,
            email: email,
            event: event,
            eventDate: eventDate,
            eventId: eventId,
      }

      let eventattendee = new EventAttendee(data);
      var string = "events."+ event.toLowerCase();
      await eventattendee.save();
      if(amount>0){
      User.findById(userId)
        .then((result)=>{
          if(result){
          User.updateOne({_id:result._id},{
               $inc:{
                  [`${string}`] : 1,
                  "markoknowPoints": 10,
               }
             },function(err,res2){
               if(err)
                  console.log(err);
               else
                  {
                    Member.updateOne({userId:result._id},{
                      $inc:{
                          "point": 10,
                      }
                    },function(err,res3){
                      if(err)
                      console.log(err);
                      else
                      console.log("Points updated everywhere");
                    }) 
                  }
             })
            }
        })
      }
      
      res.json({
        msg: 'success',
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        link
      });
    } catch (error) {
      res.status(500).send(error);
    }
  });

module.exports = router;