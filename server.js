const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();

// middleware
app.use(express.json());

// test route
app.use('/', (req, res)=>{
    res.send('Async File Processing System is running...');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${ PORT }`)
});