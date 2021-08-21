const express = require("express");
const router = express.Router();
//const jwt = require("jsonwebtoken");
const formidable = require("formidable");
const fs = require('fs');
const path = require("path");
//var csv = require('fast-csv');'
const { transporter } = require("../../keys/email_transporter");
//const middleware = require("../../middleware/user");
require("dotenv").config();

router.post('/api/partnershipform',(req,res)=>{
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        var oldPath = files.file.path;
        var fullname = fields.FullName;
        var org = fields.Org;
        var desig = fields.Desig;
        var contact = fields.Contact;
        var mail = fields.Mail;
        var about1 = fields.About1;
        var about2 = fields.About2;
        var formType = fields.FormType;
        var sub = formType === "organise" ? "Organising Event Application" : "Sponsoring Event Application";
        var body = formType === "organise" ? (`<div style="background-color: #525759; color: white">
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
             Please go through this application and verify this for Organising Event.
          </p>
          <p>
          Name: ${fullname} <br>
          Organisation: ${org} <br>
          Designation:  ${desig} <br>
          Contact:  ${contact} <br>
          Mail ID:  ${mail} <br>
          What event you want to Organise with use?:  ${about1} <br>
          Anything Else: ${about2} <br>
          </p>


          <div>THANK YOU</div>
          Markoknow
        </div>
     </div>`) : 
     (`<div style="background-color: #525759; color: white">
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
          Please go through this application and verify this for Sponsoring Event.
       </p>
       <p>
       Name: ${fullname} <br>
       Organisation: ${org} <br>
       Designation:  ${desig} <br>
       Contact:  ${contact} <br>
       Mail ID:  ${mail} <br>
       How do you want to sponsor our events?:  ${about1} <br>
       What do you want to achieve by sponsoring our events?: ${about2} <br>
       </p>


       <div>THANK YOU</div>
       Markoknow
     </div>
  </div>`) ;
        var newPath =path.join(
            __dirname,
           "..",
           "..",
           "organisedoc",
           files.file.name
         );
        var rawData = fs.readFileSync(oldPath);

        fs.writeFile(newPath, rawData,async function(err){
            if(err){
                res.status(500).json(err);
                console.log(err);
            }
            else{
                await transporter.sendMail(
                    {
                      from: process.env.EMAIL_USERNAME,
                      to: process.env.EMAIL_USERNAME,
                      subject: `${sub}`,
                      html: body,
                        attachments: [
                                {
                                  filename: files.file.name,
                                  path: newPath,
                                }
                              ]
                    },
                    (err, info) => {
                      if (err) {
                        //
                        console.log(err);
                        return res.status(500).json(err);
                      } else {
                        console.log("email send : " + info.response);
                        setTimeout(function () {
                            fs.unlinkSync(newPath); // delete this file after 30 seconds
                          }, 40000);
                      }
                    }
                );
                return res.status(200).json("success");
            }
        })
    })

});

module.exports = router;