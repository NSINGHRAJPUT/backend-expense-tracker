const Razorpay = require('razorpay');
const Order = require('../model/order');
const User = require('../model/user');
const Expense = require('../model/expense');

exports.getPremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: `${process.env.KEY_ID}`,
            key_secret: `${process.env.KEY_SECRET}`
        })
        rzp.orders.create({ amount: process.env.AMOUNT, currency: `${process.env.CURRENCY}` }, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err))
            } else {
                Order.create({
                    orderId: order.id,
                    status: 'PENDING'
                }).then(() => {
                    res.status(201).json({ order, key_id: rzp.key_id })
                }).catch(err => res.send(err))
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(403).json({ message: 'error occurred', error: err })
    }
}

exports.updatePremium = async (req, res) => {
    User.findAll({ where: { id: req.user.userId } }).then(([user]) => {
        user.isPremium = true;
        return user.save();
    }).then((result) => {
        Order.findAll({ where: { orderId: req.body.razorpay_order_id } })
            .then(([order]) => {
                order.paymentId = req.body.razorpay_payment_id;
                order.status = 'PREMIUM';
                order.userId = req.user.userId;
                return order.save();
            }).then(() => res.send(result))
            .catch(err => res.send(err))
    }).catch(err => res.send(err));
}

exports.showUsers = async (req, res) => {
    let leaderboard = [];
    try {
        const response = await User.findAll({ attributes: ['name', 'expense'] })
        response.map((user) => {
            leaderboard.push(user.dataValues)
        })
        leaderboard.sort((a, b) => {
            return b.expense - a.expense;
        })
        res.send(leaderboard)
    }
    catch (err) {
        res.send(err)
    }
}