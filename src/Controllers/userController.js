const User = require('../Models/user');
const historyController = require("./historyController")
require('dotenv/config');

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
    },
    this.validateHours = (value, fieldName) => {
        this.isEmpty(value, fieldName)
        this.isInt(value, fieldName)
        if (Number(value) < 0){
            throw new InputException(`${fieldName} deve ser maior ou igual a 0!`);
        }
        if (Number(value) > 99){
            throw new InputException(`${fieldName} deve ser menor ou igual a 99!`);
        }
    },
    this.validateMinutes = (value, fieldName) => {
        this.isEmpty(value, fieldName)
        this.isInt(value, fieldName)
        if (Number(value) < 0){
            throw new InputException(`${fieldName} deve ser maior ou igual a 0!`);
        }
        if (Number(value) > 59){
            throw new InputException(`${fieldName} deve ser menor ou igual a 99!`);
        }
    },
    this.validateCombo = (hours, minutes, fieldName) => {
        this.validateHours(hours, "Horas de " + fieldName)
        this.validateMinutes(minutes, "Minutos de " + fieldName)
        if(Number(hours) == 0 && Number(minutes) == 0){
            throw new InputException(`Ambos horas e minutos de ${fieldName} não podem estar vazios!`);
        }
    },
    this.validateEmail = (value, fieldName = "email") => {
        this.isEmpty(value, fieldName)
        let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        if (!value.match(validRegex)){
            throw new InputException(`${fieldName} inválido!`);
        }
    },
    this.isDuplicateEmail = async (value, fieldName = "email") => {
        let user = await User.findOne({email: value})
        if (user == null){
            throw new InputException(`${fieldName} já está em uso!`);
        }
    },
    this.isMeasure = (value, fieldName = "unidade") => {
        this.isEmpty(value, fieldName)
        if(value != "ml" && value != "L"){
            throw new InputException(`${fieldName} deve ser "ml" ou "L"`);
        }
    },
    this.validateQuantity = (value, fieldName = "Quantidade de Água") => {
        this.isEmpty(value, fieldName)
        this.isInt(value, fieldName)
        if (Number(value) < 1){
            throw new InputException(`${fieldName} deve ser maior ou igual a 1!`);
        }
        if (Number(value) > 1000){
            throw new InputException(`${fieldName} deve ser menor ou igual a 1000!`);
        }
    }
}

let validator = new Validator();

//======================== Operações no Usuário ==========================

// Lembre de tirar isso daqui, pelo amor de deus
exports.getAll = async (req, res) => {
    await User.find({}).then(users=>{
        res.json(users);
    })
    .catch(err =>{
        res.json({message: err});
    });
};

// takes the id on the query, returns the user or null if the user is not found
exports.get = async (req, res) => {
    await User.findOne({_id: req.query.id}).then(user=>{
        res.json(user);
    })
    .catch(err =>{
        res.json({message: err});
    });
};

exports.login = async (req, res) => {

    // Validação

    try{
     validator.validateEmail(req.body.email);
     validator.isEmpty(req.body.password, "Senha")}
    catch(e){
        console.log(e)
        res.json({status: false, error: e});
        return
    }

    // Cosnsulta

    const user = await User.findOne({email: req.body.email, password: req.body.password}).then(user=>{
        res.json({status: true, message: user});
    })
    .catch(err =>{
        res.json({status: false, error: err});
    });
};

exports.register = async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
		password: req.body.password,
    });

    await user.save()
    .then(user=>{
        historyController.create(user._id)
        res.json(user);
    })
    .catch(err =>{
        res.json({message: err});
    });
};

exports.patchUser = async (req, res) => {
    const user = await User.findOne({_id: req.body.id})
    user.name = req.body.name
    user.email = req.body.email
    user.password = req.body.password
    
    user.save().then(data=>{
        res.json(data);
    })
    .catch(err =>{
        res.json({message: err});
        console.log(err)
    });
};

exports.deleteUser = async (req, res) => {
    const removedUser = await User.deleteOne({_id: req.query.id});
    historyController.delete(req.query.id)
    res.json(removedUser);
};

//======================== Operações no CustomTimes ==========================

