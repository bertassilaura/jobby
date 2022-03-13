// =================== Start Data ========================

let user = null

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

    await fetch(`./user`, init).then(response => {
        if(!response.ok){
            response.json().then(data => {requestNotification(data.message)})
        }
        else{
           response.json().then(user_data => {user = user_data; setData()})
        }})
    }
    else{
        location.href = "./"
    }
}

let hydrationMonitor = new HydrationMonitor()

function setData(){
    document.querySelector(".welcome-text__hello").innerHTML = `Olá, ${user.name}!`
    createItems()
    hydrationMonitor.setUp(user.hydration)
}

function createItems(){
    for (let i = 0; i < user.custom_times.length; i++)
    {
        let item = createItem(i)
        container.appendChild(item)
    }
}
getUser()

// =================== Mock up data ========================

function TimeInterval(hours, minutes){
    this.hours = hours,
    this.minutes = minutes
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


function Clock(name, time, breakInterval, breakTime){
    this.interval = null,
    this.time = time,
    this.breakTime = breakTime,
    this.breakInterval = breakInterval,
    this.timeCountdown = new Countdown(this.time.hours, this.time.minutes),
    this.breakCountdown = new Countdown(this.breakInterval.hours, this.breakInterval.minutes),
    this.name = name,
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
        document.getElementById("atividades").style.display = "none";
        this.interval = setInterval(this.count, 1000);
    },

    this.pause = () =>{
        clearInterval(this.interval);
        this.pauseStatus = true;
    },

    this.stop = () =>{
        document.getElementById("break-popup").style.display = "none";
        document.getElementById("atividades").style.display = "inline";
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
        return {activity: this.name, date: Date.now(), active_time: passed_time, break_time: total_break_time};
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
    audio.volume = 0.5;
    audio.play()
}

// ================================== Buttons ========================================

function play(){
    
    if (configured) {
        clock.start();
        document.querySelector(".clock").style.display = "flex";
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
    document.querySelector(".clock").style.display = "none";
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
            fetch("./history", init).then(response =>
                {
                    if(!response.ok){
                        response.json().then(data => {requestNotification(data.message)})
                    }
                    else{
                        requestNotification("Atividade salva com sucesso!", true)
                    }
                    }).catch(error => requestNotification(error))


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
    data = user.custom_times[id]
    console.log(data)

    let item = document.createElement("DIV");
    item.classList.add("custom-times__item");

    let time = document.createElement("DIV");
    time.classList.add("time");

    let timeName = document.createElement("DIV");
    timeName.classList.add("time__item");
    timeName.innerHTML = data.name;

    let timeInterval = document.createElement("DIV");
    timeInterval.classList.add("time__item");
    timeInterval.innerHTML = formatTime(data.timeInterval);

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
    let data = user.custom_times[index]
    let hour = data.timeInterval.hours
    let minute = data.timeInterval.minutes
    let time = new Countdown(hour, minute);

    hour = data.breakInterval.hours
    minute = data.breakInterval.minutes
    let breakInterval = new Countdown(hour, minute);
    
    hour = data.breakTime.hours
    minute = data.breakTime.minutes
    let breakTime = new Countdown(hour, minute);

    clock = new Clock(data.name, time, breakInterval, breakTime);
    document.querySelector(".clock").style.display = "flex";
    document.getElementById("stop-button").style.display = "inline";
    document.getElementById("pause-button").style.display = "inline";
    document.getElementById("play-button").style.display = "none";
    configured = true
    clock.start()
}
 
let container = document.querySelector(".custom-times");





