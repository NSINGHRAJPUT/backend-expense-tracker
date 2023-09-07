const User = require('../model/user')
const bCrypt = require('bcrypt');

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
                        password: hash
                    }).then(() => {
                        res.send(name, email, password)
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

exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    User.findAll({ where: { email: email } })
        .then(([user]) => {
            bCrypt.compare(password, user.password, (err, hash) => {
                if (!err) {
                    res.send('login successful');
                } else {
                    res.send('wrong password')
                }
            })
        })
        .catch(err => res.send('user does not exists'))
}