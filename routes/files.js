const router = require('express').Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const {v4:uuid4} = require('uuid');
const file = require('../models/file');

//multer is an express middleware used to handle multipart from data i.e files

//config storage for multer 
//it provides option of disk storage

let storage = multer.diskStorage({
    destination: (req,file,done) =>{
        done(null,'uploads/');
    },
    filename: (req,file,done) =>{
        const uniquename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        done(null,uniquename);
    }
})

//single to upload a single file
//myfile is the name for the file input in form 

let upload = multer({
    storage : storage,
    limits: {fileSize: 1000000*100}
}).single('myFile');


router.post('/',(req,res)=>{

    upload(req,res,async (err)=>{
        //validate the request
        if(!req.file){
             return res.json({error : "All fileds are required"});
        }
        if(err){
             return res.status(500).send({error: err.message});
        }

        //Store in Database
        
        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path, 
            size: req.file.size
        });

        const response = await file.save();
        
        //return link to downlaod files
        return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}}`})
    })
})


router.post('/send' , async(req , res)=>{
    
    const {uuid , emailTo , emailFrom} = req.body;

    //validate the request
    if(!uuid || !emailTo || !emailFrom){
        return res.status(422).send({error : "All fields are required"});
    }

    const file = await File.findOne({ uuid: uuid });

    if(file.sender){
        return res.status(422).send({error : "Email has been sent"});
    }

    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();

    //send email

    const sendmail = require('../services/emailservice');

    sendmail({
        from: emailFrom,
        to: emailTo,
        subject: 'ShareMe file Sharing',
        text: `${emailFrom} has sent you a file to download`,
        html: require("../services/emailtemplate")({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size/1000) + 'KB',
            expires: '24 hours'
        })
    })
    
    return res.send({success: true});

})


module.exports = router;