const mongoose = require("mongoose");

const memberSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    designation:{
        type: String,
        required: true,
    },
    company:{
        type: String
    },
    about:{
        type: String,
    },
    contact:{
        type: Number,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    linkedin:{
        type: String,
        required: true,
    },
    probono:{
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
        require: true,
    },
    imagePath:{
        type: String,
    },
    point:{
        type:Number,
    },
    date: { type: Date, default: Date.now },
});

mongoose.model("Member",memberSchema);