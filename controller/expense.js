const Expense = require('../model/expense')
const User = require('../model/user')
const sequelize = require('../util/database');


exports.getExpense = (req, res) => {
    Expense.findAll({ where: { userId: req.user.userId } }).then((expense) => {
        res.send(expense);
    }).catch(err => console.log(err))
}

exports.createExpense = async (req, res) => {
    const t = await sequelize.transaction();
    const { name, price, category, userId } = req.body;
    Expense.create({
        name: name,
        price: price,
        category: category,
        userId: userId,
        transaction: t
    }).then((response) => {
        User.findAll({ where: { id: userId }, transaction: t })
            .then(([user]) => {
                if (user.expense) {
                    user.expense = user.expense + (+req.body.price);
                } else {
                    user.expense = req.body.price;
                }
                return user.save()
            }).then(async () => {
                await t.commit();
                res.send(response);
            }).catch(async () => await t.rollback())
    }).catch(async () => await t.rollback())
}

exports.deleteExpense = (req, res) => {
    const userId = Number(req.headers.id.split(',')[0])
    const expense = Number(req.headers.id.split(',')[1])
    const expenseId = Number(req.headers.id.split(',')[2])
    User.findAll({ where: { id: userId } })
        .then(([user]) => {
            user.expense = user.expense - expense;
            return user.save()
        })
        .catch(err => console.log(err))
    let obj = {}
    Expense.findAll({ where: { id: expenseId } }).then(([expense]) => {
        obj = { ...expense }
        return expense.destroy()
    }).then(() => {
        res.send(obj)
    }).catch(err => console.log(err))
}

