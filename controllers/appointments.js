const Appointment = require('../models/Appointment');
const Campground = require('../models/campground');

//@desc     Get all appointments
//@route    GET /api/v1/appointments
//@access   Public
exports.getAppointments = async (req, res, next) => {
    let query;
    
    // Start with basic query
    if(req.params.campgroundId) {
        // If campground ID is provided, filter by campground first
        query = Appointment.find({campground: req.params.campgroundId});
    } else {
        // No campground ID provided, get all appointments
        query = Appointment.find();
    }
    
    // Then apply user filtering if not admin
    if(req.user.role !== 'admin') {
        // Refine the query to also filter by user
        query = query.find({user: req.user.id});
    }
    
    // Add population regardless of filters
    query = query.populate({
        path: 'campground',
        select: 'name province tel'
    });
    
    try {
        const appointments = await query;
        
        res.status(200).json({
            success: true,  // Fixed typo here
            count: appointments.length,
            data: appointments
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot find Appointment"
        });
    }
};

//@desc     Get single appointment
//@route    GET /api/v1/appointments/:id
//@access   Public
exports.getAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate({
            path: 'campground',
            select: 'name description tel'
        });

        if(!appointment) {
            return res.status(404).json({success:false,message:`No appointment with the id of ${req.params.id}`});
        }

        res.status(200).json({
            success:true,
            data: appointment
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot find Appointment"});
    }
};

//@desc     Add appointment
//@route    POST /api/v1/appointments/:id
//@access   Private
exports.addAppointment = async (req, res, next) => {
    try {
        req.body.campground = req.params.campgroundId;

        const campground = await Campground.findById(req.params.campgroundId);

        if(!campground) {
            return res.status(404).json({
                success:false,
                message: `No campground with the id of ${req.params.campgroundId}`
            });
        }

        console.log(req.body);

        // Add user ID to req.body
        req.body.user = req.user.id;

        // Check for existing appointments
        const existedAppointments = await Appointment.find({user: req.user.id});

        // If the user is not an admin, they can only create 3 appointments.
        if(existedAppointments.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: `The user with ID ${req.user.id} has already made 3 appointments`
            });
        }

        const appointment = await Appointment.create(req.body);

        res.status(200).json({
            success: true,
            data: appointment
        });
        
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success:false, message: "Can not create Appointment"
        });
    }
};
//Spare In case

// exports.addAppointment = async (req, res, next) => {
//     try {
//         req.body.campground = req.params.campgroundId;

//         const campground = await Campground.findById(req.params.campgroundId);
//         if (!campground) {
//             return res.status(404).json({
//                 success: false,
//                 message: `Can not find hotel's ID ${req.params.campgroundId}`
//             });
//         }

//         // ตรวจสอบว่ามีการระบุวันที่เข้าพักหรือไม่
//         if (!req.body.checkInDate) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please add check-in date"
//             });
//         }

//         // แปลง checkInDate เป็น Date object
//         const checkInDate = new Date(req.body.checkInDate);

//         // ตรวจสอบว่า checkInDate ต้องไม่ใช่วันในอดีต
//         if (checkInDate < new Date()) {
//             return res.status(400).json({
//                 success: false,
//                 message: "The date is not valid"
//             });
//         }

//         // กำหนด checkOutDate โดยให้สูงสุดไม่เกิน 3 คืน
//         const nights = Math.min(req.body.nights || 3, 3);
//         const checkOutDate = new Date(checkInDate);
//         checkOutDate.setDate(checkOutDate.getDate() + nights);

//         // เพิ่ม user ID ลงใน req.body
//         req.body.user = req.user.id;
//         req.body.checkOutDate = checkOutDate;

//         // ตรวจสอบว่าผู้ใช้เคยจองที่โรงแรมนี้ในช่วงวันที่ทับซ้อนหรือไม่
//         const existingBooking = await Appointment.findOne({
//             user: req.user.id,
//             campground: req.params.campgroundId,
//             $or: [
//                 { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } }
//             ]
//         });

//         if (existingBooking) {
//             return res.status(400).json({
//                 success: false,
//                 message: "you have reached the limit(3 nights) please change hotels"
//             });
//         }

//         // สร้างการจองใหม่
//         const appointment = await Appointment.create(req.body);

//         res.status(201).json({
//             success: true,
//             data: appointment
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "Booking was failed"
//         });
//     }
// };

//@desc     Update appointment
//@route    PUT /api/v1/appointments/:id
//@access   Private
exports.updateAppointment = async (req, res, next) => {
    try {
        let appointment = await Appointment.findById(req.params.id);

        if(!appointment) {
            return res.status(404).json({
                success: false,
                message: `No appointment with the id of ${req.params.id}`
            });
        }

        // Make sure user is the appointment owner
        if(appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this appointment`
            });
        }

        appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {

        console.log(error)

        return res.status(500).json({
            success: false,
            message: "Cannot update Appointment"
        });
    }
};

//@desc     Delete appointment
//@route    DELETE /api/v1/appointments/:id
//@access   Private
exports.deleteAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if(!appointment) {
            return res.status(404).json({
                success: false,
                message: `No appointment with the id of ${req.params.id}`
            });
        }

        // Make sure user is the appointment owner
        if(appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this appointment`
            });
        }

        await appointment.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Cannot delete Appointment"
        });
    }
};
