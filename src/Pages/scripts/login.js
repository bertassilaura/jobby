// =================== Redirect ========================

if(localStorage.getItem("token") !== null){
    location.href = "./time_tracker.html"
}

// =================== Login ========================

function Login(email, password){
    this.email = email,
    this.password = password
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
            inputErrorMessage(element, "Preencha este campo");
            throw "inputException";
        }
        let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        if (!element.value.match(validRegex)){
            inputErrorMessage(element, "Email inválido");
            throw "inputException";
        }
    },

    this.check_password = (element) => {
        if (element.value == null || element.value == ""){
            inputErrorMessage(element, "Preencha este campo");
            throw "inputException";
        }
    },

    this.submit = () =>{
        try{
        this.check_email(this.email)
        this.check_password(this.password)
        let login = new Login(this.email.value, this.password.value)
        this.send(login)
        }
        catch (e){
            
        }
    }

    this.keyPress = (event) =>{
        if (event.key == "Enter"){
            this.submit()
        }
    }

    this.send = (user_data) =>{

        let headers = new Headers({
            "Content-Type": "application/json",
        });
        
        let init = { method: 'POST',
               headers: headers,
               mode: 'cors',
               cache: 'default',
               body: JSON.stringify(user_data)};
        fetch("./user/login", init).then(response =>
            response.json().then(response => {
                if(response.status){
                    localStorage.setItem('token', response.data);
                    location.href = "./time_tracker.html"
                }
                else{
                    requestNotification(response.data.message)
                }
            })).catch(error => requestNotification(error))
    }
}

let form = new Form()
form.start()

