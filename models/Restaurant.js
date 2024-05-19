// models/Restaurant.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const restaurantSchema = new Schema({
    city: { type: String, required: true },
    deadline: { type: String, required: true },
    floorplancolumns: { type: String, required: true },
    floorplanrows: { type: String, required: true },
    images: [String], 
    img: { type: String, required: true },
    location: {
        lat: { type: String, required: true },
        lng: { type: String, required: true }
    },
    name: { type: String, required: true },
    owner: { type: String, required: true },
    sunbeds: [{ type: Schema.Types.ObjectId, ref: 'Sunbed' }] 
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
