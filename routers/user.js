const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')

router.get('/add', Controller.showFormRegisterUser)
router.post('/add', Controller.addNewUser)

router.get('/login', Controller.showFormLogin)
router.post('/login', Controller.postLogin)

router.get('/dashboard', Controller.showDashboard)

module.exports = router