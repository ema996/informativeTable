const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const sql = require('mssql');
const path = require('path');
const authRouter = require('./auth/auth.router');
const screensRouter = require('./screens/screens.router');
const locationsRouter = require('./locations/locations.router');

const app = express();

app.use('/images', express.static(path.join('images')));
app.use('/public', express.static(path.join('public')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});

app.use(bodyParser.json({limit: '5mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

app.use('/api/auth', authRouter);
app.use('/api/screens', screensRouter);
app.use('/api/locations', locationsRouter);


dotenv.config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {encrypt: true}
}

sql.connect(config).then(console.log('db connected')).catch( err => console.log(err));

module.exports = app;

