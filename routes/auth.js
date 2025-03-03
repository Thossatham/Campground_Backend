const express = require('express');
const {register, login, promote, getMe, logout, deleteUser} = require('../controllers/auth');

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');

router.post('/register', register);
router.post('/login',login);
router.post('/logout',protect,logout);
router.route('/:id/promote').put( protect, authorize('admin'), promote ) ;
router.get('/me',protect,getMe);
router.delete('/delete', protect, deleteUser); // Updated the function name

module.exports = router;