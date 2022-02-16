// =================== Mock up data ========================

function TimeInterval(hours, minutes){
    this.hours = hours,
    this.minutes = minutes
}

let customTimes = {
    0: {name: "Teste", time: new TimeInterval(0,2), breakTime: new TimeInterval(0,1), breakInterval: new TimeInterval(0,1)},
    1: {name: "Trabalho", time: new TimeInterval(3, 0), breakTime: new TimeInterval(0,30), breakInterval: new TimeInterval(1, 30)},
    2: {name: "Estudo", time: new TimeInterval(2, 0), breakTime: new TimeInterval(0,15), breakInterval: new TimeInterval(1, 0)},
    3: {name: "Pixel", time: new TimeInterval(2, 0), breakTime: new TimeInterval(1,0), breakInterval: new TimeInterval(1, 0)},
    4: {name: "Prática", time: new TimeInterval(4, 0), breakTime: new TimeInterval(1,0), breakInterval: new TimeInterval(2, 0)},
    5: {name: "Filme", time: new TimeInterval(2, 30), breakTime: new TimeInterval(0,10), breakInterval: new TimeInterval(2, 30)},
    6: {name: "Livros", time: new TimeInterval(8, 0), breakTime: new TimeInterval(0,15), breakInterval: new TimeInterval(2, 0)},
    7: {name: "Manga", time: new TimeInterval(1, 0), breakTime: new TimeInterval(0,15), breakInterval: new TimeInterval(0, 30)},
    8: {name: "Academia", time: new TimeInterval(2, 0), breakTime: new TimeInterval(0,30), breakInterval: new TimeInterval(0, 45)}
}

// ================================== Clock ========================================

class Countdown{
    constructor(hours, minutes){
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = 0;
    }
    decrement(){
        this.seconds -= 1;
        if (this.seconds == -1){
            this.minutes -= 1;
            this.seconds = 59;
            if (this.minutes == -1){
                this.hours -= 1;
                this.minutes = 59;
            };
        };
    }
    totalSeconds(){
        return (this.seconds + (this.minutes * 60) + (this.hours * 3600));
    }
    over(){
        return(this.hours==0 && this.minutes==0 && this.seconds==0)
    }
};


function Clock(time, breakInterval, breakTime){
    this.interval = null,
    this.time = time,
    this.breakTime = breakTime,
    this.breakInterval = breakInterval,
    this.timeCountdown = new Countdown(this.time.hours, this.time.minutes),
    this.breakCountdown = new Countdown(this.breakInterval.hours, this.breakInterval.minutes),
    this.pauseStatus = true,
    this.breakStatus = false,
    
    this.play = () => {
        this.timeCountdown.decrement();
        this.breakCountdown.decrement();
        this.update(this.timeCountdown);
        if (this.timeCountdown.over()){
            stop();
        }
        else if (this.breakCountdown.over()){
            this.breakStatus = true;
            document.getElementById("break-popup").style.display = "flex";
            document.getElementById("break-path").style.strokeDashoffset = 0;
            notification("pristine.mp3")
            this.breakCountdown.hours = this.breakTime.hours;
            this.breakCountdown.minutes = this.breakTime.minutes;
            this.breakCountdown.seconds = 0;
        }
    },

    this.break = () => {
        this.breakCountdown.decrement();
        if (this.breakCountdown.over()){
            this.endBreak()
        }
        else{
            svg_update((this.breakTime.totalSeconds() - this.breakCountdown.totalSeconds())/this.breakTime.totalSeconds(), "break-path");
        };
    },

    this.endBreak = () =>{
        this.breakStatus = false;
        document.getElementById("break-interval-path").style.strokeDashoffset = 0;
        document.getElementById("break-popup").style.display = "none";
        this.breakCountdown.hours = this.breakInterval.hours;
        this.breakCountdown.minutes = this.breakInterval.minutes;
        this.breakCountdown.seconds = 0;
    },

    this.count = () => {
        if (this.breakStatus){
            this.break();
        }
        else{
            this.play();
        }
    },
 
    this.start = () => {
        this.pauseStatus = false;
        document.getElementById("configured-times").style.display = "none";
        this.interval = setInterval(this.count, 1000);
    },

    this.pause = () =>{
        clearInterval(this.interval);
        this.pauseStatus = true;
    },

    this.stop = () =>{
        document.getElementById("break-popup").style.display = "none";
        document.getElementById("configured-times").style.display = "flex";
        clearInterval(this.interval);
        notification("eventually.mp3")
        let passed_time = this.time.totalSeconds() - this.timeCountdown.totalSeconds();
        let n_breaks = Math.floor(passed_time/ this.breakInterval.totalSeconds());
        let total_break_time = n_breaks * this.breakTime.totalSeconds();
        if (this.breakStatus){
            total_break_time -= this.breakCountdown.totalSeconds();
        }
        if(this.breakCountdown.over()){
            total_break_time -= this.breakTime.totalSeconds();
        }
        this.timeCountdown.hours = 0;
        this.timeCountdown.minutes = 0;
        this.timeCountdown.seconds = 0;
        this.breakCountdown.hours = 0;
        this.breakCountdown.minutes = 0;
        this.breakCountdown.seconds = 0;
        this.update(this.timeCountdown);
        document.getElementById("clock-path").style.strokeDashoffset = 0;
        document.getElementById("break-interval-path").style.strokeDashoffset = 0;
        return {passed_time: passed_time, break_time: total_break_time};
    },

    this.update = (time) => {
        document.getElementById("hour").innerHTML = time.hours < 10? "0" + time.hours: time.hours;
        document.getElementById("minute").innerHTML = time.minutes < 10? "0" + time.minutes: time.minutes ;
        document.getElementById("second").innerHTML = time.seconds < 10? "0" + time.seconds: time.seconds;
        svg_update((this.time.totalSeconds() - this.timeCountdown.totalSeconds())/this.time.totalSeconds(), "clock-path");
        svg_update((this.breakInterval.totalSeconds() - this.breakCountdown.totalSeconds())/this.breakInterval.totalSeconds(), "break-interval-path");
    }
};


