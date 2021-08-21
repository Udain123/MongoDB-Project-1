const mongoose = require("mongoose");

const testimonialSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    designation:{
        type: String,
        required: true,
    },
    testimonial:{
        type: String,
        required: true
    },
    linkedin:{
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
    date: { type: Date, default: Date.now },
});

mongoose.model("Testimonial",testimonialSchema);