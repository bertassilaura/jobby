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
            }})})
}

let hydrationMonitor = new HydrationMonitor()

function setData(){
    document.querySelector(".welcome-text__hello").innerHTML = `Olá, ${user.name}!`
    hydrationMonitor.setUp(user.hydration)
}

getUser()
