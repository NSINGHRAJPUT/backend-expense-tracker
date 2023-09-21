const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
//////////////////////                      LOCAL IMPORTS                  //////////////////////////
const signRouter = require('./routes/sign');
const expenseRouter = require('./routes/expense')
const sequelize = require('./util/database')
const User = require('./model/user');
const Expense = require('./model/expense');
const premiumRouter = require('./routes/premium');
const Order = require('./model/order');
const Forgotpassword = require('./model/forgotpassword');
const Report = require('./model/download');

const app = express();
app.use(cors())
app.use(bodyParser.json({ extended: false }))
//////////////////////                      ROUTES                       //////////////////////////
app.use("/user", signRouter)
app.use('/expense', expenseRouter)
app.use('/premium', premiumRouter)

//////////////////////                     RELATIONS                   //////////////////////////
User.hasMany(Expense)
Expense.belongsTo(User)
User.hasMany(Order)
Order.belongsTo(User)
User.hasMany(Forgotpassword)
Forgotpassword.belongsTo(User)
User.hasMany(Report)
Report.belongsTo(User)


sequelize.sync().then(() => {
    app.listen(3000)
}).catch(err => console.log(err))