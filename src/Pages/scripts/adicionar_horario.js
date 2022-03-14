// =================== Start Data ========================

let user = null
let hydrationMonitor = new HydrationMonitor()

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

function setData(){
    document.querySelector(".welcome-text__hello").innerHTML = `Olá, ${user.name}!`
    hydrationMonitor.setUp(user.hydration)
}

getUser()

// ================================== Classes de Tempo ========================================

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
    }

    this.start = () => {
        document.querySelector("#add-time-button").addEventListener("click", this.submit)
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
            inputErrorMessage(hour, "Hora e minutos não podem estar ambos zerados");
            throw "inputException";
        }
    },

    this.check_empty = (element) => {
        if (element.value == null || element.value == ""){
            inputErrorMessage(element, "Preencha este campo");
            throw "inputException";
        }
    },

    this.check_number = (element) => {
        if (element.value == null || element.value == ""){
            inputErrorMessage(element, "Preencha este campo");
            throw "inputException";
        }
        if (Math.floor(element.value) != Number(element.value)){
            inputErrorMessage(element, `O valor deve ser um número inteiro`);
            throw "inputException";
        }
        if (element.min !== "" && Number(element.value) < element.min){
            inputErrorMessage(element, `O valor deve ser maior ou igual a ${element.min}`);
        throw "inputException";
        }
        if (element.max !== "" && Number(element.value) > element.max){
            inputErrorMessage(element, `O valor deve ser menor ou igual a ${element.max}`);
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
    }

    this.keyPress = (event) =>{
        if (event.key == "Enter"){
            this.submit()
        }
    }

    this.send = (customTime) =>{

        let headers = new Headers({
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
        });

        let init = { method: 'POST',
               headers: headers,
               mode: 'cors',
               cache: 'default',
               body: JSON.stringify(customTime)};


    fetch(`./user/customtimes`, init).then(response => {
        response.json().then(response => {
            if(!response.auth){
                localStorage.removeItem("token")
                location.href = "./login.html"
            }
            else{
                if(response.status){
                    location.href = "./configuracoes_horario.html"
                }
                else{
                    requestNotification(response.data.message)
                }
            }})
        }).catch(error => requestNotification(error))
    }
}

let form = new Form()
form.start()
