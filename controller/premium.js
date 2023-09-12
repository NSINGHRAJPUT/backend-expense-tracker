const Razorpay = require('razorpay');
const Order = require('../model/order');
const User = require('../model/user');

exports.getPremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: 'rzp_test_qiiuwe2XZWJPA6',
            key_secret: 'aZIGfIzCa7pAA6d9w3XZgZkF'
        })
        rzp.orders.create({ amount: 1000, currency: 'INR' }, (err, order) => {
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

            // req.user.createOrder({
            //     orderid: order.id, status: 'PENDING'
            //     }).then(() => res.status(201).json({ order, key_id: rzp.key_id }))
            //         .catch(err => { throw new Error(err) })
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