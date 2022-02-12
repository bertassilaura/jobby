// =================== Mock up data ========================

function TimeInterval(hours, minutes){
    this.hours = hours,
    this.minutes = minutes
}

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

    let edit = document.createElement("DIV")
    edit.classList.add("custom-times__edit")

    let editButton = document.createElement("button")
    editButton.classList.add("btn_edit")

    let editIcon = document.createElement("span")
    editIcon.classList.add("fas", "fa-pen", "btn_edit__icon")

    editButton.appendChild(editIcon);
    edit.appendChild(editButton)
    edit.id = id;
    edit.addEventListener("click", edit_click)

    item.appendChild(time)
    item.appendChild(edit)
    item.setAttribute("index", id)

    return item;
}

function edit_click(){
    let index = this.parentNode.getAttribute("index")
    window.location = `./editar_horario.html?id=${index}`
}
 
let container = document.querySelector(".custom-times");

for (id in customTimes){
    let item = createItem(id)
    container.appendChild(item)
}

document.querySelector(".btn-add-time").addEventListener("click", ()=>{window.location.assign('./adicionar_horario.html')})