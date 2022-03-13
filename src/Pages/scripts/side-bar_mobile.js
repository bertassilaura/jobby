function openSideBar(){
    document.getElementById("mobile-side-bar").style.height = "100vh";
    document.getElementById("open-side-bar").style.opacity = "0";
};

function closeSideBar(){
    document.getElementById("mobile-side-bar").style.height = "0px";
    document.getElementById("open-side-bar").style.opacity = "1";
};

document.querySelector("#open-side-bar").addEventListener("click", openSideBar)
document.querySelector("#close-side-bar").addEventListener("click", closeSideBar)