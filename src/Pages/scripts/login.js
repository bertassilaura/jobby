
function Login(email, password){
    this.email = email,
    this.password = password
}

// ================================== Mensagens de Erro ========================================

function errorMessage(elemento, message){
    let rect = elemento.getBoundingClientRect();

    let error_message = createErrorMessage(message);
    error_message.style.top = (rect.bottom) + "px";
    error_message.style.left = (rect.left + (rect.right - rect.left)/16) + "px";

    document.body.appendChild(error_message);
    elemento.focus()
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

// ================================== Validação Formulário ========================================

function Form(){
    this.email = document.querySelector("#email"),
    this.password = document.querySelector("#pswrd"),

    this.start = () => {
        document.querySelector("#login-save-button").addEventListener("click", this.submit)
        this.email.addEventListener("keypress", this.keyPress)
        this.password.addEventListener("keypress", this.keyPress)
    },

    this.check_email = (element) => {
        if (element.value == null || element.value == ""){
            errorMessage(element, "Preencha este campo");
            throw "inputException";
        }
        let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        if (!element.value.match(validRegex)){
            errorMessage(element, "Email inválido");
            throw "inputException";
        }
    },

    this.check_password = (element) => {
        if (element.value == null || element.value == ""){
            errorMessage(element, "Preencha este campo");
            throw "inputException";
        }
    },

    this.submit = () =>{
        try{
        this.check_email(this.email)
        this.check_password(this.password)
        let login = new Login(this.email.value, this.password.value)
        alert(`Email: ${login.email} \nPassword: ${login.password}`)
        document.location.href = "./time_tracker.html"
        }
        catch (e){
            console.log(e)
        }
    }

    this.keyPress = (event) =>{
        if (event.key == "Enter"){
            this.submit()
        }
    }
}

let form = new Form()
form.start()

