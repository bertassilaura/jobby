// =================== Classes de tempo ========================

function TimeInterval(hours, minutes){
    this.hours = hours,
    this.minutes = minutes
}

function CustomTime(name, time, breakTime, breakInterval){
    this.name = name,
    this.timeInterval = time,
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

// ================================== Validação Formulário ========================================

function Form(){
    this.name = document.querySelector("#name"),
    this.durHour = document.querySelector("#duration-hour"),
    this.durMin = document.querySelector("#duration-minute"),
    this.breakHour = document.querySelector("#break-hour"),
    this.breakMin = document.querySelector("#break-minute"),
    this.repeatHour = document.querySelector("#repeat-hour"),
    this.repeatMin = document.querySelector("#repeat-minute"),

    this.formatTime = (time) => {
        let text = "";
        text += time.hours==0? "": time.hours + "h";
        text += time.minutes==0? "": time.minutes + "min";
    
        return text;
    },

    this.getData = () => {
            let queryString = window.location.search
            let params = new URLSearchParams(queryString);
            let idParam = parseInt(params.get("id"))
        
            if (queryString == "" || queryString == null){
                alert("Tempo Customizado não encontrado!")
                window.location.href = "./configuracoes_horario.html"
            }

            let encontrado = false
            let data = null
            for(index in user.custom_times){
                if (user.custom_times[index].id == idParam){
                    encontrado = true
                    data = user.custom_times[index]
                }
            }
            if(!encontrado){
                alert("Tempo Customizado não encontrado!")
                window.location.href = "./configuracoes_horario.html"
            }

            this.name.value = data.name
            this.durHour.value = data.timeInterval.hours
            this.durMin.value = data.timeInterval.minutes
            this.breakHour.value = data.breakTime.hours
            this.breakMin.value = data.breakTime.minutes
            this.repeatHour.value = data.breakInterval.hours
            this.repeatMin.value = data.breakInterval.minutes
        },

    this.start = () => {
        this.getData()
        document.querySelector("#edit-time-button").addEventListener("click", this.submit)
        this.name.addEventListener("keypress", this.keyPress)
        this.durHour.addEventListener("keypress", this.keyPress)
        this.durMin.addEventListener("keypress", this.keyPress)
        this.breakHour.addEventListener("keypress", this.keyPress)
        this.breakMin.addEventListener("keypress", this.keyPress)
        this.repeatHour.addEventListener("keypress", this.keyPress)
        this.repeatMin.addEventListener("keypress", this.keyPress)
    },

    this.check_duo = (hour, minute) => {
        this.check_number(hour)
        this.check_number(minute)
        if (hour.value == 0 && minute.value == 0){
            errorMessage(hour, "Hora e minutos não podem estar ambos zerados");
            throw "inputException";
        }
    },

    this.check_empty = (element) => {
        if (element.value == null || element.value == ""){
            errorMessage(element, "Preencha este campo");
            throw "inputException";
        }
    },

    this.check_number = (element) => {
        if (element.value == null || element.value == ""){
            errorMessage(element, "Preencha este campo");
            throw "inputException";
        }
        if (Math.floor(element.value) != Number(element.value)){
            errorMessage(element, `O valor deve ser um número inteiro`);
            throw "inputException";
        }
        if (element.min !== "" && Number(element.value) < element.min){
            errorMessage(element, `O valor deve ser maior ou igual a ${element.min}`);
        throw "inputException";
        }
        if (element.max !== "" && Number(element.value) > element.max){
            errorMessage(element, `O valor deve ser menor ou igual a ${element.max}`);
            throw "inputException";
        }
    },

    this.submit = () =>{
        try{
        closeMessages()
        this.check_empty(this.name)
        this.check_duo(this.durHour, this.durMin)
        this.check_duo(this.breakHour, this.breakMin)
        this.check_duo(this.repeatHour, this.repeatMin)
        
        let timeInterval = new TimeInterval(this.durHour.value, this.durMin.value)
        let breakTime = new TimeInterval(this.breakHour.value, this.breakMin.value)
        let breakInterval = new TimeInterval(this.repeatHour.value, this.repeatMin.value)

        let time = new CustomTime(this.name.value, timeInterval, breakTime, breakInterval)
        
        this.send(time)
        }
        catch (e){
            console.log(e)
        }
    },

    this.keyPress = (event) =>{
        if (event.key == "Enter"){
            this.submit()
        }
    },

    this.send = (customTime) =>{
        
        let params = new URLSearchParams(window.location.search);
        customTime.id = parseInt(params.get("id"))
        let headers = new Headers({
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
          });
        let init = { method: 'PATCH',
               headers: headers,
               mode: 'cors',
               cache: 'default',
               body: JSON.stringify(customTime)};
        fetch("./user/customtimes", init).then(response =>
            response.json().then(data => {
                if(data.status){
                location.href = "./configuracoes_horario.html"
                }
                else{
                    console.log(data)
                }}))
    }
}

// ================================== Delete CustomTime ========================================

function deleteCustomTime(){
    let queryString = window.location.search
    let params = new URLSearchParams(queryString);
    let idParam = parseInt(params.get("id"))
        
    let headers = new Headers({
            "Content-Type": "application/json",
    });
    let init = { method: 'DELETE',
           headers: headers,
           mode: 'cors',
           cache: 'default',
           body: JSON.stringify({user_id: user._id, id: idParam})};
    fetch("./user/customtimes", init).then(response =>
        response.json().then(data => {
            if(data.status){
            location.href = "./configuracoes_horario.html"
            }
            else{
                console.log(data)
            }}))
}

// =================== Start Data ========================

let user = null
let form = new Form()

async function getUser(){
    if (localStorage.getItem('token')){

        let headers = new Headers({
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
        });
            
        let init = { method: 'GET',
                headers: headers,
                mode: 'cors',
                cache: 'default'};
    
        await fetch(`./user`, init).then(response => response.json().then(user_data => user = user_data))
        document.querySelector(".welcome-text__hello").innerHTML = `Olá, ${user.name}!`
        form.start()}
        else{
            location.href = "./"
        }
}

getUser()
document.querySelector("#delete-time-button").addEventListener("click", deleteCustomTime)