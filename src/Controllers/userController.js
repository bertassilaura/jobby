const User = require('../Models/user');
const historyController = require("./historyController")
const jwt = require('jsonwebtoken');
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
    this.isDate = (value, fieldName= "Data") => {
        let date = new Date(value)
        if(date === "Invalid Date" && isNaN(date)){
            throw new InputException(`${fieldName} deve ser uma data válida!`);
        }
    },
    this.isBool =(value, fieldName) => {
        this.isEmpty(value, fieldName)
        if(value !== true && value !== false){
            throw new InputException(`${fieldName} deve ser um valor booleano!`);
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
        if (user != null){
            throw new InputException(`${fieldName} já está em uso!`);
        }
    },
    this.isMeasure = (value, fieldName = "unidade") => {
        this.isEmpty(value, fieldName)
        if(value != "mL" && value != "L"){
            throw new InputException(`${fieldName} deve ser "mL" ou "L"`);
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

exports.get = async (req, res) => {
    await User.findOne({_id: req.body.user_id}).then(user=>{
        if (user === null){
            res.status(404).json({auth: true, status: false, data: {type:404, message:"Usuário não encontrado"}});
            return
        }
        res.json({auth: true, status: true, data: user});
    })
    .catch(err =>{
        res.status(503).json({auth: true, status: false, data: {type: 503, message:"Erro de comunicação com o banco de dados!"}});
    });
};

exports.login = async (req, res) => {

    // Validação

    try{
     validator.validateEmail(req.body.email);
     validator.isEmpty(req.body.password, "Senha")}
    catch(e){
        res.status(400).json({status: false, data: {type:400, message:e.message}});
        return
    }

    // Cosnsulta

    await User.findOne({email: req.body.email, password: req.body.password}).then(user=>{
        if(user === null){
            return res.status(404).json({status: false, data: {type:404, message:"Email ou senha incorretos!"}});
        }
        const token = jwt.sign({ user_id: user._id }, process.env.SECRET, {
            expiresIn: 86400 // expires in 24h (86400s)
          });
        return res.json({status: true, data: token });
    })
    .catch(err =>{
        res.status(503).json({auth: true, status: false, data: {type: 503, message:"Erro de comunicação com o banco de dados!"}});
    });
};

exports.register = async (req, res) => {
    
    try{
        validator.isEmpty(req.body.name,"Nome");
        validator.validateEmail(req.body.email);
        await validator.isDuplicateEmail(req.body.email,"Email");
        validator.isEmpty(req.body.password, "Senha")}
       catch(e){
            res.status(400).json({status: false, data: {type:400, message:e.message}});
            return
       }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
		password: req.body.password,
    });

    await user.save()
    .then(user=>{
        const token = jwt.sign({user_id: user._id}, process.env.SECRET, {
            expiresIn: 86400 // expires in 24h (86400s)
          });
        historyController.create(user._id)
        return res.status(201).json({status: true, data: token});
    })
    .catch(err =>{
        res.status(503).json({status: false, data: {type: 503, message:"Erro de comunicação com o banco de dados!"}});
    });
};

exports.patchUser = async (req, res) => {
    try{
        validator.isEmpty(req.body.name,"Nome");
        validator.validateEmail(req.body.email);
        validator.isEmpty(req.body.password, "Senha")}
       catch(e){
            res.status(400).json({auth: true,status: false, data: {type:400, message:e.message}});
            return
       }

    const user = await User.findOne({_id: req.body.user_id}).catch(err => {res.status(503).json({status: false, data: {type: 503, message:"Erro de comunicação com o banco de dados!"}}); return})

    if(user === null){
        res.status(404).json({auth: true, status: false, data: {type:404, message:"Usuário não encontrado!"}});
        return
    }
    
    user.name = req.body.name
    user.email = req.body.email
    user.password = req.body.password
    
    user.save().then(data=>{
        return res.json({auth: true, status: true, data: {message: "Usuário alterado com sucesso!"}});
    })
    .catch(err =>{
        res.status(503).json({auth: true, status: false, data: {type: 503, message:"Erro de comunicação com o banco de dados!"}});
    });
};

exports.deleteUser = async (req, res) => {
    const removedUser = await User.deleteOne({_id: req.body.user_id});
    if (removedUser === null){
        res.status(404).json({auth: true, status: false, data: {type:404, message:"Usuário não encontrado!"}});
        return
    }
    historyController.delete(req.body.user_id)
    res.json({auth: true, status: true, data: {message: "Usuário excluído com sucesso!"}});
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
            res.status(400).json({auth: true,status: false, data: {type:400, message:err.message}});
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
        res.status(404).json({auth: true, status: false, data: {type:404, message:"Usuário não encontrado!"}});
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
        res.status(201).json({auth: true, status: true, data: {message: "Horário Customizado criado com sucesso!"}});
    })
    .catch(err =>{
        res.status(503).json({auth: true, status: false, data: {type: 503, message:"Erro de comunicação com o banco de dados!"}});
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
            res.status(400).json({auth: true,status: false, data: {type:400, message:err.message}});
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
        res.status(404).json({auth: true, status: false, data: {type:404, message:"Usuário não encontrado!"}});
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
            res.json({auth: true, status: true, data: {message: "Horário Customizado alterado com sucesso!"}});
        })
        .catch(err =>{
            res.status(503).json({auth: true, status: false, data: {type: 503, message:"Erro de comunicação com o banco de dados!"}});
        });
    }
    else{
        res.status(404).json({auth: true, status: false, data: {type:404, message:"Tempo Customizado não encontrado!"}});
    }
};

exports.deleteCustomTime = async (req, res) => {
    // Validação

    try{
        validator.isEmpty(req.body.user_id);
        validator.isEmpty(req.body.id)
    }
        catch(err){
            res.status(400).json({auth: true,status: false, data: {type:400, message:err.message}});
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
        res.status(404).json({auth: true, status: false, data: {type:404, message:"Usuário não encontrado!"}});
        return
    };

    deleted = false
    for (let i = 0; i < user.custom_times.length; i++){
        if (user.custom_times[i].id == req.body.id){
            user.custom_times.splice(i, 1)
            deleted = true
            break
        }
    }

    if(!deleted){
        res.status(404).json({auth: true, status: false, data: {type:404, message:"Tempo Customizado não encontrado!"}});
        return
    }

    await user.save()
    .then(data=>{
        res.json({auth: true, status: true, data: {message: "Horário Customizado alterado com sucesso!"}});
    })
    .catch(err =>{
        res.status(503).json({auth: true, status: false, data: {type: 503, message:"Erro de comunicação com o banco de dados!"}});
    });
};

//======================== Operações do Hydration ==========================

exports.patchHydration = async (req, res) => {
    try{
        validator.isBool(req.body.on) 
        if(req.body.on){
            validator.validateHours(req.body.time.hours, "Horas")
            validator.validateMinutes(req.body.time.minutes, "Minutos")
            validator.validateQuantity(req.body.water.quantity, "Quantidade")
            validator.isMeasure(req.body.water.measure, "Unidade de Medida")
            validator.isDate(req.body.nextWarning, "Próximo aviso")
        }
    }
        catch(err){
           res.status(400).json({auth: true,status: false, data: {type:400, message:err.message}});
           return
    }

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
        nextWarning: req.body.nextWarning}
    
    await user.save().then(data=>{
        res.json({auth: true, status: true, data: {message: "Hidratação atualizada com sucesso!"}});
    })
    .catch(err =>{
        res.status(503).json({auth: true, status: false, data: {type: 503, message:"Erro de comunicação com o banco de dados!"}});
    });
};