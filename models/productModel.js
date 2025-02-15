const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    discription: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    quantity: {
        type: Number,
    },
    image: {
        type: Array,
    },
    color: {
        type: String,

    },
    sold: {
        type: Number,
        default: 0,
        // select:flase,
    },
    ratings: [
        {
            star: Number,
            comment: String,
            postedby: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ]

}, { timestamps: true }
);

//Export the model
module.exports = mongoose.model('Product', productSchema);