const express = require('express')
const router = express.Router()
const Info = require("../Controllers/DoctorInfoGet")
router.get("/read/:id",Info.infoGet)
router.post("/update/:id", Info.updateData)
module.exports = router