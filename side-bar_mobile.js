function open_side_bar(){
    document.getElementById("mobile-side-bar").style.height = "100%";
    document.getElementById("mobile-header").getElementsByTagName("a")[0].style.opacity = "0";
};

function close_side_bar(){
    document.getElementById("mobile-side-bar").style.height = "0px";
    document.getElementById("mobile-header").getElementsByTagName("a")[0].style.opacity = "1";
};