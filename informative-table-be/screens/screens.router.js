const express = require('express');
const router = express.Router();
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const multer = require('multer');
const {
  wrapError,
  DBError,
  UniqueViolationError,
  NotNullViolationError 
} = require('db-errors');

dotenv.config();


MIME_TYPE_MAPPER = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAPPER[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, `${Date.now()}-${name}`);
  },
});


// GET All screens on dashboard
router.get('/', (req, res) => {
  (async function(){
    try {
      const sqlRequest = new sql.Request();
      const query = `SELECT * FROM Screens ORDER BY ScreenId DESC`;
      const result = await sqlRequest.query(query);
      res.status(200).json(result.recordset);
    } catch (error) {
      console.log(error);
      res.status(500).json({message: 'Something bad happened. Please try again later.'});
    }
  })()
});


// CREATE new screen
router.post('/', (req, res) => {
  (async function(){
    try {
      const sqlRequest = new sql.Request();
      sqlRequest.input('ScreenName', req.body.ScreenName);
      sqlRequest.input('DateCreated', new Date().getTime().toString());
      const query = `INSERT INTO Screens (ScreenName, DateCreated, Content, HasUpdate)
      VALUES (@ScreenName, @DateCreated, '[]', 1);
      SELECT @@IDENTITY AS ScreenId;`;
      const result = await sqlRequest.query(query);
      res.status(200).json(result.recordset[0]);
    } catch (error) {
      console.log(error);
      err = wrapError(error);
   
      if (err instanceof UniqueViolationError) {
        res.status(500).json({message: `Screen with the same name already exists.`});
      } else if (err instanceof NotNullViolationError) {
        res.status(500).json({message: `${err.column} is required.`});
      } else {
        res.status(500).json({message: 'Sorry, some unknown error occurred. Please try again.'});
      }
    }
  })()
});


// GET screen by ID for Edit Screen
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


// Save Edit Screen
router.put('/', multer({ storage: storage, limits: {fileSize: 25 * 1024 * 1024, fieldSize: 25 * 1024 * 1024 } }).single("BackgroundImage"), (req, res) => {
  (async function() {
    try {
      let screenContent = JSON.parse(req.body.Content);
      let slide = screenContent.find( s => s.id == req.body.SlideId);
      if(req.file){
        const serverUrl = `${req.protocol}://${req.get("host")}`;
        slide.content.image = `${serverUrl}/images/${req.file.filename}`;
      }
      const sqlRequest = new sql.Request();
      sqlRequest.input('content', JSON.stringify(screenContent));
      sqlRequest.input('screenId', req.body.ScreenId);
      sqlQuery = `UPDATE Screens
      SET Content = @content, HasUpdate = 1
      WHERE ScreenId = @screenId`;
      const result = await sqlRequest.query(sqlQuery);
      res.status(200).json({message: 'Success'});
    } catch (error) {
      console.log(error);
      res.status(500).json({message: 'Something bad happened. Please try again later.'});
    }
  })()
});

router.put('/status/:screenId', (req, res) => {
  (async function() {
    try {
      const sqlRequest = new sql.Request();
      sqlRequest.input('screenId', req.params.screenId);
      sqlQuery = `UPDATE Screens
      SET HasUpdate = 0
      WHERE ScreenId = @screenId`;
      const result = await sqlRequest.query(sqlQuery);
      res.status(200).json({message: 'Success'});
    } catch (error) {
      console.log(error);
      res.status(500).json({message: 'Something bad happened. Please try again later.'});
    }
  })()
});

router.delete('/:screenId', (req, res) => {
  (async function(){
      try {
        const sqlReq = new sql.Request();
        sqlReq.input('screenId', req.params.screenId);
        const sqlReqQuery = 'SELECT * FROM Locations WHERE ScreenId = @screenId';
        const sqlResult = await sqlReq.query(sqlReqQuery);
        if(sqlResult.recordset.length){
          res.status(403).json({message: 'This screen is assigned to one or more locations and can not be deleted.'})
        } else {
          const sqlRequest = new sql.Request();
          sqlRequest.input('screenId', req.params.screenId);
          const sqlQuery = `DELETE FROM Screens WHERE ScreenId = @screenId;`;
          const result = await sqlRequest.query(sqlQuery);
          res.status(200).json({message: 'Success'});
        }
      } catch (error) {
          console.log(error);
          res.status(500).json({message: 'Something bad happened. Please try againt later.'});
      }
  })()
});

module.exports = router;