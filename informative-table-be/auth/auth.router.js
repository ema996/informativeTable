const express = require('express');
const router = express.Router();
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

router.post('/login', (req, res) => {
    (async function(){
        try {
            const sqlRequest = new sql.Request();

            sqlRequest.input('email', req.body.Email);
            sqlRequest.input('pwd', req.body.Password);

            const sqlQuery = `SELECT * FROM Users
            WHERE Email = @email
            `;

            const result = await sqlRequest.query(sqlQuery);


            if (result.recordset.length) {
                if (await bcrypt.compare(req.body.Password, result.recordset[0].Password)) {
                    const token = jwt.sign({Name: result.recordset[0].Name, Email: result.recordset[0].Email}, process.env.SECRET_KEY, {expiresIn: '1h'});
                    const refreshToken = jwt.sign({Email: result.recordset[0].Email, PublicKey: result.recordset[0].Password}, process.env.SECRET_KEY, {expiresIn: '24h'});
                
                    res.status(200).json({token: token, refreshToken: refreshToken});
                } else {
                    res.status(400).json({ message: "Invalid password." });
                }
            } else {
                res.status(400).json({ message: "Invalid email address." });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({message: 'Invalid Credentials'});
        }
    })()
});

router.post('/register', (req, res) => {
    (async function(){
      try {
        const sqlRequest = new sql.Request();
        const password = await bcrypt.hash(req.body.Password, 10);
        sqlRequest.input('name', sql.VarChar, req.body.Name);
        sqlRequest.input('email', sql.VarChar, req.body.Email);
        sqlRequest.input('pass', sql.VarChar, password);
        const query = `
                INSERT INTO Users (Name, Email, Password)
                VALUES (@name, @email, @pass);
            `;
          await sqlRequest.query(query);
          res.status(201).json({ message: "You have successfully created new account." });
      } catch (error) {
          console.log(error);
          res.status(500).json({message: 'Sorry, some unknown error occurred. Please try again.'});
        }
    })()
});

module.exports = router;