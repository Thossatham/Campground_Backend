const User = require('../models/User')
const Appointment = require('../models/Appointment');

//@desc     Register user
//@route    POST /api/v1/auth/register
//@access   Public
exports.register = async (req,res,next) => {
    try{
        const {name, email,telephone, password, role} = req.body;

        const user = await User.create({
            name,
            email,
            telephone,
            password,
            role
        });
        // const token = user.getSignedJwtToken();
        // res.status(200).json({success:true,token});

        sendTokenResponse(user,200,res);

    }catch(err) {
        res.status(400).json({success:false});
        console.log(err.stack);
    }
};

//@desc     Login user user
//@route    POST /api/v1/auth/login
//@access   Public
exports.login = async (req,res,next) => {
    const {email, password} = req.body;

    if(!email || !password) {
        res.status(400).json({success:false, msg:'Please provide an email and password'});
    }

    const user = await User.findOne({email}).select('+password');

    if(!user) {
        return res.status(400).json({success:false, msg:'Invalid credentials'});
    }

    const isMatch = await user.matchPassword(password);

    if(!isMatch) {
        return res.status(400).json({success:false, msg:'Invalid credentials'});
    }

    // const token = user.getSignedJwtToken();

    // res.status(200).json({success:true, token});
    sendTokenResponse(user,200,res);
};


//@desc Logout user
//@route POST /api/v1/auth/logout
//@access Public
exports.logout = async (req, res, next) => {
    res.cookie('token','none',{
        expires: new Date(Date.now()+10*1000),
        httpOnly:true
    });

    res.status(200).json({
        success:true,
        data:{}
    });
};



//@desc Delete user
//@route DELETE /api/v1/auth/delete
//@access Private
exports.deleteUser = async (req, res, next) => {
    try {
        // Find user by ID (from authenticated request)
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Delete any appointments associated with this user
        await Appointment.deleteMany({ user: req.user.id });
        
        // Delete the user
        await User.findByIdAndDelete(req.user.id);
        
        // Clear the authentication cookie
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });
        
        res.status(200).json({
            success: true,
            data: {},
            message: 'User successfully deleted'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user'
        });
    }
};



const sendTokenResponse = (user, statusCode, res) => {

    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV==='production') {
        options.secure=true;
    }
    
    res.status(statusCode).cookie('token',token,options).json({
        success: true,
        token
    });
};


//@desc     Get current Logged in user
//@route    POST /api/v1/auth/me
//@access   Private
exports.getMe = async (req,res,next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        data:user
    });
};