const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');

const app = express();

const signRouter = require('./routes/sign');
const expenseRouter = require('./routes/expense')
const sequelize = require('./util/database')
const User = require('./model/user');
const Expense = require('./model/expense');

app.use(cors())
app.use(bodyParser.json({ extended: false }))

app.use("/user", signRouter)
app.use('/expense', expenseRouter)


User.hasMany(Expense)
Expense.belongsTo(User)

sequelize.sync().then(() => {
    app.listen(3000)
}).catch(err => console.log(err))