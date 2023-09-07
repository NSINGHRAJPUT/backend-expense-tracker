const express = require('express');
const cors = require('cors')
const sequelize = require('./util/database')
const app = express();

const signRouter = require('./routes/sign');
const bodyParser = require('body-parser');

app.use(cors())
app.use(bodyParser.json({ extended: false }))
app.use("/user", signRouter)


sequelize.sync().then(() => {
    app.listen(3000)
}).catch(err => console.log(err))