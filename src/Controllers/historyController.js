const History = require('../Models/history');

//======================== Validation ==========================

function InputException(message) {
    this.message = message;
    this.name = "InputException";
 }

function Validator() {
    this.isEmpty = (value, fieldName) => { // throw error {message: ""}
        if (value === null ||  value === ""){
            throw new InputException(`${fieldName} não deve estar vazio!`);
        }
    },
    this.isInt = (value, fieldName) => {
        if (Math.floor(value) != Number(value)){
            throw new InputException(`${fieldName} deve ser um número inteiro!`);
        }
    }
}

let validator = new Validator();

//======================== Operações no Histórico ==========================

// takes the id on the query, returns the user or null if the user is not found
exports.get = async (req, res) => {
    try{
        validator.isEmpty(req.body.user_id, "Id do Usuário");
    }
        catch(err){
            res.status(400).json({auth: true,status: false, data: {type:400, message:err.message}});
           return
    }

    await History.findOne({user_id: req.body.user_id}).then(history=>{
        if (history === null){
            res.status(404).json({auth: true, status: false, data: {type:404, message:"Histórico não encontrado!"}});
            return
        }
        res.json({auth: true, status: true, data: history});
    })
    .catch(err =>{
        res.status(503).json({auth: true, status: false, data: {type: 503, message:"Erro de comunicação com o banco de dados!"}});
    });
};

exports.patch = async (req, res) => {
    try{
        validator.isEmpty(req.body.user_id, "Id do Usuário");
        if (req.body.entry.activity === ""){
            throw new InputException(`Atividade não deve estar vazio!`);
        }
        validator.isInt(req.body.entry.date, "Data");
        validator.isInt(req.body.entry.active_time, "Tempo da Atividade");
        validator.isInt(req.body.entry.break_time, "Tempo de Pausa");
    }
        catch(err){
            res.status(400).json({auth: true,status: false, data: {type:400, message:err.message}});
           return
    }

    const history = await History.findOne({user_id: req.body.user_id})

    if (history === null){
        res.status(404).json({auth: true, status: false, data: {type:404, message:"Histórico não encontrado!"}});
        return
    }
    
    history.entries.push({
        activity: req.body.entry.activity,
        date: req.body.entry.date,
        active_time: req.body.entry.active_time,
        break_time: req.body.entry.break_time
    });
   
    
    history.save().then(data=>{
        res.json({auth: true, status: true, data: {message: "Histórico atualizado com sucesso!"}});
    })
    .catch(err =>{
        res.status(503).json({auth: true, status: false, data: {type: 503, message:"Erro de comunicação com o banco de dados!"}});
    });
};


//======================== Interação Usuários ==========================

exports.create = async (user_id) => {
    const history = new History({
        user_id: user_id
    })

    await history.save()
    .then(data=>{
        return(data);
    })
    .catch(err =>{
        return({message: err});
    });

};

exports.delete = async (user_id) => {
    const removedHistory = await History.deleteOne({user_id: user_id});
    return (removedHistory);
};

