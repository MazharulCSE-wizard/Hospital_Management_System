const express = require('express')
const patient = require("../Controllers/PatientController");
const router = express.Router()

//CREATE
router.post("/", patient.create)
//READ
router.get("/:id", patient.read)
//UPDATE
router.put("/:id", patient.update)
//DELETE
router.delete("/:id", patient.del)

module.exports = router;
