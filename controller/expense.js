const Expense = require('../model/expense')
const User = require('../model/user')
const sequelize = require('../util/database');
const AWS = require('aws-sdk');


function uploadTos3(data, fileName) {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    })
    s3bucket.createBucket(() => {
        let params = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: data
        }
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('something went wrong')
            } else {
                console.log(s3response, 'success');
            }
        })
    })
}

exports.downloadExpenses = async (req, res) => {
    try {
        const response = await Expense.findAll({ where: { userId: req.headers.id } })
        console.log(response)
        const stringifiedExoenses = JSON.stringify(response)
        const fileName = 'Expense.txt';
        const fileURL = uploadTos3(stringifiedExoenses, fileName)
        res.send(fileURL);
    }
    catch (err) {
        console.log(err)
    }
}
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

