const jwt = require('jsonwebtoken');
const User = require('../model/user');

const tokenAuthentication = (req, res, next) => {
    const token = req.headers.authorization;
    const user = jwt.verify(token, '456sg56f4gsd546df8gsd7f8gfgd4ggfs7hfgsd135f64hfdjgh321nvb123xcvaew7e23')
    User.findAll({ where: { id: user.userId } }).then((result) => {
        req.user = user;
        next();
    }).catch(err => console.log(err))

}

module.exports = tokenAuthentication;