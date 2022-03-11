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

    await fetch(`./user`, init).then(response => response.json().then(user_data => user = user_data))
    document.querySelector(".welcome-text__hello").innerHTML = `Olá, ${user.name}!`
    createItems()}
    else{
        location.href = "./"
    }
}

getUser()

// =================== Create Items ========================

function formatTime(time){
    let text = "";
    text += time.hours==0? "": time.hours + "h";
    text += time.minutes==0? "": time.minutes + "min";

    return text;
}

function createItem(index){
    data = user.custom_times[index]

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

    let edit = document.createElement("DIV")
    edit.classList.add("custom-times__edit")

    let editButton = document.createElement("button")
    editButton.classList.add("btn_edit")

    let editIcon = document.createElement("span")
    editIcon.classList.add("fas", "fa-pen", "btn_edit__icon")

    editButton.appendChild(editIcon);
    edit.appendChild(editButton)
    edit.id = data.id;
    edit.addEventListener("click", edit_click)

    item.appendChild(time)
    item.appendChild(edit)
    item.setAttribute("index", data.id)

    return item;
}

function edit_click(){
    let index = this.parentNode.getAttribute("index")
    window.location = `./editar_horario.html?id=${index}`
}
 
let container = document.querySelector(".custom-times");

function createItems(){
    for (let i = 0; i < user.custom_times.length; i++)
    {
        let item = createItem(i)
        container.appendChild(item)
    }
}

document.querySelector(".btn-add-time").addEventListener("click", ()=>{window.location.assign('./adicionar_horario.html')})