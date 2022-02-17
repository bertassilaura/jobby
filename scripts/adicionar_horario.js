// ================================== Classes de Tempo ========================================

function TimeInterval(hours, minutes){
    this.hours = hours,
    this.minutes = minutes
}

function CustomTime(name, time, breakTime, breakInterval){
    this.name = name,
    this.time = time,
    this.breakTime = breakTime,
    this.breakInterval = breakInterval
}

// ================================== Mensagens de Erro ========================================

function errorMessage(elemento, message){
    let rect = elemento.getBoundingClientRect();

    let error_message = createErrorMessage(message);
    error_message.style.top = (rect.bottom) + "px";
    error_message.style.left = (rect.left + (rect.right - rect.left)/16) + "px";

    document.body.appendChild(error_message);
    setTimeout(()=>{document.body.addEventListener("click", closeMessages)}, 1)
}

function createErrorMessage(message){
    let error_message = document.createElement("div");
    error_message.classList.add("error-message");

    let arrow = document.createElement("div");
    arrow.classList.add("error-message__arrow");

    let border = document.createElement("div");
    border.classList.add("error-message__border");
    border.innerHTML = `<span><span class="fas fa-exclamation-circle"> </span>  ${message}</span>`;

    error_message.appendChild(arrow);
    error_message.appendChild(border);
    return(error_message);
}

function closeMessages(){
    let messages = document.querySelectorAll(".error-message");
    for (message of messages){
        message.remove();
    }
    document.body.removeEventListener("click", closeMessages)
}

// ================================== Verificar inputs ========================================

function empty(elemento){
    if (elemento.value == null || elemento.value == ""){
        errorMessage(elemento, "Preencha este campo");
        throw "inputException";
    }
}

function is_number(elemento){
    if (Math.floor(elemento.value) != Number(elemento.value)){
        errorMessage(elemento, `O valor deve ser um número inteiro`);
        throw "inputException";
    }
}

function min(elemento, limit){
    if (Number(elemento.value) < limit){
        errorMessage(elemento, `O valor deve ser maior ou igual a ${limit}`);
        throw "inputException";
    }
}

function max(elemento, limit){
    if (Number(elemento.value) > limit){
        errorMessage(elemento, `O valor deve ser menor ou igual a ${limit}`);
        throw "inputException";
    }
}

function valid_combo(elemento_hour, elemento_minute){
    if (elemento_hour.value == 0 && elemento_minute.value == 0){
        errorMessage(elemento_hour, `Hora e minutos não podem estar ambos zerados`);
        throw "inputException";
    }
}

// ================================== Validação Formulário ========================================

function validate_solo(id){
    let elemento = document.getElementById(id);

    empty(elemento);

    if (elemento.min !== ""){
        min(elemento, elemento.min)
    }
    if (elemento.max !== ""){
        max(elemento, elemento.max)
    }
    if (elemento.type == "number"){
        is_number(elemento)
    }
}

function validate_combo(id){
    validate_solo(id + "-hour");
    validate_solo(id + "-minute");

    let elemento_hour = document.getElementById(id + "-hour");
    let elemento_minute = document.getElementById(id + "-minute");

    valid_combo(elemento_hour, elemento_minute);
}


function CreateTime(){
    let name = document.getElementById("name").value;
    let time = new TimeInterval(document.getElementById("duration-hour").value, document.getElementById("duration-minute").value)
    let breakTime = new TimeInterval(document.getElementById("break-hour").value, document.getElementById("break-minute").value)
    let breakInterval = new TimeInterval(document.getElementById("repeat-hour").value, document.getElementById("repeat-minute").value)
    return new CustomTime(name, time, breakTime, breakInterval);
}

function submit_form(){
    try{
        validate_solo("name")
        validate_combo("duration")
        validate_combo("break")
        validate_combo("repeat")
        let time = CreateTime()
        console.log(time)
    }
    catch(e){
        console.log(e)
    }
}


document.getElementById("add-time-button").addEventListener("click", submit_form);
