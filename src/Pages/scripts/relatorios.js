function Entry(atividade, data, tempo_atividade, tempo_pausa){
    this.activity = atividade;
    this.date = data;
    this.active_time = tempo_atividade;
    this.break_time = tempo_pausa;
}

// =================== Classificar Dados ========================

function getWeekIntervals(){
    let today = new Date();
    today.setMilliseconds(0);
    today.setMinutes(0);
    today.setHours(0);
    today.setSeconds(0);

    let weekday = today.getDay();
    let regress = weekday * 86400000;

    let week_start = new Date(today.valueOf() - regress);
    let next_week_start = new Date(week_start.valueOf() + 604800000);
    let last_week_start = new Date(week_start.valueOf() - 604800000);

    return({inicio: week_start, fim: next_week_start, passada: last_week_start});
}

function getMonthIntervals(){
    let today = new Date();
    today.setMilliseconds(0);
    today.setMinutes(0);
    today.setHours(0);
    today.setSeconds(0);

    let this_month = new Date(today.getFullYear(), today.getMonth(), 1);
    let past_month = null;
    if (this_month.getMonth() == 0){
        past_month = new Date(this_month.getFullYear() - 1, 11, 1);
    }
    else{
        past_month = new Date(this_month.getFullYear(), this_month.getMonth() - 1, 1);
    }

    return({atual: this_month, passado: past_month});
}

function belongToWeek(entry_date, week_start, week_end){
    return((entry_date.valueOf() >= week_start.valueOf()) && (entry_date.valueOf() < week_end.valueOf()))
}

function belongToMonth(entry_date, month){
    return((entry_date.getMonth() == month.getMonth()) && (entry_date.getFullYear() == month.getFullYear()))
}

// =================== Filtrar Dados =========================

function filterWeek(data){
    week_interval = getWeekIntervals();
    let semana_atual = [];
    let semana_passada = [];
    for(i in data){
        if(belongToWeek(data[i].date, week_interval.inicio, week_interval.fim)){
            semana_atual.push(data[i]);
        }
        else if(belongToWeek(data[i].date, week_interval.passada ,week_interval.inicio)){
            semana_passada.push(data[i]);
        }
    }
    return {atual: semana_atual, passada: semana_passada};
}

function filterMonth(data){
    month_interval = getMonthIntervals();
    let mes_atual = [];
    let mes_passado = [];
    for(i in data){
        if(belongToMonth(data[i].date, month_interval.atual)){
            mes_atual.push(data[i]);
        }
        else if(belongToMonth(data[i].date, month_interval.passado)){
            mes_passado.push(data[i]);
        }
    }
    return {atual: mes_atual, passada: mes_passado};
}

// =================== Criar Gráfico de Pizza =========================

function createPieChart(data_entries){
    let values = {};
    let total = 0;

    for(let entry of data_entries){
        values[entry.activity] = values.hasOwnProperty(entry.activity)? values[entry.activity] + entry.active_time: entry.active_time;
        total += entry.active_time;
    }

    if (Object.keys(values).length == 1){
        return(`<svg viewBox="0 0 500 500" style="height: 100%;"> <circle cx="250" cy="250" r="250" fill="rgb(65, 82, 159)" </svg>`)
    }

    let valores_ordenados = [];

    /* Ordenar */
    
    for(atividade in values){
        let inserted = false;
        for(let i=0; i < valores_ordenados.length; i++)
            {
            if(values[atividade] > values[valores_ordenados[i]]){
                valores_ordenados.splice(i, 0, atividade);
                inserted = true;
                break
            }
        }
        if(!inserted){
            valores_ordenados.push(atividade)
        }
    }


    /* Categoria Outros, alterar 6 e 5 para mudar o número de legendas */
    if(valores_ordenados.length > 6){
        values["outros"] = 0;
        for(let i=valores_ordenados.length - 1; i >= 5; i--){
            values.outros += values[valores_ordenados[i]]
            valores_ordenados.pop(i);
        }
        valores_ordenados.push("outros")
    }


    let colors = ["rgb(65, 82, 159)", "rgb(13, 126, 131)", "rgb(97, 187, 182)", "rgb(216, 180, 226)","rgb(220, 123, 247)", "rgb(100, 141, 229)"]
    let i = 0;
    let percorrido = 0;
    let paths = "";
    let legenda = "";
    for(atividade of valores_ordenados){
        let percent = values[atividade]/total;
        let path = `<path d="M 250 250 L ${arc_coordinates(percorrido)} A 250 250 0 ${percent >= 0.5?1:0} 1 ${arc_coordinates(percent + percorrido)} z" fill="${colors[i]}" stroke="${colors[i]}" stroke-width="0.5"/>`
        legenda += `<div class="legenda__linha">
        <div class="legenda__color" style="background-color: ${colors[i]};"></div>
        <span class="legenda__text"  style="color: ${colors[i]};">${atividade}</span>
        </div>`;
        percorrido += values[atividade]/total;
        paths = paths + path;
        i += 1;
    }

    let svg = `<svg viewBox="0 0 500 500" style="height: 100%;"> ${paths} </svg>`
    document.getElementById("pizza").innerHTML = svg;
    document.getElementById("pizza-legend").innerHTML = legenda;
}

