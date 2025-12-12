const express = require('express');
const app = express();
const path = require('path');
const upload = require('./middleware/upload');
require('dotenv').config();

// middleware
app.use(express.json());

// test route
app.use('/test', (req, res)=>{
    res.send('Async File Processing System is running...');
});

// upload route
app.use('/upload', upload.single('file'), (req, res)=>{
    if(!req.file){
        return res.status(400).json({ message: 'No file uploaded' });
    }

    res.status(200).json({
        message: 'File uploaded successfully',
        file: req.file.filename,
        path: req.file.path
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${ PORT }`)
});