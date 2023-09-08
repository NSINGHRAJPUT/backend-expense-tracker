const Expense = require('../model/expense')

exports.getExpense = (req, res) => {
    Expense.findAll().then((expense) => {
        res.send(expense);
    }).catch(err => console.log(err))
}

exports.createExpense = (req, res) => {
    const { name, price, category, userId } = req.body;
    Expense.create({
        name: name,
        price: price,
        category: category,
        userId: userId
    }).then((response) => {
        res.send(response)
    }).catch(err => console.log(err))
}

exports.deleteExpense = (req, res) => {
    const expenseId = req.body.id;
    let obj = {}
    Expense.findAll({ where: { id: expenseId } }).then(([expense]) => {
        obj = { ...expense }
        return expense.destroy()
    }).then(() => {
        res.send(obj)
    }).catch(err => console.log(err))
}