function percentToRad(percent){
    return(percent * 2 * Math.PI);
}

function arc_coordinates(percent){
    let rad = percentToRad(percent);
    let x = (250 * Math.cos(rad)) + 250; // 250 é o raio
    let y = (250 * Math.sin(rad)) + 250;
    return `${x} ${y}`;
}

// =================== Minutos de Pausa =========================

function minutesOfBreak(data_entries){
    let minutos_totais = 0;
    for(entrada in data_entries){
        minutos_totais += data_entries[entrada].break_time/60;
    }
    return Math.floor(minutos_totais);
}

// =================== Criar Gráfico de Linhas =========================

function createLineChart(data_entries, semanal){
    let maximo = 0;
    let values_atual = {}
    let values_passada = {}
    let n = 0;
    let x_scale = createXScale(semanal);
    let d_atual = "";
    let d_passada = "";
    if (semanal){
        for(let entry of data_entries.atual){
            values_atual[entry.date.getDay()] = values_atual.hasOwnProperty(entry.date.getDay())? values_atual[entry.date.getDay()] + entry.active_time: entry.active_time;
        }
        for(let entry of data_entries.passada){
            values_passada[entry.date.getDay()] = values_passada.hasOwnProperty(entry.date.getDay())? values_passada[entry.date.getDay()] + entry.active_time: entry.active_time;
        }
        n = 7;
        document.querySelector(".legend-item--atual .legend-text").innerHTML = "Semana Atual";
        document.querySelector(".legend-item--passada .legend-text").innerHTML = "Semana Passada";
    }
    else{
        for(let entry of data_entries.atual){
            values_atual[entry.date.getDate() - 1] = values_atual.hasOwnProperty(entry.date.getDate() - 1)? values_atual[entry.date.getDate() - 1] + entry.active_time: entry.active_time;
        }
        for(let entry of data_entries.passada){
            values_passada[entry.date.getDate() - 1] = values_passada.hasOwnProperty(entry.date.getDate() - 1)? values_passada[entry.date.getDate() - 1] + entry.active_time: entry.active_time;
        }
        n = 31;
        document.querySelector(".legend-item--atual .legend-text").innerHTML = "Mês Atual";
        document.querySelector(".legend-item--passada .legend-text").innerHTML = "Mês Passado";
    }

    for(let i = 0; i < n; i++){
        maximo = maximo < values_atual[i]? values_atual[i]: maximo;
        maximo = maximo < values_passada[i]? values_passada[i]: maximo;
    }

    maximo = Math.ceil(maximo/3600)*3600;

    d_atual += `M ${values_atual.hasOwnProperty(0)? lineCoordinates(values_atual[0], maximo, 0, n): lineCoordinates(0, maximo, 0, n)}`;
    d_passada += `M ${values_passada.hasOwnProperty(0)? lineCoordinates(values_passada[0], maximo, 0, n): lineCoordinates(0, maximo, 0, n)}`
    for(let i=1; i < n; i++){
        d_atual += `L ${values_atual.hasOwnProperty(i)? lineCoordinates(values_atual[i], maximo, i, n): lineCoordinates(0, maximo, i, n)}`;
        d_passada += `L ${values_passada.hasOwnProperty(i)? lineCoordinates(values_passada[i], maximo, i, n): lineCoordinates(0, maximo, i, n)}`
    }

    y_scale = createYScale(maximo);

    let svg = `        
    <svg viewBox="0 0 800 260" style="width: 100%;">

    ${x_scale}
    ${y_scale}

    <path d="M 32 10 L 32 210" stroke="grey" opacity="0.5"></path>
    <path d="M 800 10 L 800 210" stroke="grey" opacity="0.5"></path>
    <path d="M 32 210 L 800 210" stroke="grey" opacity="0.5" ></path>
    <path d="M 32 160 L 800 160" stroke="grey" opacity="0.5" stroke-dasharray="10,10"></path>
    <path d="M 32 110 L 800 110" stroke="grey" opacity="0.5"></path>
    <path d="M 32 60 L 800 60" stroke="grey" opacity="0.5" stroke-dasharray="10,10"></path>
    <path d="M 32 10 L 800 10" stroke="grey" opacity="0.5"></path>

    <path d="${d_passada}" stroke="#61BBB6" fill="none" stroke-width="4" stroke-linecap="round" path/>
    <path d="${d_atual}" stroke="#41529F" fill="none" stroke-width="4" stroke-linecap="round" path/>
    
    </svg>`

    document.getElementById("line-graph").innerHTML = svg;

}

function lineCoordinates(value, maximo, n_entrada, n_entradas){
    let yOffset = 10;
    let ySize = 200;

    let percent = value/maximo;
    let y = (ySize + yOffset) - (ySize*percent);
    let x = xCoordinate(n_entrada, n_entradas);

    return `${x} ${y}`
}

