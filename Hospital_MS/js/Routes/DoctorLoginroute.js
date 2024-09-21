const express = require('express')
const logIn = require("../Controllers/DoctorLogin")
const router = express.Router()

router.post("/",logIn.middleware,logIn.login)
router.post("/logout/:id",logIn.logout)
router.post("/delete/:id",logIn.deleteUser)

module.exports = router