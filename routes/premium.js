const express = require('express');
const authMiddleware = require('../middleware/auth');
const premiumController = require('../controller/premium');

const router = express.Router();

router.get('/get-premium', authMiddleware, premiumController.getPremium);
router.post('/update-premium', authMiddleware, premiumController.updatePremium)
router.get('/show-users', premiumController.showUsers);

module.exports = router; 