const User = require('../model/user')
const bCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Sib = require('sib-api-v3-sdk');

require('dotenv').config();

exports.createUser = (req, res) => {
    const { name, email, password } = req.body;
    User.findAll({ where: { email: email } })
        .then(([user]) => {
            if (user) {
                res.send('user already exists')
            } else {
                bCrypt.hash(password, 10, function (err, hash) {
                    User.create({
                        name: name,
                        email: email,
                        password: hash,
                    }).then((result) => {
                        res.send(result)
                    }).catch((err) => {
                        console.log(err);
                        res.send('some error occurred! please try again later')
                    })
                });
            }
        })
        .catch((err) => {
            res.send(err)
        })
}

function generateToken(id, name) {
    return jwt.sign({ userId: id, name: name }, '456sg56f4gsd546df8gsd7f8gfgd4ggfs7hfgsd135f64hfdjgh321nvb123xcvaew7e23')
}

exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    User.findAll({ where: { email: email } })
        .then(([user]) => {
            bCrypt.compare(password, user.password, (err, hash) => {
                if (hash) {
                    res.status(202).json({ id: user.id, token: generateToken(user.id, user.name), email: user.email, name: user.name, isPremium: user.isPremium, expense: user.expense })
                } else {
                    res.send('wrong password')
                }
            })
        })
        .catch(err => res.send('user does not exists'))
}

exports.getUser = async (req, res) => {
    const id = req.headers.id;
    console.log(id)
    User.findAll({ where: { id: id } }).then(([user]) => res.send(user)).catch(err => { res.send(err) })
}

exports.forgotPassword = async (req, res) => {
    console.log(req.body)
    const RECEIVERS_MAIL = req.body.email;
    try {
        const client = Sib.ApiClient.instance;
        var apiKey = client.authentications["api-key"];
        apiKey.apiKey = process.env.FORGOT_API_KEY;
        const tranEmailApi = new Sib.TransactionalEmailsApi();
        const sender = { email: process.env.SENDER_MAIL };
        const recivers = [{ email: process.env.RECEIVERS_MAIL }];

        const response = await tranEmailApi.sendTransacEmail({
            sender,
            to: recivers,
            subject: "forgot password testing",
            textContent: `just doing some testing`,
        });
        res.send(response);
    }
    catch (err) {
        res.send(err)
    }

}
