const express = require('express');

const signController = require('../controller/sign')
const router = express.Router();

router.post('/create-user', signController.createUser)

router.post('/login-user', signController.loginUser)

module.exports = router