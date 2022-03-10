
function configurate_custom_switches(){
    let custom_switches = document.getElementsByClassName("switch");
    let n_switches = custom_switches.length;
    
    let checkElmnt;
    for (i = 0; i < n_switches; i++) {
    checkElmnt = custom_switches[i].querySelector("input");
    let svg = `<svg class="switch__svg" viewBox="0 0 200 100">
    <g>
        <path d="M 50 100, A 50 50 1 1 1 50 0, L 150 0, A 50 50 1 1 1 150 100 z" fill="#C4C4C4">
            <animate attributeName="fill" to="#41529F" dur="0.5s" begin="on_animation.begin" fill="freeze" restart="always"></animate>
            <animate attributeName="fill" to="#C4C4C4" dur="0.5s" begin="off_animation.begin" fill="freeze" restart="always"></animate>
        </path>
        <text class="switch__text" x="110" y="62.5" fill="white" font-size="35">
            OFF
            <animate attributeName="opacity" to="0" dur="0.5s" begin="on_animation.begin" fill="freeze" restart="always"></animate>
            <animate attributeName="opacity" to="1" dur="0.5s" begin="off_animation.begin" fill="freeze" restart="always"></animate>
        </text>
        <text class="switch__text" x="40" y="62.5" fill="white" font-size="35" opacity="0">
            ON
            <animate attributeName="opacity" to="1" dur="0.5s" begin="on_animation.begin" fill="freeze" restart="always"></animate>
            <animate attributeName="opacity" to="0" dur="0.5s" begin="off_animation.begin" fill="freeze" restart="always"></animate>
        </text>
        <circle cx="50" cy="50" r="35" fill="white"> 
            <animate id="on_animation" attributeName="cx" to="150" dur="0.5s" begin="indefinite" fill="freeze" restart="always"></animate>
            <animate id="off_animation" attributeName="cx" to="50" dur="0.5s" begin="indefinite" fill="freeze" restart="always"></animate>
        </circle>
    </g>
    </svg>`

    custom_switches[i].innerHTML += svg;
    custom_switches[i].addEventListener("click", switch_click)
    }
}

function switch_click(){
    let checkBox = this.querySelector("input")
    if (checkBox.checked == true){
        this.querySelector("#off_animation").beginElement();
        checkBox.checked = false
        
    }
    else{
        this.querySelector("#on_animation").beginElement();
        checkBox.checked = true
    }
    
    let event = new Event("change");
    checkBox.dispatchEvent(event);
}

configurate_custom_switches();