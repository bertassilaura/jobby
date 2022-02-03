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
}

function validate_combo(id){
    validate_solo(id + "-hour");
    validate_solo(id + "-minute");

    let elemento_hour = document.getElementById(id + "-hour");
    let elemento_minute = document.getElementById(id + "-minute");

    valid_combo(elemento_hour, elemento_minute);
}

function validate_form(form){
    let id_list = {"name": false, "duration": true, "break": true, "repeat": true}; // o true e false se referem a se são um combo
    try{
        for (id in id_list){
            if (id_list[id]){
                validate_combo(id);
            }
            else
            {
                validate_solo(id);
            }
        }
        document.getElementById(form).submit();
    }
    catch(e){
        console.log(e)
    }
}

