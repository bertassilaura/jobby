const History = require('./src/Models/history');
const mongoose = require('mongoose');
require('dotenv/config');

mongoose.connect(process.env.DB_CONNECTION, ()=>{console.log('Connected to DataBase')})

function Entry(atividade, data, tempo_atividade, tempo_pausa){
    this.activity = atividade;
    this.date = data;
    this.active_time = tempo_atividade;
    this.break_time = tempo_pausa;
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

function generateData(n_entradas){
    let dados = [];
    let atividades = ["Estudo", "Trabalho", "Pixel", "Televisão", "Livros", "Manga"]
    for(let i = 0; i < n_entradas; i++){
        let atividade = atividades[getRandomArbitrary(0,6)];
        let data = new Date();
        if (getRandomArbitrary(0,1) == 1){
            data.setDate(data.getDate() - getRandomArbitrary(0, 30));
        }
        else
        {
            data.setDate(data.getDate() + getRandomArbitrary(0, 30));
        }
        let tempo_atividade = (60 * getRandomArbitrary(0, 59)) + (3600 * getRandomArbitrary(0, 4));
        let tempo_pausa = (60 * getRandomArbitrary(0, 59)) + (3600 * getRandomArbitrary(0, 2))
        let entrada = new Entry(atividade, data, tempo_atividade, tempo_pausa);
        dados.push(entrada)
    }
    return dados;
}

async function generate(){
let data_to_push = generateData(60)
for(index in data_to_push){
    let data = {user_id: "6229fe9542edd3a2ba368484", entry: data_to_push[index]}
    await History.findOne({user_id: data.user_id}).then(history => {
    
        history.entries.push({
            activity: data.entry.activity,
            date: data.entry.date,
            active_time: data.entry.active_time,
            break_time: data.entry.break_time
        });
        
        history.save()})
}
}

generate()