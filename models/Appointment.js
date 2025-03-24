const mongoose = require('mongoose');
const campground = require('./campground');

const AppointmentSchema = new mongoose.Schema({
    apptDate: {
        type: Date,
        required:true
    },
    // checkInDate: {
    //     type: Date,
    //     required: true
    // },
    // checkOutDate: {
    //     type: Date,
    //     required: true,
    //     validate: {
    //         validator: function (val) {
    //             return val > this.checkInDate; // Ensure check-out is after check-in
    //         },
    //         message: "Check-out date must be after check-in date"
    //     }
    // },
    user: {
        type:mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    campground: {
        type: mongoose.Schema.ObjectId,
        ref: 'Campground',
        required: true
    },
    refcreateAt: {
        type: Date,
        default: Date.now
    },
    nameLastname: {
        type: string,
        required: true
    },
    tel: {
        type: string,
        required: true
    }
});

// // Middleware to enforce max 3-night stay before saving
// AppointmentSchema.pre('save', function (next) {
//     const maxNights = 3;
//     const nights = (this.checkOutDate - this.checkInDate) / (1000 * 60 * 60 * 24); // Convert ms to days
//     if (nights > maxNights) {
//         return next(new Error(`You can only book a maximum of ${maxNights} nights.`));
//     }
//     next();
// });

module.exports = mongoose.model('Appointment',AppointmentSchema);