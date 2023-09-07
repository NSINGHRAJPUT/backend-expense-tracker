const User = require('../model/user')

exports.createUser = (req, res) => {
    const { name, email, password } = req.body;
    User.findAll({ where: { email: email } })
        .then(() => res.send('user already exists'))
        .catch(() => {
            User.create({
                name: name,
                email: email,
                password: password
            }).then(() => {
                res.send(name, email, password)
            }).catch((err) => {
                console.log(err);
                res.send('some error occurred! please try again later')
            })
        })
}