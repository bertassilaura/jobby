


const express = require('express');
const mongoose = require('mongoose');

const app = express();
//Rotas
const index = require('./routes/index');
const userRoute = require('./routes/userRoute');
const historyRoute = require('./routes/historyRoute');

app.use('/', index);
app.use('/user', userRoute);
app.use('/history', historyRoute);

mongoose.connect(process.env.DB_CONNECTION, ()=>{console.log('Connected to DataBase')})

module.exports = app;
