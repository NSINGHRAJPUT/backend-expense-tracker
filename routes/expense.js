const express = require('express')

const router = express.Router();
const expenseController = require('../controller/expense')

router.get('/get-expense', expenseController.getExpense)

router.post('/create-expense', expenseController.createExpense)

// router.post('/delete-expense', expenseController.deleteExpense)

module.exports = router;