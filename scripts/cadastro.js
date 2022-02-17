function Register(nome,email,senha){
    this.nome = nome,
    this.email = email,
    this.senha = senha
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

// ================================== Validação Formulário ========================================

function validate_solo(id){
    let elemento = document.getElementById(id);
    empty(elemento);
}

function Register_in(){
    let nome = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let senha = document.getElementById("password").value;
    return new Register(nome, email, senha);
}

function submit_form(){
    try{
        validate_solo("name")
        validate_solo("email")
        validate_solo("password")
        let register = Register_in()
        console.log(register)
    }
    catch(e){
        console.log(e)
    }
}

document.getElementById("register-save-button").addEventListener("click", submit_form);