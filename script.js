let visibilidadeSelecionada = "Público";
let selecionado = "Todos";
let nomeDeUsuario;
let data;
let hora;
let minutos;
let segundos;
let horario;
let numeroDeUsuario = 0;

function informarNomeUsuario() {
    nomeDeUsuario = prompt("Digite o seu nome de usuário!");
}

informarNomeUsuario();
let promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", { name: nomeDeUsuario });
promessa.then(entrarNaSala);
promessa.catch(deuErro);
promise.then(mostrarParticipantes);
setInterval(() => {
    promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    promise.then(mostrarParticipantes)
}, 10000);

let promiseMensagens = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
promiseMensagens.then(carregarMensagens);

setInterval(() => {
    promiseMensagens = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promiseMensagens.then(atualizarMensagens);
}, 3000);

function deuErro(erro) {
    if (erro.response.status === 400) {
        alert("Usuário já existe, por favor digite outro nome de usuário!");
        window.location.reload();
    }
}


function mostrarParticipantes(resposta) {
    const incrementarMenu = document.querySelector(".contatos");
    incrementarMenu.innerHTML = `<div class="todos" onclick="selecionarContato(this, 'nome0')">
    <ion-icon name="people-sharp"></ion-icon>
    <p class="nome0">Todos</p>
    <div class="checked-contatos"><ion-icon name="checkmark-sharp"></ion-icon></div>`;
    for (let i = 0; i < resposta.data.length; i++) {
        incrementarMenu.innerHTML += `<div class="usuario" onclick="selecionarContato(this, 'nome${i}')">
            <ion-icon name="person-circle-sharp"></ion-icon>
            <p class="nome${i}">${resposta.data[i].name}</p>
            <div class="checked-contatos escondido"><ion-icon name="checkmark-sharp"></ion-icon></div>
            </div>`
    }
}

function informarHorario() {
    data = new Date();
    hora = data.getHours();
    minutos = data.getMinutes();
    segundos = data.getSeconds();
    return `${hora}:${minutos}:${segundos}`;
}

function enviarMensagensAoServidor(resposta) {
    let msg = document.querySelector("input").value;
    if (visibilidadeSelecionada === "Público") {
        const promiseEnvioMensagem = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", { from: nomeDeUsuario, to: selecionado, text: msg, type: "message" });
        promiseEnvioMensagem.then(obterNovamenteMensagensdoServidor);
        promiseEnvioMensagem.catch(erroMensagem);
        const input = document.querySelector("input");
        input.value = "";
    } else {
        const promiseEnvioMensagem = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", { from: nomeDeUsuario, to: selecionado, text: msg, type: "private_message" });
        promiseEnvioMensagem.then(obterNovamenteMensagensdoServidor);
        promiseEnvioMensagem.catch(erroMensagem);
        const input = document.querySelector("input");
        input.value = "";
    }

}

function erroMensagem(erro) {
    console.log(erro.response);
}

function obterNovamenteMensagensdoServidor(resposta) {
    const promiseAtualizarMensagens = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promiseAtualizarMensagens.then(atualizarMensagens);
}

function carregarMensagens(resposta) {
    const mensagem = document.querySelector("section");
    mensagem.lastElementChild.scrollIntoView()
    for (let i = 0; i < resposta.data.length; i++) {
        if (resposta.data[i].type === "message") {
            mensagem.innerHTML += `<div class="normal" data-identifier="message">
            <p> <time>(${resposta.data[i].time})</time> <strong class="nome">${resposta.data[i].from}</strong> para <strong>${resposta.data[i].to}:</strong> ${resposta.data[i].text}</p>
            </div>`;
            mensagem.lastElementChild.scrollIntoView()
        } else if (resposta.data[i].type === "private_message") {
            mensagem.innerHTML += `<div class="reservada" data-identifier="message">
            <p> <time>(${resposta.data[i].time})</time> <strong class="nome">${resposta.data[i].from}</strong> reservadamente para <strong>${resposta.data[i].to}:</strong> ${resposta.data[i].text}</p>
            </div>`;
            mensagem.lastElementChild.scrollIntoView()
        }
        else if (resposta.data[i].type === "status") {
            mensagem.innerHTML += `<div class="entrou" data-identifier="message">
            <p> <time>(${resposta.data[i].time})</time> <strong class="nome">${resposta.data[i].from}</strong> ${resposta.data[i].text}</p>
            </div>`;
            mensagem.lastElementChild.scrollIntoView()
        }
    }
}

