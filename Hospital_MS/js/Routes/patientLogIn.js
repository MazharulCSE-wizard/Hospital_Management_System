const express = require('express')
const LogIN = require("../Controllers/PatientController");
const router = express.Router()

router.post("/", LogIN.login)

module.exports = router;