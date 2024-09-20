const express = require('express')
const logIn = require("../Controllers/DoctorLogin")
const router = express.Router()

router.post("/", logIn.login)

module.exports = router