exports.postCustomTime = async (req, res) => {

    // Validação

    try{
        validator.isEmpty(req.body.user_id);
        validator.isEmpty(req.body.name, "Atividade");
        validator.validateCombo(req.body.timeInterval.hours, req.body.timeInterval.minutes, "Duração");   
        validator.validateCombo(req.body.breakTime.hours, req.body.breakTime.minutes, "Duração da Pausa"); 
        validator.validateCombo(req.body.breakInterval.hours, req.body.breakInterval.minutes, "Tempo entre Pausas"); 
    }
        catch(err){
            console.log(err)
           res.json({status: false, error: err});
           return
    }

    // Encontrar usuário

    let user = null
    try{
        user = await User.findOne({_id: req.body.user_id})
        if (user === null){
            throw "NotFoundException"
        }
    }
    catch(err){
        res.json({status: false, error: {message: "Usuário não encontrado", name: "NotFoundException"}});
        return
    };

    // Inserir nova entrada

    user.custom_times.push({id: user.customTimesId,
                            name: req.body.name,
                            timeInterval: {hours: req.body.timeInterval.hours, minutes: req.body.timeInterval.minutes},
                            breakTime: {hours: req.body.breakTime.hours, minutes: req.body.breakTime.minutes},
                            breakInterval: {hours: req.body.breakInterval.hours, minutes: req.body.breakInterval.minutes}
    });

    user.customTimesId = user.customTimesId + 1;
    
    await user.save()
    .then(data=>{
        res.json({status: true, message: data});
    })
    .catch(err =>{
        res.json({status: false, error: err});
        console.log(err)
    });
};

exports.patchCustomTime = async (req, res) => {

    // Validação

    try{
        validator.isEmpty(req.body.user_id);
        validator.isEmpty(req.body.id)
        validator.isEmpty(req.body.name, "Atividade");
        validator.validateCombo(req.body.timeInterval.hours, req.body.timeInterval.minutes, "Duração");   
        validator.validateCombo(req.body.breakTime.hours, req.body.breakTime.minutes, "Duração da Pausa"); 
        validator.validateCombo(req.body.breakInterval.hours, req.body.breakInterval.minutes, "Tempo entre Pausas"); 
    }
        catch(err){
            console.log(err)
           res.json({status: false, error: err});
           return
    }

    // Encontrar usuário

    let user = null
    try{
        user = await User.findOne({_id: req.body.user_id})
        if (user === null){
            throw "NotFoundException"
        }
    }
    catch(err){
        res.json({status: false, error: {message: "Usuário não encontrado", name: "NotFoundException"}});
        return
    };

    let changed = false
    for (let i = 0; i < user.custom_times.length; i++){
        if (user.custom_times[i].id == req.body.id){
            user.custom_times[i] =
            {
                id: req.body.id,
                name: req.body.name,
                timeInterval: {hours: req.body.timeInterval.hours, minutes: req.body.timeInterval.minutes},
                breakTime: {hours: req.body.breakTime.hours, minutes: req.body.breakTime.minutes},
                breakInterval: {hours: req.body.breakInterval.hours, minutes: req.body.breakInterval.minutes}
            }
            changed = true
            break
        }
    }
    if(changed){
        await user.save()
        .then(data=>{
            res.json({status: true, message: data});
        })
        .catch(err =>{
            res.json({status: false, error: err});
        });
    }
    else{
        res.json({status: false, error: {message: "Entrada de tempo não encontrada", name:"NotFoundException"}});
    }
};

exports.deleteCustomTime = async (req, res) => {
    // Validação

    try{
        validator.isEmpty(req.body.user_id);
        validator.isEmpty(req.body.id)
    }
        catch(err){
           console.log(err)
           res.json({status: false, error: err});
           return
    }
    
    // Encontrar usuário
    
    let user = null
    try{
        user = await User.findOne({_id: req.body.user_id})
        if (user === null){
            throw "NotFoundException"
        }
    }
    catch(err){
        res.json({status: false, error: {message: "Usuário não encontrado", name: "NotFoundException"}});
        return
    };

    for (let i = 0; i < user.custom_times.length; i++){
        if (user.custom_times[i].id == req.body.id){
            user.custom_times.splice(i, 1)
            break
        }
    }

    await user.save()
    .then(data=>{
        res.json({status: true, message: data});
    })
    .catch(err =>{
        res.json({status: false, error: err});
    });
};

//======================== Operações do Hydration ==========================

exports.patchHydration = async (req, res) => {
    const user = await User.findOne({_id: req.body.user_id});
    user.hydration = {on: req.body.on,
    time:{
        hours: req.body.time.hours,
        minutes: req.body.time.minutes
        },
    water:{
        quantity: req.body.water.quantity,
        measure: req.body.water.measure
        },
    nextWarnig: req.body.nextWarnig}
    
    await user.save().then(data=>{
        res.json(data);
    })
    .catch(err =>{
        res.json({message: err});
        console.log(err)
    });
};