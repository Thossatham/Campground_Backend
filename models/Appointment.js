const mongoose = require('mongoose');
const campground = require('./campground');

const AppointmentSchema = new mongoose.Schema({
    apptDate: {
        type: String,
        required: true
    },
    user: {
        type: String,
        ref: 'User',
        required: true
    },
    campground: {
        type: String,
        ref: 'Campground',
        required: true
    },
    refcreateAt: {
        type: String
    }
});

module.exports = mongoose.model('Appointment',AppointmentSchema);