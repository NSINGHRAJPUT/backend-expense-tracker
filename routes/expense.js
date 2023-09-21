const express = require('express')

const router = express.Router();
const expenseController = require('../controller/expense')
const authMiddleware = require('../middleware/auth');

router.get('/get-expense', authMiddleware, expenseController.getExpense)

router.post('/create-expense', expenseController.createExpense)

router.delete('/delete-expense', expenseController.deleteExpense)

router.get('/download-expense', expenseController.downloadExpenses);

router.get('/pre-expense', expenseController.getReports);


module.exports = router;