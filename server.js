const express = require('express');
const app = express();
const path = require('path');
const upload = require('./middlewares/upload');
const fileQueue = require('./queue/fileQueue');
require("./queue/fileWorker");
require("./queue/queueEvents");
require('./cron')
require('dotenv').config();

// middleware
app.use(express.json());

// test route
app.use('/test', (req, res)=>{
    res.send('Async File Processing System is running...');
});

// upload route
app.use('/upload', upload.single('file'), async (req, res)=>{
    if(!req.file){
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // add job to queue
    const job = await fileQueue.add('process-file', {
        filePath: req.file.path,
        originalName: req.file.originalname
    });

    res.status(200).json({
        message: 'File uploaded successfully',
        jobId: job.id,
        file: req.file.filename,
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${ PORT }`)
});