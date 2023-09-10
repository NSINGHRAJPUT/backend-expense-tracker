const User = require('../model/user')
const bCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
                    res.status(202).json({ id: user.id, token: generateToken(user.id, user.name), email: user.email, name: user.name })
                } else {
                    res.send('wrong password')
                }
            })
        })
        .catch(err => res.send('user does not exists'))
}