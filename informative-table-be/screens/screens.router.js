const express = require('express');
const router = express.Router();
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

router.get('/', (req, res) => {
  (async function(){
    try {
      const sqlRequest = new sql.Request();
      const query = `SELECT * FROM Screens`;
      const result = await sqlRequest.query(query);
      res.status(200).json(result.recordset);
    } catch (error) {
      console.log(error);
      res.status(500).json({message: 'Something bad happened. Please try again later.'});
    }
  })()
});

router.post('/', (req, res) => {
  (async function(){
    try {
      const sqlRequest = new sql.Request();
      sqlRequest.input('ScreenName', req.body.ScreenName);
      sqlRequest.input('DateCreated', new Date().getTime().toString());
      const query = `INSERT INTO Screens (ScreenName, DateCreated, Content)
      VALUES (@ScreenName, @DateCreated, '[]');
      SELECT @@IDENTITY AS ScreenId;`;
      const result = await sqlRequest.query(query);
      res.status(200).json(result.recordset[0]);
    } catch (error) {
      console.log(error);
      res.status(500).json({message: 'Something bad happened. Please try again later.'});
    }
  })()
});

router.get('/:screenId', (req, res) => {
  (async function(){
    try {
      sqlRequest = new sql.Request();
      sqlRequest.input('ScreenId', req.params.screenId);
      query = `SELECT * FROM Screens
      WHERE ScreenId = @ScreenId`;
      const result = await sqlRequest.query(query);
      res.status(200).json(result.recordset[0]);
    } catch (error) {
      console.log(error);
      res.status(500).json({message: 'Something bad happened. Please try again later.'});
    }
  })()
});

router.put('/', (req, res) => {
  (async function() {
    try {
      
    } catch (error) {
      
    }
  })()
});

module.exports = router;