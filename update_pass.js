const User = require("./src/Models/user");
const crypto = require('crypto');
const mongoose = require('mongoose');
require('dotenv/config');

mongoose.connect(process.env.DB_CONNECTION, ()=>{

    console.log('Connected to DataBase');

    let ids = ["6229fe9542edd3a2ba368484", "622a769f25ef53ceb9fbbdb5", "622bf5043948a5fd2fed0c7d", "622e7d3a9e174618fcbfbd06", "622fea1114607191bce13e39"]

    for(id of ids){


        User.findOne({_id: id}).then(user => {

            if(user === null){
                console.log("Usuário não encontrado!");
            }
            else{
                user.password = crypto.createHash('sha512').update(user.password).digest('hex')
                user.hydration.water.measure = "mL"
                user.save()
            }
        })
}})
