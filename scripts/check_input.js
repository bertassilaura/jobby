// ================================== Mensagens de Erro ========================================

function errorMessage(id, message){
    let elemento = document.getElementById(id);
    let rect = elemento.getBoundingClientRect();

    let error_message = createErrorMessage(message);
    error_message.style.top = (rect.bottom) + "px";
    error_message.style.left = (rect.left + (rect.right - rect.left)/16) + "px";

    document.body.appendChild(error_message);
    document.addEventListener("click", closeMessages);
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
    document.removeEventListener("click", closeMessages);
}

// ================================== Verificar inputs ========================================

function empty(elemento){
    if (value == null || value == ""){
        return(false)
    }
    return(true)
}

function smaller(elemento, limit){
    if (Number(value) > limit){
        return(false)
    }
    return(true)
}

function bigger(elemento, limit){
    if (Number(value) < limit){
        return(false)
    }
    return(true)
}

function valid_combo(elemento_hour, elemento_minute){
    if (value_hour == 0 && value_minute == 0){
        createErrorMessage()
        return(false)
    }
    return(true)
}




