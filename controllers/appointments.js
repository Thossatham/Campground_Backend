const Appointment = require('../models/Appointment');

//@desc     Get all appointments
//@route    GET /api/v1/appointments
//@access   Public
exports.getAppointments = async (req,res,next) => {
    let query;
    //General users can see only their appointments!!!
    if(req.user.role !== 'admin') {
        query = Appointment.find({user:req.user.id});
    } else { //If you are an admin, you can see all!!!
        query = Appointment.find();
    }
    try {
        const appointments = await query;

        res.status(200).json({
            sucess: true,
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