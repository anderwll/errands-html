"use strict";
// ------------------------------------ ALERT ---------------------------------------------------------
// -- ALERTA GLOBAL --
let espacoAlertaIndex = document.getElementById('espaco-alerta-index');
let corpoAlertaIndex = document.createElement('div');
function alerta(mensagem, tipo) {
    corpoAlertaIndex.innerHTML = `
                        <div class="alert alert-${tipo} alert-dismissible" role="alert">
                                <div>${mensagem}</div>
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                        `;
    espacoAlertaIndex.appendChild(corpoAlertaIndex);
    setTimeout(() => {
        corpoAlertaIndex.innerHTML = '';
    }, 3000);
}
// -------------------------------- ANIMAÇÃO PAINEL ------------------------------------------------
// -- VÁRIAVEIS --
let container = document.getElementById('container');
let btnAcessar = document.getElementById('btn-acessar');
let btnCadastrar = document.getElementById('btn-cadastrar');
let btnAcessarMobile = document.getElementById('btn-acessar-mobile');
let btnCadastrarMobile = document.getElementById('btn-cadastrar-mobile');
// -- EVENTO --
btnAcessarMobile.addEventListener('click', () => {
    container.classList.remove('painel-direito-ativo');
});
btnCadastrarMobile.addEventListener('click', () => {
    container.classList.add('painel-direito-ativo');
});
btnAcessar.addEventListener('click', () => {
    container.classList.remove('painel-direito-ativo');
});
btnCadastrar.addEventListener('click', () => {
    container.classList.add('painel-direito-ativo');
});
// -------------------------------- CADASTRO DE USUÁRIOS -------------------------------------------
// -- VÁRIAVEIS --
let formularioCadastro = document.getElementById("form-cadastro");
let inputNome = document.getElementById("input-cadastro-nome");
let inputEmail = document.getElementById("input-cadastro-email");
let inputSenha = document.getElementById("input-cadastro-senha");
let inputRepetirSenha = document.getElementById("input-cadastro-senha-repetir");
let spanNotificacao = document.getElementById("span-notificacao");
// -- EVENTO --
formularioCadastro.addEventListener('submit', (event) => {
    event.preventDefault();
    verificarCampos();
});
// -- FUNÇÕES --
function verificarCampos() {
    if (inputNome.value === '' || inputNome.value.length < 3) {
        inputNome.focus();
        inputNome.value = '';
        inputNome.setAttribute('style', 'outline-color: red');
        spanNotificacao.innerHTML = 'Nome deve conter no mínimo 3 caracteres.';
        spanNotificacao.setAttribute('style', 'color: red');
    }
    else if (inputEmail.value === '' || inputEmail.value.length < 10) {
        inputEmail.focus();
        inputEmail.value = '';
        inputEmail.setAttribute('style', 'outline-color: red');
        spanNotificacao.innerHTML = 'Insira um e-mail válido.';
        spanNotificacao.setAttribute('style', 'color: red');
    }
    else if (inputSenha.value === '' || inputSenha.value.length < 8) {
        inputSenha.focus();
        inputSenha.value = '';
        inputSenha.setAttribute('style', 'outline-color: red');
        spanNotificacao.innerHTML = 'Senha deve conter no mínimo 8 caracteres.';
        spanNotificacao.setAttribute('style', 'color: red');
    }
    else if (inputRepetirSenha.value === '' || inputRepetirSenha.value != inputSenha.value) {
        inputRepetirSenha.focus();
        inputRepetirSenha.value = '';
        inputRepetirSenha.setAttribute('style', 'outline-color: red');
        spanNotificacao.innerHTML = 'As senhas não correspondem.';
        spanNotificacao.setAttribute('style', 'color: red');
    }
    else {
        inputEmail.removeAttribute('style');
        inputSenha.removeAttribute('style');
        inputRepetirSenha.removeAttribute('style');
        spanNotificacao.removeAttribute('style');
        spanNotificacao.innerHTML = 'Use seu e-mail para realizar seu cadastro';
        let novoUsuario = {
            nome: inputNome.value,
            email: inputEmail.value,
            senha: inputSenha.value,
            dark: false,
            recados: []
        };
        formularioCadastro.reset();
        cadastrarUsuario(novoUsuario);
    }
}
function cadastrarUsuario(novoUsuario) {
    let usuarios = buscarUsuariosStorage();
    let existe = usuarios.some((usuario) => {
        return usuario.email === novoUsuario.email;
    });
    if (existe) {
        alerta('E-mail já cadastrado', 'warning');
        container.classList.remove('painel-direito-ativo');
        inputLoginEmail.focus();
        return;
    }
    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alerta('Conta criada com sucesso', 'success');
    setTimeout(() => {
        container.classList.remove("painel-direito-ativo");
    }, 1000);
}
function buscarUsuariosStorage() {
    return JSON.parse(localStorage.getItem('usuarios') || '[]');
}
// -------------------------------------- LOGIN DE USUÁRIO --------------------------------------------
// -- VÁRIAVEIS --
let inputLoginEmail = document.getElementById('input-login-email');
let inputLoginSenha = document.getElementById('input-login-senha');
let formularioLogin = document.getElementById('form-login');
// -- EVENTO --
formularioLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    logarNoSistema();
});
// -- FUNÇÃO --
function logarNoSistema() {
    let usuarios = buscarUsuariosStorage();
    let existe = usuarios.some((usuario) => {
        return usuario.email === inputLoginEmail.value && usuario.senha === inputLoginSenha.value;
    });
    if (!existe) {
        alerta('E-mail ou senha incorretos', 'danger');
        return;
    }
    sessionStorage.setItem('usuarioLogado', inputLoginEmail.value);
    window.location.href = './home.html';
}
