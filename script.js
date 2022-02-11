let visibilidadeSelecionada = "Público";
let selecionado = "Todos";
let nomeDeUsuario;
let flag = false;
let data; 
let hora; 
let minutos; 
let segundos;
let horario;
let numeroDeUsuario = 0;

function informarNomeUsuario(){
    nomeDeUsuario = prompt("Digite o seu nome de usuário!");
}

informarNomeUsuario();
const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", {name:nomeDeUsuario});
promessa.then(entrarNaSala);
promessa.catch(deuErro);
promise.then(incrementaMenu);


function deuErro(erro){
    if(erro.response.status === 400){
        alert("Usuário já existe, por favor digite outro nome de usuário!");
        informarNomeUsuario();
    }
}

// function verificarParticipantes(resposta){
//     let promise3 = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
//     setInterval(()=>promise3.then(verificarParticipantes),10000);
//     console.log(resposta.data);
// }

function incrementaMenu(resposta){
    const incrementarMenu = document.querySelector(".contatos");
   // console.log(resposta.data);
    for(let i = 0; i < resposta.data.length; i++){
        incrementarMenu.innerHTML += `<div class="usuario" onclick="selecionarContato(this, 'nome${i}')">
        <ion-icon name="person-circle-sharp"></ion-icon>
        <p class="nome${i}">${resposta.data[i].name}</p>
        <div class="checked-contatos escondido"><ion-icon name="checkmark-sharp"></ion-icon></div>
        </div>`
    }
}


function criaMenu(){
    const criandoMenu = document.querySelector(".contatos");
    criandoMenu.innerHTML += `<div class="usuario" onclick="selecionarContato(this, '${numeroDeUsuario}')">
    <ion-icon name="person-circle-sharp"></ion-icon>
    <p class="${numeroDeUsuario}">${nomeDeUsuario}</p>
    <div class="checked-contatos escondido"><ion-icon name="checkmark-sharp"></ion-icon></div>
    </div>`
}


function informarHorario(){
    data = new Date();
    hora = data.getHours();
    minutos = data.getMinutes();
    segundos = data.getSeconds();
    return `${hora}:${minutos}:${segundos}`;
}


function enviarMensagem() {
    let msg = document.querySelector("input").value;
    const mensagem = document.querySelector("section");
    if(visibilidadeSelecionada === "Público"){
        horario = informarHorario();
        mensagem.innerHTML += `<div class="normal" data-identifier="message">
        <p> <time>(${horario})</time> <strong class="nome">${nomeDeUsuario}</strong> para <strong>${selecionado}:</strong> ${msg}</p>
        </div>`
        msg.value = "";
    }else if(visibilidadeSelecionada === "Reservadamente"){
        horario = informarHorario();
        mensagem.innerHTML += `<div class="reservada" data-identifier="message">
        <p> <time>(${horario})</time> <strong class="nome">${nomeDeUsuario}</strong> reservadamente para <strong>${selecionado}:</strong> ${msg}</p>
        </div>`
    }
}


function entrarNaSala(resposta) {
    const section = document.querySelector("section");
    horario = informarHorario();

    section.innerHTML += `<div class="entrou">
    <p> <time>(${horario})</time> <strong>${nomeDeUsuario}</strong> entra na sala...</p>
    </div>`;
    numeroDeUsuario++;

    const verificacao = axios.post("https://mock-api.driven.com.br/api/v4/uol/status",{name:nomeDeUsuario});
    setInterval(()=>verificacao.then(verificarSeEstaNaSala),5000);
}

function verificarSeEstaNaSala(resposta){
    if(resposta.status === 200){
        console.log("OK");
    }
}

function selecionarContato(elemento, nome){
    const user = document.querySelector(`.${nome}`);
    selecionado = user.innerHTML;
}

function selecionarVisibilidade(elemento,visibilidade){
    const escolha = document.querySelector(`.${visibilidade}`);
    visibilidadeSelecionada = escolha.innerHTML;
    console.log(escolha);
}

function apareceMenu(){
    const menu = document.querySelector("aside");
    menu.classList.remove("escondido");
}

function desapareceMenu(){
    const menu = document.querySelector("aside");
    if(menu.classList.contains("escondido") === false){
        menu.classList.add("escondido");
    }
}