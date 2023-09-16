const User = require('../model/user')
const bCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Sib = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid')
const Forgotpassword = require('../model/forgotpassword');

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
    return jwt.sign({ userId: id, name: name }, process.env.JWT_TOKEN)
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
    User.findAll({ where: { id: id } }).then(([user]) => res.send(user)).catch(err => { res.send(err) })
}

exports.forgotPassword = async (req, res) => {
    const RECEIVERS_MAIL = req.body.email;
    const uid = uuidv4();
    try {
        const userRes = await User.findAll({ where: { email: RECEIVERS_MAIL } })
        const forgotpassRes = await Forgotpassword.findAll({ where: { userId: userRes[0].dataValues.id } })
        console.log(forgotpassRes[0].dataValues)
        const result = await Forgotpassword.create({
            id: uid,
            isActive: true,
            userId: userRes[0].dataValues.id
        })
        console.log(result.dataValues)
        const client = Sib.ApiClient.instance;
        var apiKey = client.authentications["api-key"];
        apiKey.apiKey = process.env.FORGOT_API_KEY;
        const tranEmailApi = new Sib.TransactionalEmailsApi();
        const sender = { email: process.env.SENDER_MAIL };
        const recivers = [{ email: RECEIVERS_MAIL }];
        const response = await tranEmailApi.sendTransacEmail({
            sender,
            to: recivers,
            subject: "forgot password testing",
            textContent: `reset password link:- 
            http://localhost:3001/resetpassword/${uid}`,
        });
        res.send(response);
    }
    catch (err) {
        res.send(err)
    }
}

exports.resetPassword = async (req, res) => {
    const password = req.body.password;
    try {
        const useridRes = await Forgotpassword.findOne({ where: { id: req.body.uid } })
        if (!useridRes.dataValues.isActive) {
            res.status(401).send('Link Expired')
            return;
        }
        const userResponse = await User.findOne({ where: { id: useridRes.dataValues.userId } })
        bCrypt.compare(password, userResponse.dataValues.password, (err, hash) => {
            if (hash) {
                res.status(401).send('same password')
                return;
            } else {
                bCrypt.hash(password, 10, async function (err, hash) {
                    if (err) {
                        res.status(401).send('something went wrong');
                        return;
                    }
                    const userRes = await User.update({ password: hash }, { where: { id: useridRes.dataValues.userId } })
                    await Forgotpassword.update({ isActive: false }, { where: { userId: useridRes.dataValues.userId } })
                    res.send(userRes)
                });
            }
        })
    }
    catch (err) {
        res.send(err)
    }
}


