const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dotenv = require('dotenv');
const {
    wrapError,
    DBError,
    UniqueViolationError,
    NotNullViolationError 
  } = require('db-errors');

dotenv.config();

router.get('', (req, res) => {
    (async function(){
        try {
            const serverUrl = `${req.protocol}://${req.get("host")}`;
            const sqlRequest = new sql.Request();
            const sqlQuery = `SELECT Locations.LocationId, Locations.LocationName, Locations.Details, Screens.ScreenId, Screens.ScreenName
            FROM Locations
            INNER JOIN Screens ON Locations.ScreenId = Screens.ScreenId;`;
            const result = await sqlRequest.query(sqlQuery);
            let responseBody = result.recordset;
            responseBody.forEach( location => {
                location.Url = `${serverUrl}/public/?location=${location.LocationName}`;
            });
            res.status(200).json(responseBody);
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Something bad happened. Please try againt later.'});
        }
    })()
});

router.get('/:locationName', (req, res) => {
    (async function(){
        try {
            const sqlRequest = new sql.Request();
            sqlRequest.input('name', req.params.locationName);
            const sqlQuery = 'SELECT * FROM Locations WHERE LocationName = @name';
            const result = await sqlRequest.query(sqlQuery);
            console.log()
            res.status(200).json(result.recordset[0]);
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Something bad happened. Please try againt later.'});
        }
    })()
});

router.post('/', (req, res) => {
    (async function(){
        try {
            const sqlRequest = new sql.Request();
            sqlRequest.input('name', req.body.LocationName);
            sqlRequest.input('details', req.body.Details);
            sqlRequest.input('screenId', req.body.ScreenId);
            sqlRequest.input('dateCreated', new Date().getTime().toString());
            const sqlQuery = `INSERT INTO Locations (LocationName, Details, ScreenId, DateCreated)
            VALUES (@name, @details, @screenId, @dateCreated)
            SELECT @@IDENTITY AS LocationId
            `;
            const result = await sqlRequest.query(sqlQuery);
            res.status(200).json(result.recordset[0]);
        } catch (error) {
            console.log(error);
            err = wrapError(error);
         
            if (err instanceof UniqueViolationError) {
              res.status(500).json({message: `Location with the same name already exists.`});
            } else if (err instanceof NotNullViolationError) {
              res.status(500).json({message: `${err.column} is required.`});
            } else {
              res.status(500).json({message: 'Sorry, some unknown error occurred. Please try again.'});
            }
          }
    })()
});

router.put('/:locationId', (req, res) => {
    (async function(){
        try {
            const sqlRequest = new sql.Request();
            sqlRequest.input('name', req.body.LocationName);
            sqlRequest.input('details', req.body.Details);
            sqlRequest.input('screenId', req.body.ScreenId);
            sqlRequest.input('locationId', req.params.locationId);
            const sqlQuery = `UPDATE Locations
            SET LocationName = @name, Details = @details, ScreenId = @screenId
            WHERE LocationId = @locationId
            `;
            const result = await sqlRequest.query(sqlQuery);
            res.status(200).json({message: 'Success'});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Something bad happened. Please try againt later.'});
        }
    })()
});

router.delete('/:locationId', (req, res) => {
    (async function(){
        try {
            const sqlRequest = new sql.Request();
            sqlRequest.input('id', sql.Int, req.params.locationId);
            const sqlQuery = `DELETE FROM Locations WHERE LocationId = @id;`;
            const result = await sqlRequest.query(sqlQuery);
            res.status(200).json({message: 'Success'});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Something bad happened. Please try againt later.'});
        }
    })()
});

module.exports = router;