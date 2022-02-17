// ================================== Classes de Tempo ========================================

function TimeInterval(time){
    this.time = time
}

function WaterQuantity(measure){
    this.measure = measure
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

// ================================== Verificar inputs ========================================

function switch_result(){
    let checkBox = this.checked
    let inputs = document.querySelectorAll(".add-hydration__line .border-container")
    if (checkBox == true){
        inputs[1].style.display = "flex"
        inputs[2].style.display = "flex"
    }
    else{
        inputs[1].style.display = "none"
        inputs[2].style.display = "none"
    }
}

function empty(elemento){
    if (elemento.value == null || elemento.value == ""){
        errorMessage(elemento, "Preencha este campo");
        throw "inputException";
    }
}

function is_number(elemento){
    if (Math.floor(elemento.value) != Number(elemento.value)){
        errorMessage(elemento, `O valor deve ser um número inteiro`);
        throw "inputException";
    }
}

function min(elemento, limit){
    if (Number(elemento.value) < limit){
        errorMessage(elemento, `O valor deve ser maior ou igual a ${limit}`);
        throw "inputException";
    }
}

function max(elemento, limit){
    if (Number(elemento.value) > limit){
        errorMessage(elemento, `O valor deve ser menor ou igual a ${limit}`);
        throw "inputException";
    }
}

// ================================== Validação Formulário ========================================

function validate_solo(id){
    let elemento = document.getElementById(id);

    empty(elemento);

    if (elemento.min !== ""){
        min(elemento, elemento.min)
    }
    if (elemento.max !== ""){
        max(elemento, elemento.max)
    }
    if (elemento.type == "number"){
        is_number(elemento)
    }
}

function Time_measure(){
    let time_measure = document.getElementById("choose-interval").value
    if (time_measure == "minutos"){
        let minutes = document.getElementById("time-interval").value
        return new TimeInterval(minutes);
    }
    else{
        let hour = document.getElementById("time-interval").value
        return new TimeInterval(hour);
    }
    
}

function Water_measure(){
    let water_measure = document.getElementById("choose-water-unit").value
    if (water_measure == "litros"){
        let liter = document.getElementById("water-quantity").value
        return new WaterQuantity(liter);
    }
    else{
        let mililiter = document.getElementById("water-quantity").value
        return new WaterQuantity(mililiter);
    }
}

function submit_form(){
    try{
        validate_solo("time-interval")
        validate_solo("water-quantity")
        let time = Time_measure()
        let water = Water_measure()
        console.log(time)
        console.log(water)
    }
    catch(e){
        console.log(e)
    }
}


document.getElementById("hydration-reminder").addEventListener("change", switch_result)
document.getElementById("hydration-save-button").addEventListener("click", submit_form);