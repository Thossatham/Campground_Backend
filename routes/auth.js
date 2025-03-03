const express = require('express');
const {register, login, getMe, logout, deleteUser} = require('../controllers/auth');

const router = express.Router();

const {protect} = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.delete('/delete', protect, deleteUser); // Updated the function name

module.exports = router;