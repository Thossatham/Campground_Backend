const mongoose = require('mongoose');
const campground = require('./campground');

const AppointmentSchema = new mongoose.Schema({
    apptDate: {
        type: Date,
        required:true
    },
    user: {
        type:mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    campground: {
        type: mongoose.Schema.ObjectId,
        ref: 'Campground',
        rerquired: true
    },
    refcreateAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Appointment',AppointmentSchema);