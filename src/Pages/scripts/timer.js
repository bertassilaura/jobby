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
}

getUser()

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
        document.getElementById("configurations").style.display = "none";
        this.interval = setInterval(this.count, 1000);
    },

    this.pause = () =>{
        clearInterval(this.interval);
        this.pauseStatus = true;
    },

    this.stop = () =>{
        document.getElementById("break-popup").style.display = "none";
        document.getElementById("configurations").style.display = "flex";
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
        return {activity: null, date: Date.now(), active_time: passed_time, break_time: total_break_time};
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

// ================================== Validação Formulário ========================================

function Form(){
    this.durHour = document.querySelector("#duration-hour"),
    this.durMin = document.querySelector("#duration-minute"),
    this.breakHour = document.querySelector("#break-hour"),
    this.breakMin = document.querySelector("#break-minute"),
    this.repeatHour = document.querySelector("#repeat-hour"),
    this.repeatMin = document.querySelector("#repeat-minute"),

    this.start = () => {
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
        this.check_duo(this.durHour, this.durMin)
        this.check_duo(this.breakHour, this.breakMin)
        this.check_duo(this.repeatHour, this.repeatMin)
        
        let timeInterval = new Countdown(this.durHour.value, this.durMin.value)
        let breakTime = new Countdown(this.breakHour.value, this.breakMin.value)
        let breakInterval = new Countdown(this.repeatHour.value, this.repeatMin.value)

        let clock = new Clock(timeInterval, breakTime, breakInterval)
        return clock
        }
        catch (e){
            return null
        }
    }

    this.keyPress = (event) =>{
        if (event.key == "Enter"){
            play()
        }
    }
}

let form = new Form()
form.start()

// ================================== Buttons ========================================

function play(){
    if (!configured){
        clock = form.submit()
        if(clock != null){
            configured = true;
        }
    }
    if (configured){
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
    
    entry = {entry:data}

    let headers = new Headers({
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
        });
    let init = { method: 'PATCH',
            headers: headers,
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify(entry)};
    fetch(`./history`, init).then(response => {
        response.json().then(response => {
            if(!response.auth){
                localStorage.removeItem("token")
                location.href = "./login.html"
            }
            else{
                if(!response.status){
                    requestNotification(response.data.message)
                }
            }})
        }).catch(error => requestNotification(error))
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