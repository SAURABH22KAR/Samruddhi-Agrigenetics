const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // define your schema here
  name: {
    type: String,
    required: true
},
description: {
    type: String,
    required: true
},
price: {
    type: Number,
    required: true
},
imageUrl: {
    type: String,
    required: true
}
});



module.exports = mongoose.model('Product', productSchema);
