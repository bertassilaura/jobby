// =================== Start Data ========================

let user = null

async function getUser(){    
    if (localStorage.getItem('token') === null){
        location.href = "./login.html"
    }

    let headers = new Headers({
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
    });
        
    let init = { method: 'GET',
            headers: headers,
            mode: 'cors',
            cache: 'default'};

    await fetch(`./user`, init).then(response => {
        response.json().then(response => {
            if(!response.auth){
                localStorage.removeItem("token")
                location.href = "./login.html"
            }
            else{
                if(response.status){
                    user = response.data
                    setData()
                }
                else{
                    requestNotification(response.data.message)
                }
            }})
        }).catch(error => requestNotification(error))
}

let hydrationMonitor = new HydrationMonitor()

function setData(){
    document.querySelector(".welcome-text__hello").innerHTML = `Olá, ${user.name}!`
    hydrationMonitor.setUp(user.hydration)
    form.start()
    form.setUp(user)
    document.querySelector(".delete-button").addEventListener("click", deleteUser)
    document.querySelector(".exit-button").addEventListener("click", ExitAccount)
}

getUser()


function Register(name,email,password){
    this.name = name,
    this.email = email,
    this.password = password
}

function deleteUser() {
    let headers = new Headers({
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
    });

    let init = { method: 'DELETE',
           headers: headers,
           mode: 'cors',
           cache: 'default'}

    fetch("./user", init).then(response =>
            response.json().then(response => {
                if(!response.auth){
                    localStorage.removeItem("token")
                    location.href = "./login.html"
                }
                else{
                    if(response.status){
                        localStorage.removeItem("token")
                        location.href = "./"
                    }
                    else{
                        requestNotification(response.data.message)
                    }
                }})).catch(error => requestNotification(error))
}

function ExitAccount() {
    localStorage.removeItem("token")
    location.href = "./"
}

// ================================== Validação Formulário ========================================

function Form(){
    this.name = document.querySelector("#name"),
    this.email = document.querySelector("#email"),
    this.password = document.querySelector("#password"),

    this.start = () => {
        document.querySelector("#config-save-button").addEventListener("click", this.submit)
        this.email.addEventListener("keypress", this.keyPress)
        this.password.addEventListener("keypress", this.keyPress)
        this.name.addEventListener("keypress", this.keyPress)
    },

    this.setUp = (user) => {
        this.name.value = user.name
        this.email.value = user.email
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
        this.send(register)
        }
        catch (e){
            console.log(e)
        }
    },

    this.send = (register) => {

        let headers = new Headers({
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
        });

        let init = { method: 'PATCH',
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
                    requestNotification("Informações alteradas com sucesso!", true)
                }
                }).catch(error => requestNotification(error))
    },

    this.keyPress = (event) =>{
        if (event.key == "Enter"){
            this.submit()
        }
    }
}

let form = new Form()
