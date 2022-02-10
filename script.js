

let nomeDeUsuario;
let flag = false;
let data; 
let hora; 
let minutos; 
let segundos;
let horario;

function informarNomeUsuario(){
    if(flag !== true){
        nomeDeUsuario = prompt("Digite o seu nome de usuário!");
        flag = true;
    }
}

informarNomeUsuario();

function informarHorario(){
    data = new Date();
    hora = data.getHours();
    minutos = data.getMinutes();
    segundos = data.getSeconds();
    return `${hora}:${minutos}:${segundos}`;
}

const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", {name:nomeDeUsuario});
promessa.then(entrarNaSala);
promessa.then(deuErro());


function deuErro(erro){
    if(erro.status = 409){
        alert("Usuário já existe, por favor digite outro nome de usuário!");
        flag = false;
        informarNomeUsuario();
        window.location.reload();
    }
}

function enviarMensagem() {
    let msg = document.querySelector("input").value;
    const mensagem = document.querySelector("section");
    horario = informarHorario();
    mensagem.innerHTML += `<div class="normal">
    <p> <time>(${horario})</time> <strong class="nome">${nomeDeUsuario}</strong> para <strong>Todos:</strong> ${msg}</p>
    </div>`
    msg.value = "";
}


function entrarNaSala() {
    const section = document.querySelector("section");
    horario = informarHorario();

    section.innerHTML += `<div class="entrou">
    <p> <time>(${horario})</time> <strong>${nomeDeUsuario}</strong> entra na sala...</p>
    </div>`;
}