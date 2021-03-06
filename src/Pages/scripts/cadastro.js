// =================== Redirect ========================

if(localStorage.getItem("token") !== null){
    location.href = "./time_tracker.html"
}

// =================== Register ========================

function Register(name,email,password){
    this.name = name,
    this.email = email,
    this.password = password
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
            inputErrorMessage(element, "Preencha este campo");
            throw "inputException";
        }
        let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        if (!element.value.match(validRegex)){
            inputErrorMessage(element, "Email inválido");
            throw "inputException";
        }
    },

    this.check_empty = (element) => {
        if (element.value == null || element.value == ""){
            inputErrorMessage(element, "Preencha este campo");
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
                    {response.json().then(response => {
                        if(response.status){
                            localStorage.setItem('token', response.data);
                            location.href = "./configuracoes.html"
                        }
                        else{
                            requestNotification(response.data.message)
                        }
                    })
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
