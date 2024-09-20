const express = require('express')
const createDoctor = require("../Controllers/DoctorController")
const router = express.Router()

router.post("/", createDoctor.register)


module.exports = router;