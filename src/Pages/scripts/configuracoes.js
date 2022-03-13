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
    hydrationMonitor.setUp(user.hydration)
}

getUser()
