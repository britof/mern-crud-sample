const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

//-----MongoDB database-----//
const dbRoute = "mongodb+srv://britof:<1123581321>@cluster0-oimg3.mongodb.net/test?retryWrites=true&w=majority";
//connects the back-end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });
let db = mongoose.connection;
db.once('open', () => console.log('connected to the database'));
//checks if connection with database is successfull
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

//parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

//GET Method
//fetches all available data in the database
router.get('/getData', (req, res) => {
    Data.find((err, data) => {
        if(err) return res.json({ success: false, error: err });
        else return res.json({ success: true, data: data });
    });
});

//UPDATE Method
//overwrites existing data in he database
router.post('/updateData', (req, res) => {
    const {id, update} = req.body;
    Data.findByIdAndUpdate(id, update, (err) => {
        if(err) return res.send(err);
        else return res.json({success: true});
    });
});

//DELETE Method
//removes existing data from the database
router.delete('/deleteData', (req, res) => {
    const { id } = req.body;
    Data.findByIdAndRemove(id, (err) => {
        if(err) return res.json({success: false});
        else return res.json({success: true});
    });
});

//CREATE Method
//adds new data to the database
router.post('/putData', (req, res) => {
    let data = new Data();
    const {id, message} = req.body;
    if((!id && id !== 0) || !message) return res.json({success: false, error: 'INVALID INPUTS'});
    else {
        data.message = message;
        data.id = id;
        data.save((err) => {
            if(err) return res.json({success: false, error: err});
            else return res.json({success: true});
        });
    }
});

//append /api for the http requests
app.use('/api', router);

//launch the back-end into a port
app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));