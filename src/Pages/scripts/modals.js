/*
    Sobre o uso de modals.js
    Para usar as funções presentes em modals.js, insira no arquivo html:
        <script src="./scripts/modals.js"></script>
    E no header do arquivo insira: 
        <link rel="stylesheet" href="./styles/modal.css"/>

    As funções disponíveis após inserir estes arquivos são:
        inputErrorMessage(elemento_do_input, mensagem) # Antigo errorMessage, por favor, atualizem seus códigos
        requestNotification(mensagem, sucesso) # sucesso é uma booleana, a função irá criar uma pequena notificação
                                                 na lateral da página por 3 segundos
        notification(nome) # toca o aúdio com o nome especificado da pasta sounds, atualmente disponíveis: {"eventually.mp3" e "pristine.mp3"}

    Por fim, o objeto HydrationMonitor, para criá-lo, use:
        let hidratyonMonitor = new HydrationMonitor()
    Após receber o usuário do back-end, é hora de setar este objeto e ele fará o resto sozinho:
        hidratyonMonitor.setUp(user.hydration)



 */

// ========= Input Error ===========

function inputErrorMessage(elemento, message){
    let rect = elemento.getBoundingClientRect();

    let error_message = createInputErrorMessage(message);
    error_message.style.top = (rect.bottom) + "px";
    error_message.style.left = (rect.left + (rect.right - rect.left)/16) + "px";

    document.body.appendChild(error_message);
    elemento.focus()
    setTimeout(()=>{document.body.addEventListener("click", closeMessages)}, 1)
}

function createInputErrorMessage(message){
    let error_message = document.createElement("div");
    error_message.classList.add("input-error-message");

    let arrow = document.createElement("div");
    arrow.classList.add("input-error-message__arrow");

    let border = document.createElement("div");
    border.classList.add("input-error-message__border");
    border.innerHTML = `<span><span class="fas fa-exclamation-circle"> </span>  ${message}</span>`;

    error_message.appendChild(arrow);
    error_message.appendChild(border);
    return(error_message);
}

function closeMessages(){
    let messages = document.querySelectorAll(".input-error-message");
    for (message of messages){
        message.remove();
    }
    document.body.removeEventListener("click", closeMessages)
}


// ========= Hydration Warning ===========

function HydrationMonitor(){
    this.on = false,
    this.time = {hours: 0, minutes: 0},
    this.water = {quantity: 0, measure: "ml"},
    this.nextwarning = null,
    this.interval = null,
    this.popup = null

    this.setUp = (hydration) => {
        clearInterval(this.interval)
        this.on = hydration.on
        this.time = hydration.time
        this.water = hydration.water
        this.nextwarning = new Date(hydration.nextWarning)
        this.popup = this.createPopup()
        this.start()
    },

    this.start = () => {
        if (this.on){
            this.interval = setInterval(this.check, 30000)
            this.check()
        }
        else{
            this.nextwarning = null
            clearInterval(this.interval)
        }
    },

    this.setNextWarning = () => {
        this.nextwarning = new Date(Date.now() + this.time.hours * 3600000 + this.time.minutes * 60000)
        let hydration = {on: this.on,
                         time: this.time,
                         water: this.water,
                         nextWarning: this.nextwarning}

        let headers = new Headers({
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
        });

        let init = { method: 'PATCH',
               headers: headers,
               mode: 'cors',
               cache: 'default',
               body: JSON.stringify(hydration)};

        fetch("./user/hydration", init).catch(e => {console.log(e)})
    }

    this.openPopup = () =>{
        document.body.appendChild(this.popup)
        notification("pristine.mp3")
    },

    this.createPopup = () => {
        let popup = document.createElement("div")
        popup.classList.add("hydration-popup")

        let top = document.createElement("div")
        top.classList.add("hydration-popup__top")
        let close = document.createElement("span")
        close.classList.add("hydration-popup__corner-button", "fas", "fa-times")
        close.addEventListener("click", this.closePopup)
        top.appendChild(close)

        let main = document.createElement("div")
        main.classList.add("hydration-popup__main")
        let icon = document.createElement("span")
        icon.classList.add("fas", "fa-tint", "hydration-popup__icon")
        let titleContainer = document.createElement("div")
        titleContainer.classList.add("hydration-popup__title-container")
        let title = document.createElement("h2")
        title.classList.add("hydration-popup__title")
        let breakRule = document.createElement("svg")
        breakRule.classList.add("break-rule")
        breakRule.viewBox = "0 0 100 10"
        breakRule.innerHTML = `<path d="M 0 1 L 100 1" fill="none" stroke="#41529F" stroke-width="10" stroke-linecap="round"/>`
        titleContainer.appendChild(title)
        titleContainer.appendChild(breakRule)
        let text = document.createElement("span")
        text.classList.add("hydration-popup__text")
        text.innerHTML = `Lembre-se de tomar ${this.water.quantity}${this.water.measure} de água!`

        main.appendChild(icon)
        main.appendChild(titleContainer)
        main.appendChild(text)

        popup.appendChild(top)
        popup.appendChild(main)

        return popup
    },

    this.check = () => {
        if (Date.now() >= this.nextwarning){
            this.openPopup()
            clearInterval(this.interval)
        }
    }

    this.closePopup = (element) =>{
        this.popup.remove()
        this.setNextWarning()
        this.start()
    }
}

// ========= Messages ===========

function requestNotification(message, success = false){

    let notification = createRequestNotification(success, message);

    closeAllNotifications()
    document.body.appendChild(notification);
    notification = document.querySelector(".request-notification")
    setTimeout(() => {notification.style.transform = "translateX(0)"}, 1)
    setTimeout(() => {notification.style.transform = "translateX(calc(100% + 10px))"}, 4000)
    setTimeout(() => {notification.remove()}, 5000)

}

function createRequestNotification(success, message){

    let modifier = null
    if (success){
        modifier = "success"
    }
    else{
        modifier = "failure"
    }

    let notification = document.createElement("div");
    notification.classList.add("request-notification", `request-notification--${modifier}`);

    let icon = document.createElement("span");
    icon.classList.add("fas", success?"fa-check-circle":"fa-exclamation-circle", "request-notification__icon");

    let text = document.createElement("span");
    text.classList.add("request-notification__text");
    text.innerHTML = message;

    notification.appendChild(icon);
    notification.appendChild(text);
    return(notification);
}

function closeAllNotifications(){
    notifications = document.querySelectorAll(".request-notification")
    for(notification of notifications){
        notification.remove()
    }

}

// ========= Notification ===========

function notification(name){
    const audio = new Audio(`./sounds/${name}`);
    audio.volume = 0.5;
    audio.play()
}