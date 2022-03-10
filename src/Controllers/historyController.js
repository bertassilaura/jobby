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
        validator.isEmpty(req.query.user_id, "Id do Usuário");
    }
        catch(err){
           res.json({status: false, error: err});
           return
    }

    await History.findOne({user_id: req.query.user_id}).then(history=>{
        if (history === null){
            throw {message: "Histórico não encontrado", name:"NotFoundError"}
        }
        res.json({status: true, message: history});
    })
    .catch(err =>{
        res.json({status: false, error: err});
    });
};

exports.patch = async (req, res) => {
    try{
        validator.isEmpty(req.body.user_id, "Id do Usuário");
        validator.isEmpty(req.body.entry.activity, "Atividade");
        validator.isInt(req.body.entry.date, "Data");
        validator.isInt(req.body.entry.active_time, "Tempo da Atividade");
        validator.isInt(req.body.entry.break_time, "Tempo de Pausa");
    }
        catch(err){
           res.json({status: false, error: err});
           return
    }

    const history = await History.findOne({user_id: req.body.user_id})
    
    history.entries.push({
        activity: req.body.entry.activity,
        date: req.body.entry.date,
        active_time: req.body.entry.active_time,
        break_time: req.body.entry.break_time
    });
    
    history.save().then(data=>{
        res.json(data);
    })
    .catch(err =>{
        res.json({message: err});
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

