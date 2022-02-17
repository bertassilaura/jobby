// ================================== Classes de Tempo ========================================

function TimeInterval(hour, minute){
    this.hour = hour,
    this.minute = minute
}

function WaterQuantity(quantity, measure){
    this.quantity = quantity,
    this.measure = measure
}

function HydrationMonitor(on, time, water){
    this.on = on,
    this.time = time,
    this.water = water,
    this.nextwarning = null,
    this.interval = null,

    this.setUp = () => {
        if (this.on){
            this.nextwarning = new Date(Date.now() + this.time.hour * 3600000 + this.time.minute * 60000)
            this.interval = setInterval(this.check, 30000)
        }
        else{
            this.nextwarning = null
            clearInterval(this.interval)
        }
    },

    this.openPopup = () =>{
        let popup = document.querySelector("#water-popup");
        notification("pristine.mp3")
        popup.style.display = "flex"
        popup.querySelector("#water-quantity-text").innerHTML = `${this.water.quantity}${this.water.measure}`
        popup.querySelector("#close-water-popup").addEventListener("click", this.closePopup)
    },

    this.check = () => {
        if (Date.now() >= this.nextwarning){
            this.openPopup()
            clearInterval(this.interval)
        }
    }

    this.closePopup = () =>{
        let popup = document.querySelector("#water-popup");
        popup.style.display = "none"
        this.setUp()
    }
}

// ================================== Notification ========================================

function notification(name){
    const audio = new Audio(`./sounds/${name}`);
    audio.volume = 0.5;
    audio.play()
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
    this.switch = document.querySelector("#hydration-reminder"),
    this.time = document.querySelector("#time-interval"),
    this.timeMeasure = document.querySelector("#choose-interval"),
    this.quantity = document.querySelector("#water-quantity"),
    this.quantityMeasure = document.querySelector("#choose-water-unit"),

    this.start = () => {
        document.querySelector("#hydration-save-button").addEventListener("click", this.submit)
        this.switch.addEventListener("change", this.switchChange)
        this.time.addEventListener("keypress", this.keyPress)
        this.quantity.addEventListener("keypress", this.keyPress)
    },

    this.switchChange = () =>{
        let inputs = document.querySelectorAll(".add-hydration__line .border-container")
        if (this.switch.checked == true){
            inputs[1].style.display = "flex"
            inputs[2].style.display = "flex"
        }
        else{
            inputs[1].style.display = "none"
            inputs[2].style.display = "none"
        }
    },

    this.check_time = (element) => {
        if (element.value == null || element.value == ""){
            errorMessage(element, "Preencha este campo");
            throw "inputException";
        }
        if (Math.floor(element.value) != Number(element.value)){
            errorMessage(element, `O valor deve ser um número inteiro`);
            throw "inputException";
        }
        if (Number(element.value) < 1){
            errorMessage(element, `O valor deve ser maior ou igual a 1`);
        throw "inputException";
        }
        let max = this.timeMeasure.value == "minutos"?59:99;
        if (Number(element.value) > max){
            errorMessage(element, `O valor deve ser menor ou igual a ${max}`);
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
            if (this.switch.checked){
            this.check_time(this.time)
            this.check_number(this.quantity)
            }
            let time = this.timeMeasure.value == "minutos"? new TimeInterval(0, this.time.value): new TimeInterval(this.time.value, 0)
            let water = new WaterQuantity(this.quantity.value, this.quantityMeasure.value)

            let hydration = new HydrationMonitor(this.switch.checked, time, water)
            hydration.setUp()
            alert(`Ligado: ${hydration.on} \nTempo: ${hydration.time.hour}:${hydration.time.minute}\nQuantidade: ${hydration.water.quantity} ${hydration.water.measure}`)
            
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

