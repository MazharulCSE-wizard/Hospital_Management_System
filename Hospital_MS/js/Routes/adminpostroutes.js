// adminPostRoute.js

const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/admincontroller');

// Route for admin login
router.post('/login', adminController.login);

// Route to view hospitals
router.get('/dashboard', adminController.getHospitals);

// Route to update hospital info
router.post('/updateHospital', adminController.updateHospital);

// Route to delete a hospital
router.post('/deleteHospital', adminController.deleteHospital);

module.exports = router;
