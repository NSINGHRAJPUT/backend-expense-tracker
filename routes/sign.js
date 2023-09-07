const express = require('express');

const signController = require('../controller/sign')
const expenseController = require('../controller/expense')
const router = express.Router();

//////// USER ROUTES /////////////////
router.post('/create-user', signController.createUser)
router.post('/login-user', signController.loginUser)



module.exports = router