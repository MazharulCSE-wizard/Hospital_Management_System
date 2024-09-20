const express = require('express')
const patient = require("../Controllers/PatientController");
const router = express.Router()

router.post("/", patient.create)
router.get("/", patient.read)
router.put("/", patient.update)
router.delete("/", patient.del)
module.exports = router;