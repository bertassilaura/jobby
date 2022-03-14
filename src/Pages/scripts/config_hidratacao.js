// =================== Start Data ========================

let user = null
let hydrationMonitor = new HydrationMonitor() 
let form = new Form()

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
        })
}



function setData(){
    document.querySelector(".welcome-text__hello").innerHTML = `Olá, ${user.name}!`
    hydrationMonitor.setUp(user.hydration)
    form.start()
    form.setUp(user.hydration)
}

getUser()

// ================================== Classes de Tempo ========================================

function TimeInterval(hours, minutes){
    this.hours = hours,
    this.minutes = minutes
}

function WaterQuantity(quantity, measure){
    this.quantity = quantity,
    this.measure = measure
}

function Hydration(on, time, water){
    this.on = on,
    this.time = time,
    this.water = water,
    this.nextWarning = on?new Date(Date.now() + time.hours * 3600000 + time.minutes * 60000):null
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

    this.setUp = (hydration) => {
        // Falta o Switch e Seletor
        if(hydration.on != this.switch.checked){
            let event = new Event("switch_change")
            this.switch.parentElement.dispatchEvent(event)
        }
        this.time.value = hydration.time.hours != 0?hydration.time.hours : hydration.time.minutes
        setSelect(this.timeMeasure, hydration.time.hours != 0?"horas":"minutos")
        this.quantity.value = hydration.water.quantity
        setSelect(this.quantityMeasure, hydration.water.measure)
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
            inputErrorMessage(element, "Preencha este campo");
            throw "inputException";
        }
        if (Math.floor(element.value) != Number(element.value)){
            inputErrorMessage(element, `O valor deve ser um número inteiro`);
            throw "inputException";
        }
        if (Number(element.value) < 1){
            inputErrorMessage(element, `O valor deve ser maior ou igual a 1`);
        throw "inputException";
        }
        let max = this.timeMeasure.value == "minutos"?59:99;
        if (Number(element.value) > max){
            inputErrorMessage(element, `O valor deve ser menor ou igual a ${max}`);
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
            if (this.switch.checked){
            this.check_time(this.time)
            this.check_number(this.quantity)
            }
            let time = this.timeMeasure.value == "minutos"? new TimeInterval(0, this.time.value): new TimeInterval(this.time.value, 0)
            let water = new WaterQuantity(this.quantity.value, this.quantityMeasure.value)

            let hydration = new Hydration(this.switch.checked, time, water)
            hydrationMonitor.setUp(hydration)
            hydrationMonitor.setNextWarning()

            //Chamada para o servidor

            requestNotification(`Notificação de hidratação configurada com sucesso!`, true)
            
            }
            catch (e){
                
            }
    }

    this.keyPress = (event) =>{
        if (event.key == "Enter"){
            this.submit()
        }
    }
}




