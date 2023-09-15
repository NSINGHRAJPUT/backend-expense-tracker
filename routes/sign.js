const express = require('express');

const signController = require('../controller/sign')
const expenseController = require('../controller/expense')
const router = express.Router();

//////// USER ROUTES /////////////////
router.post('/create-user', signController.createUser)
router.post('/login-user', signController.loginUser)
router.get('/get-users', signController.getUser)
router.post('/forgot-password', signController.forgotPassword)




module.exports = router