function atualizarMensagens(resposta) {
    const mensagem = document.querySelector("section");
    mensagem.innerHTML = "";
    for (let i = 0; i < resposta.data.length; i++) {
        if (resposta.data[i].type === "message") {
            mensagem.innerHTML += `<div class="normal" data-identifier="message">
            <p> <time>(${resposta.data[i].time})</time> <strong class="nome">${resposta.data[i].from}</strong> para <strong>${resposta.data[i].to}:</strong> ${resposta.data[i].text}</p>
            </div>`;
            mensagem.lastElementChild.scrollIntoView()
        } else if (resposta.data[i].type === "private_message") {
            mensagem.innerHTML += `<div class="reservada" data-identifier="message">
            <p> <time>(${resposta.data[i].time})</time> <strong class="nome">${resposta.data[i].from}</strong> reservadamente para <strong>${resposta.data[i].to}:</strong> ${resposta.data[i].text}</p>
            </div>`;
            mensagem.lastElementChild.scrollIntoView()
        }
        else if (resposta.data[i].type === "status") {
            mensagem.innerHTML += `<div class="entrou" data-identifier="message">
            <p> <time>(${resposta.data[i].time})</time> <strong class="nome">${resposta.data[i].from}</strong> ${resposta.data[i].text}</p>
            </div>`;
            mensagem.lastElementChild.scrollIntoView()
        }
    }
    mensagem.lastElementChild.scrollIntoView()
}


function entrarNaSala(resposta) {
    const section = document.querySelector("section");
    horario = informarHorario();

    section.innerHTML += `<div class="entrou">
    <p> <time>(${horario})</time> <strong>${nomeDeUsuario}</strong> entra na sala...</p>
    </div>`;
    numeroDeUsuario++;

    let verificacao;
    setInterval(() => {
        verificacao = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", { name: nomeDeUsuario });
        verificacao.then(verificarSeEstaNaSala)
    }, 5000);
}

function verificarSeEstaNaSala(resposta) {
    if (resposta.status === 200) {
        console.log("OK");
    } else {
        window.location.reload();
    }
}

function selecionarContato(elemento, nome) {
    const user = document.querySelector(`.${nome}`);
    selecionado = user.innerHTML;
    const contatoSelecionado = document.querySelector(".selecionado");
    if (contatoSelecionado === null) {
        elemento.classList.add("selecionado");
    } else {
        contatoSelecionado.classList.remove("selecionado");
        elemento.classList.add("selecionado");
    }
}

function selecionarVisibilidade(elemento, visibilidade) {
    const escolha = document.querySelector(`.${visibilidade}`);
    const checkReservado = document.querySelector(".checked-lock");
    const checkPublico = document.querySelector(".checked");
    visibilidadeSelecionada = escolha.innerHTML;
    if (visibilidadeSelecionada === "Reservadamente") {
        checkReservado.classList.remove("escondido");
        checkPublico.classList.add("escondido");
    } else if (visibilidadeSelecionada === "Público") {
        if (checkPublico.classList.contains("escondido")) {
            checkPublico.classList.remove("escondido");
            checkReservado.classList.add("escondido");
        }
    }
}

function apareceMenu() {
    const menu = document.querySelector("aside");
    menu.classList.remove("escondido");
}

function desapareceMenu() {
    const menu = document.querySelector("aside");
    if (menu.classList.contains("escondido") === false) {
        menu.classList.add("escondido");
    }
}
