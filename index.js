const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require("./config/db");
connectDB();
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');

app.use(express.static('public'));
//app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//template
app.set('views' , path.join(__dirname,'/views'));
app.set('view engine' , 'ejs');

//routes
app.use('/api/files',require("./routes/files"));
app.use('/files',require('./routes/show'));
app.use('/files/download' , require('./routes/download'));

app.listen(PORT , ()=>{
    console.log(`Server listening on port ${PORT}`);
})