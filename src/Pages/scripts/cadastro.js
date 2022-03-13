function Register(name,email,password){
    this.name = name,
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
    this.name = document.querySelector("#name"),
    this.email = document.querySelector("#email"),
    this.password = document.querySelector("#password"),

    this.start = () => {
        document.querySelector("#register-save-button").addEventListener("click", this.submit)
        this.email.addEventListener("keypress", this.keyPress)
        this.password.addEventListener("keypress", this.keyPress)
        this.name.addEventListener("keypress", this.keyPress)
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

    this.check_empty = (element) => {
        if (element.value == null || element.value == ""){
            errorMessage(element, "Preencha este campo");
            throw "inputException";
        }
    },

    this.submit = () =>{
        try{
        this.check_empty(this.name)
        this.check_email(this.email)
        this.check_empty(this.password)
        let register = new Register(this.name.value, this.email.value, this.password.value)
        let headers = new Headers({
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
            });
        let init = { method: 'POST',
                headers: headers,
                mode: 'cors',
                cache: 'default',
                body: JSON.stringify(register)};
                fetch("./user", init).then(response =>
                    {
                        if(!response.ok){
                            response.json().then(data => {requestNotification(data.message)})
                        }
                        else{
                            response.json().then(data => {
                                localStorage.setItem("token", data.token)
                                location.href = "./time_tracker.html"
                            })
                        }
                        }).catch(error => requestNotification(error))

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
