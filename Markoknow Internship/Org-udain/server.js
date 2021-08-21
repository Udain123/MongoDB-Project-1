const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();

const port = process.env.PORT || 3002;
const mongoose = require("mongoose");
const { MONGOURI } = require("./keys/key");
const cors = require("cors");

app.use(express.json());
app.use(cors());



//here
app.use(express.static(path.join(__dirname, "public/build")));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.static(path.join(__dirname,"imageUploads")));
app.use('/imageUploads',express.static('imageUploads'));
app.use(express.static(path.join(__dirname,"eventUploads")));
app.use('/eventUploads',express.static('eventUploads'));
app.use(express.static(path.join(__dirname,"organisedoc")));
app.use('/organisedoc',express.static('organisedoc'));
app.use(express.static(path.join(__dirname,"testimonialUploads")));
app.use('/testimonialUploads',express.static('testimonialUploads'));


// app.use(express.static(path.join(__dirname,"")));

//----------------------db connection-------------------//
mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  
  mongoose.connection.on("connected", () => {
    console.log("connected to mongo ");
  });
  mongoose.connection.on("error", (err) => {
    console.log("error connecting", err);
  });

  //-------------------------models-------------
require("./models/user");
require("./models/member");
require("./models/community");
require("./models/testimonial");

//------------------------routes-------------

app.use(require("./routes/user"));
app.use(require("./routes/member"));
app.use(require("./routes/community"));
app.use(require("./routes/forgotPassword/forgetpass"));
app.use(require("./routes/forgotPassword/resetPassword"));
app.use(require("./routes/profile.js"));
app.use(require("./routes/csvparse.js"));
app.use(require("./routes/eventlist.js"));
app.use(require("./routes/eventsRoutes/eventbooking.js"));
app.use(require("./routes/eventsRoutes/bookingRazorPay.js"));
app.use(require("./routes/partnership/partnershipform.js"));
app.use(require("./routes/testimonial.js"));


////////////////apply/////////////////////////
const applySchema = new mongoose.Schema({
  fullName: String,
  college: String,
  course: String,
  contact: Number,
  mail: String,
  linkedin: String,
  inspire: String,
  industry: String,
  build: String  
})

const Apply = new mongoose.model("Apply", applySchema)

app.post("/experience", (req,res)=> {
    // console.log(req.body);
    const {fullName, college, course, contact, mail, linkedin, inspire, industry, build} = req.body
    const user = new Apply({
      fullName,
      college,
      course,
      contact,
      mail,
      linkedin,
      inspire,
      industry,
      build
    })
    user.save(err => {
      if(err){
        res.status(422);
      }
      else {
        res.send({message: "Successfully Applied"});
      }
    })
})

app.use(function (req, res) {
  res.sendFile("public/build/index.html", { root: __dirname });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}!`);
});
  