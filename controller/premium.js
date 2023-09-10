const Razorpay = require('razorpay');
const Order = require('../model/order');

exports.getPremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: 'rzp_test_qiiuwe2XZWJPA6',
            key_secret: 'aZIGfIzCa7pAA6d9w3XZgZkF'
        })
        const amount = 1000;
        rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err))
            } else {
                res.send(order)
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