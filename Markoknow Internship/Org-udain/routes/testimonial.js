const express = require("express");
const router = express.Router();
const formidable = require("formidable");
const mongoose = require("mongoose");
const Testimonial = mongoose.model("Testimonial");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require("path");
const { transporter } = require("../keys/email_transporter");
require("dotenv").config();

router.post('/api/testimonialform',(req,res)=>{
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        var oldPath = files.file.path;
        var name = fields.name;
        var email = fields.email;
        var desig = fields.desig;
        var testimonial = fields.testimonial;
        var linkedin = fields.linkedin;
        if(oldPath.length === 0){
            return res.status(500).json({error: "please attach photo"})
        }
        var newPath =path.join(
                         __dirname,
                        "..",
                        "testimonialUploads",
                        files.file.name
                      );
        var rawData = fs.readFileSync(oldPath);

        Testimonial.findOne({ email: email , isVerified: true})
        .then((savedUser) => {
            if (savedUser) {
        //if user alredy present
            return res.status(203).json({ error: "Member already exists" });
         }
         // uploading photo
        fs.writeFile(newPath, rawData,async function(err){
            if(err){
                console.log(err);
                return res.status(500).json({error: `${err}`});
            }
            else{
            const data = {
                name: name,
                email: email,
                testimonial: testimonial,
                linkedin: linkedin,
                designation: desig,
                imagePath: files.file.name,
            };
                
            const testimonialRec = new Testimonial(data);

            testimonialRec
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
            const url = `${process.env.DOMAIN}/verify_testimonial/${emailToken}`;

            await transporter.sendMail(
              {
                from: process.env.EMAIL_USERNAME,
                to: process.env.EMAIL_USERNAME,
                subject: "Testimonial Verification",
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
                            Designation:  ${desig} <br>
                            Mail ID: ${email} <br>
                            Testimonial: ${testimonial} <br>
                            LinkedIn:  ${linkedin} <br>
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
                                  ADD TESTIMONIAL
                                </button>
                            </a>
                              
                            </div>

                            <div>THANK YOU</div>
                            Markoknow
                          </div>
                       </div>`,
                  attachments: [
                        {
                          filename: files.file.name,
                          path: newPath,
                        }
                      ]
              },
              (err, info) => {
                if (err) {
                  console.log(err);
                  return res.status(500).json({error: `${err}`});
                } else {
                  console.log("email send : " + info.response);
                    }
                   }
                );
                res.status(200).json("success");
              })
              .catch((err) => {
                console.log(err);
                return res.status(500).json({error: `${err}`});
              });
            }
        })
    })
  })
});

router.post("/verify_testimonial", (req, res) => {
    const token = req.body.token.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_EMAIL, (err, payload) => {
      if (err) {
        //if error then ->
        return res.status(401).json({ error: "error occured" });
      }
      //get id of token user -->
      const { _id } = payload;
      
      //update isVerified to true
      Testimonial.findByIdAndUpdate(_id, { isVerified: true }, async (err, member) => {
        if (err) {
          //if errors
          console.log(err);
          return res.status(422).json({ message: "error occured !" });
        } else {
          // if success
          try {
            const { name, email } = member;
            const url = `${process.env.DOMAIN}/testimonials`;
            await transporter.sendMail(
              {
                from: process.env.EMAIL_USERNAME,
                to: email,
                subject: "Markoknow Testimonial Verification",
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
                               Your Testimonial is approved for Markoknow Testimonial page.
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
                                    Go to Testimonials
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
                  console.log(err);
                  return res.status(500).json(err);
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

  router.get("/api/testimonials", (req,res) => {
  
    Testimonial
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


module.exports = router;