function svg_update(percent, target){
    let circle = document.getElementById(target);
    let stroke = circle.getTotalLength() * percent;
    circle.style.strokeDashoffset = stroke;
}

function svg_start(target){
    let circle = document.getElementById(target);
    let path_length = circle.getTotalLength();
    circle.style.strokeDasharray = path_length + " " + path_length; 
}

// ================================== Notification ========================================

function notification(name){
    const audio = new Audio(`./sounds/${name}`);
    audio.play()
}

// ================================== Check Inputs ========================================

// ========= Mensagens de Erro ===========

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

function valid_combo(elemento_hour, elemento_minute){
    if (elemento_hour.value == 0 && elemento_minute.value == 0){
        errorMessage(elemento_hour, `Hora e minutos não podem estar ambos zerados`);
        throw "inputException";
    }
}

function validate(id){
    validate_solo(id + "-hour");
    validate_solo(id + "-minute");

    let elemento_hour = document.getElementById(id + "-hour");
    let elemento_minute = document.getElementById(id + "-minute");

    valid_combo(elemento_hour, elemento_minute);
}

// ================================== Buttons ========================================

function play(){
    
    if (configured) {
        clock.start();
        document.getElementById("stop-button").style.display = "inline";
        document.getElementById("pause-button").style.display = "inline";
        document.getElementById("play-button").style.display = "none";
    }
    
}  

function pause(){
    clock.pause();
    document.getElementById("play-button").style.display = "inline";
    document.getElementById("pause-button").style.display = "none";
}

function stop(){
    configured = false;
    let data = clock.stop();
    document.getElementById("stop-button").style.display = "none";
    document.getElementById("pause-button").style.display = "none";
    document.getElementById("play-button").style.display = "inline";
    console.log(data)
    /* Send data to databank */
}

function startStretch(){
    goToSliderPosition(document.querySelector("#stretch-slider"), 0)
    document.querySelector("#break-start").style.display = "none";
    document.querySelector("#break-stretch").style.display = "flex";
    document.querySelector("#break-popup-close").style.display = "none";
    document.querySelector("#break-popup-back").style.display = "inline";
}

function stopStretch(){
    document.querySelector("#break-start").style.display = "flex";
    document.querySelector("#break-stretch").style.display = "none";
    document.querySelector("#break-popup-close").style.display = "inline";
    document.querySelector("#break-popup-back").style.display = "none";
}

function stopBreak(){
    clock.endBreak()
}

let configured = false;
let clock = null;


svg_start("clock-path");
svg_start("break-interval-path");
svg_start("break-path");

document.querySelector("#play-button").addEventListener("click", play)
document.querySelector("#pause-button").addEventListener("click", pause)
document.querySelector("#stop-button").addEventListener("click", stop)
document.querySelector("#start-stretch-btn").addEventListener("click", startStretch)
document.querySelector("#break-popup-close").addEventListener("click", stopBreak)
document.querySelector("#break-popup-back").addEventListener("click", stopStretch)

// =================== Create Items ========================

function formatTime(time){
    let text = "";
    text += time.hours==0? "": time.hours + "h";
    text += time.minutes==0? "": time.minutes + "min";

    return text;
}

function createItem(id){
    data = customTimes[id]

    let item = document.createElement("DIV");
    item.classList.add("custom-times__item");

    let time = document.createElement("DIV");
    time.classList.add("time");

    let timeName = document.createElement("DIV");
    timeName.classList.add("time__item");
    timeName.innerHTML = data.name;

    let timeInterval = document.createElement("DIV");
    timeInterval.classList.add("time__item");
    timeInterval.innerHTML = formatTime(data.time);

    let breakInfo = document.createElement("DIV");
    breakInfo.classList.add("time__item", "time__item--pausas");
    breakInfo.innerHTML = formatTime(data.breakTime) + " a cada " + formatTime(data.breakInterval);

    time.appendChild(timeName)
    time.appendChild(timeInterval)
    time.appendChild(breakInfo)

    item.appendChild(time)
    item.setAttribute("index", id)
    item.addEventListener("click", startClock)
    return item;
}

function startClock(){
    let index = this.getAttribute("index")
    let data = customTimes[index]
    let hour = data.time.hours
    let minute = data.time.minutes
    let time = new Countdown(hour, minute);

    hour = data.breakInterval.hours
    minute = data.breakInterval.minutes
    let breakInterval = new Countdown(hour, minute);
    
    hour = data.breakTime.hours
    minute = data.breakTime.minutes
    let breakTime = new Countdown(hour, minute);

    clock = new Clock(time, breakInterval, breakTime);
    document.getElementById("stop-button").style.display = "inline";
    document.getElementById("pause-button").style.display = "inline";
    document.getElementById("play-button").style.display = "none";
    configured = true
    clock.start()
}
 
let container = document.querySelector(".custom-times");

for (id in customTimes){
    let item = createItem(id)
    container.appendChild(item)
}




