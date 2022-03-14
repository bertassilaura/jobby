// =================== Redirect ========================

if(localStorage.getItem("token") !== null){
    location.href = "./time_tracker.html"
}


// =================== Side-bar ========================


function openSideBar(){
    document.getElementById("mobile-nav-bar").style.left = "10vw";
    document.getElementById("open-side-bar").style.opacity = "0";
};

function closeSideBar(){
    document.getElementById("mobile-nav-bar").style.left = "100vw";
    document.getElementById("open-side-bar").style.opacity = "1";
};

document.querySelector("#open-side-bar").addEventListener("click", openSideBar)
document.querySelector("#close-side-bar").addEventListener("click", closeSideBar)
document.querySelectorAll(".mobile-nav-link a").forEach((link) => {link.addEventListener("click", closeSideBar)})