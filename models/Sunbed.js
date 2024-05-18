// models/Sunbed.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const sunbedSchema = new Schema({
    dates: [String],
    disabled: { type: String, required: true },
    disappear: { type: String, required: true },
    number: { type: String, required: true },
    price: { type: String, required: true },
    type: { type: String, required: true }
});

const Sunbed = mongoose.model('Sunbed', sunbedSchema);

module.exports = Sunbed;
