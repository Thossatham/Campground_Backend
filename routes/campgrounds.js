const express = require('express');
const { getCampgrounds, getCampground, createCampground, updateCampground, deleteCampground } = require('../controllers/campgrounds'); // Updated import for campgrounds

// Include other resource routers
const appointmentRouter = require('./appointments');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:campgroundId/appointments/', appointmentRouter); // Updated to campgroundId

router.route('/').get(getCampgrounds).post(protect, authorize('admin'), createCampground); // Updated to getCampgrounds and createCampground
router.route('/:id').get(getCampground).put(protect, authorize('admin'), updateCampground).delete(protect, authorize('admin'), deleteCampground); // Updated to getCampground, updateCampground, deleteCampground

module.exports = router;
