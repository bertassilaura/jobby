// =================== Classes de tempo ========================

function TimeInterval(hours, minutes){
    this.hours = hours,
    this.minutes = minutes
}

function CustomTime(name, time, breakTime, breakInterval){
    this.name = name,
    this.time = time,
    this.breakTime = breakTime,
    this.breakInterval = breakInterval
}

// =================== Mock up data ========================

let customTimes = {
    1: {name: "Trabalho", time: new TimeInterval(3, 0), breakTime: new TimeInterval(0,30), breakInterval: new TimeInterval(1, 30)},
    2: {name: "Estudo", time: new TimeInterval(2, 0), breakTime: new TimeInterval(0,15), breakInterval: new TimeInterval(1, 0)},
    3: {name: "Pixel", time: new TimeInterval(2, 0), breakTime: new TimeInterval(1,0), breakInterval: new TimeInterval(1, 0)},
    4: {name: "Prática", time: new TimeInterval(4, 0), breakTime: new TimeInterval(1,0), breakInterval: new TimeInterval(2, 0)},
    5: {name: "Filme", time: new TimeInterval(2, 30), breakTime: new TimeInterval(0,10), breakInterval: new TimeInterval(2, 30)},
    6: {name: "Livros", time: new TimeInterval(8, 0), breakTime: new TimeInterval(0,15), breakInterval: new TimeInterval(2, 0)},
    7: {name: "Manga", time: new TimeInterval(1, 0), breakTime: new TimeInterval(0,15), breakInterval: new TimeInterval(0, 30)},
    8: {name: "Academia", time: new TimeInterval(2, 0), breakTime: new TimeInterval(0,30), breakInterval: new TimeInterval(0, 45)}
}

// ================================== Pegar Dados ========================================

function getData(){
    let queryString = window.location.search
    let params = new URLSearchParams(queryString);
    let id = parseInt(params.get("id"))

    if (queryString == "" || queryString == null || !(id in customTimes)){
        alert("Página inválida")
        window.location.href = "./configuracoes_horario.html"
    }

    let data = customTimes[id]

    document.querySelector("#name").value = data.name
    document.querySelector("#duration-hour").value = data.time.hours
    document.querySelector("#duration-minute").value = data.time.minutes
    document.querySelector("#break-hour").value = data.breakTime.hours
    document.querySelector("#break-minute").value = data.breakTime.minutes
    document.querySelector("#repeat-hour").value = data.breakInterval.hours
    document.querySelector("#repeat-minute").value = data.breakInterval.minutes
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
            let id = parseInt(params.get("id"))
        
            if (queryString == "" || queryString == null || !(id in customTimes)){
                alert("Página inválida")
                window.location.href = "./configuracoes_horario.html"
            }
        
            let data = customTimes[id]
        
            this.name.value = data.name
            this.durHour.value = data.time.hours
            this.durMin.value = data.time.minutes
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

        let time = new CustomTime(this.name, timeInterval, breakTime, breakInterval)
        alert(`Nome: ${time.name.value} \nDuração: ${this.formatTime(time.time)}\n Pausas de ${this.formatTime(time.breakTime)} a cada ${this.formatTime(time.breakInterval)} `)
        document.location.href = "./configuracoes_horario.html"
        }
        catch (e){
            console.log(e)
        }
    },

    this.keyPress = (event) =>{
        if (event.key == "Enter"){
            this.submit()
        }
    }
}

let form = new Form()
form.start()


