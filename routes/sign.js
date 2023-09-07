const express = require('express');

const signController = require('../controller/sign')
const router = express.Router();

router.post('/create-user', signController.createUser)

module.exports = router