const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const sql = require('mssql');
const authRouter = require('./auth/auth.router');

const app = express();

dotenv.config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {encrypt: true}
}

sql.connect(config).then(console.log('db connected')).catch( err => console.log(err));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api/auth', authRouter);

module.exports = app;

