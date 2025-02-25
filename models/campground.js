const mongoose = require('mongoose'); // Add this line at the top

const CampgroundSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength:[50,'Name can not be more than 50 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    district: {
        type: String,
        required: [true, 'Please add a district']
    },
    province: {
        type: String,
        required: [true, 'Please add a province']
    },
    postalcode: {
        type: String,
        required: [true, 'Please add a postalcode'],
        maxlength: [5, 'Postal Code can not be more than 5 digits']
    },
    tel: {
        type: String,
        required: [true, 'Please add a tel']
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Reverse populate with virtuals
CampgroundSchema.virtual('appointments', {
    ref: 'Appointment',
    localField: '_id',
    foreignField: 'campground', // Ensure the foreignField is 'campground', not 'Campground'
    justOne: false
});

module.exports = mongoose.model('Campground', CampgroundSchema);