function xCoordinate(n_entrada, n_entradas){
    let xOffset = 32;
    let xSize = 768;

    let x = (xSize/(n_entradas*2)) + (n_entrada * (xSize/n_entradas)) + xOffset;
    return x;
}

function createXScale(semanal){
    let values = {};
    let n = 0;
    let scale = "";
    if(semanal){
        values = {0: "D", 1: "S", 2: "T", 3: "Q", 4: "Q", 5: "S", 6: "S"};
        n = 7;
    }
    else{
        values = {0: 1, 4: 5, 9: 10, 14: 15, 19: 20, 24: 25, 30: 31};
        n = 31;
    }

    for(i in values){
        scale += `<text class="line-graph__days" x="${xCoordinate(i, n) - textXOffset(values[i])}" y="247.5" fill="${i==0 || i==n - 1 ? "#41529F":"#61BBB6"}">${values[i]}</text>`
    }

    return scale;
}

function textXOffset(text){
    if(Number(text) === text){
        let offset = 0
        if(Number(text) % 1 !== 0){
            offset += 12
        }
        offset += Number(text) < 10? 10: 20;
        return offset 
    }
    else{
        return(text.length*10)
    }
}

function createYScale(maximo){
    let scale = "";
    maximo = Math.ceil(maximo/3600)


    scale += `<text class="line-graph__scale" x="${30 - textXOffset(maximo)}" y="15" fill="grey" opacity="0.8">${maximo}</text>
    <text class="line-graph__scale" x="${30 - textXOffset(maximo/2)}" y="115" fill="grey" opacity="0.8">${maximo/2}</text>
    <text class="line-graph__scale" x="20" y="215" fill="grey" opacity="0.8">0</text>`;
    return scale;
}

// =================== Comandos Gerais =========================

function semanal(data_entries){
    let dados_filtrados = filterWeek(data_entries);
    console.log(dados_filtrados)
    let intervalos = getWeekIntervals();
    intervalos.fim.setDate(intervalos.fim.getDate() - 1);

    document.getElementById("inicio-periodo").innerHTML = `${intervalos.inicio.getDate() <= 10? "0" + intervalos.inicio.getDate(): intervalos.inicio.getDate()}/${intervalos.inicio.getMonth() + 1 <=10? "0"+ (intervalos.inicio.getMonth() + 1): intervalos.inicio.getMonth() + 1}`;
    document.getElementById("fim-periodo").innerHTML = `${intervalos.fim.getDate() <= 10? "0" + intervalos.fim.getDate(): intervalos.fim.getDate()}/${intervalos.fim.getMonth() + 1 <=10? "0"+ (intervalos.fim.getMonth() + 1): intervalos.fim.getMonth() + 1}`;

    createPieChart(dados_filtrados.atual);
    document.getElementById("tempo-pausa").innerHTML = minutesOfBreak(dados_filtrados.atual);
    createLineChart(dados_filtrados, true);
}

function mensal(data_entries){
    let dados_filtrados = filterMonth(data_entries);

    let intervalos = getMonthIntervals();

    document.getElementById("inicio-periodo").innerHTML = `01/${intervalos.atual.getMonth() + 1 <=10? "0"+ (intervalos.atual.getMonth() + 1): intervalos.atual.getMonth() + 1}`;

    intervalos.atual.setMonth(intervalos.atual.getMonth() + 1);
    intervalos.atual.setDate(intervalos.atual.getDate() -1)

    document.getElementById("fim-periodo").innerHTML = `${intervalos.atual.getDate() <= 10? "0" + intervalos.atual.getDate(): intervalos.atual.getDate()}/${intervalos.atual.getMonth() + 1 <=10? "0"+ (intervalos.atual.getMonth() + 1): intervalos.atual.getMonth() + 1}`;

    createPieChart(dados_filtrados.atual);
    document.getElementById("tempo-pausa").innerHTML = minutesOfBreak(dados_filtrados.atual);
    createLineChart(dados_filtrados, false);
}


function periodChange(){
    let period = document.getElementById("period").value;
    if(period == "semanal"){
        semanal(data_entries);
    }
    else{
        mensal(data_entries);
    }
}

// =================== Start Data ========================

let user = null;
let data_entries = [];

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
           response.json().then(user_data => {user = user_data; setUserData()})
        }})
    }
    else{
        location.href = "./"
    }
}

function setUserData(){
    document.querySelector(".welcome-text__hello").innerHTML = `Olá, ${user.name}!`
}

async function getDataEntries(){
    let headers = new Headers({
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
    });
        
    let init = { method: 'GET',
            headers: headers,
            mode: 'cors',
            cache: 'default'};

    await fetch(`./history`, init).then(response => {
        if(!response.ok){
            response.json().then(data => {requestNotification(data.message)})
        }
        else{
            response.json().then(history => {
                                              data_entries = history.message.entries;
                                              data_entries.forEach((element, index, array) => {array[index].date = new Date(element.date)});
                                              semanal(data_entries);})
        }})


}

async function Start(){
    getUser()
    getDataEntries()
    document.getElementById("period").addEventListener("change", periodChange);
}

Start()