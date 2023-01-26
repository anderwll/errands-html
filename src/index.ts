// ------------------------------------ ALERT ---------------------------------------------------------

// -- ALERTA GLOBAL --
let espacoAlertaIndex = document.getElementById('espaco-alerta-index') as HTMLDivElement;
let corpoAlertaIndex: HTMLDivElement = document.createElement('div');

function alerta(mensagem: string, tipo: string) {
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
let container = document.getElementById('container') as HTMLDivElement;
let btnAcessar = document.getElementById('btn-acessar') as HTMLButtonElement;
let btnCadastrar = document.getElementById('btn-cadastrar') as HTMLButtonElement;
let btnAcessarMobile = document.getElementById('btn-acessar-mobile') as HTMLButtonElement;
let btnCadastrarMobile = document.getElementById('btn-cadastrar-mobile') as HTMLButtonElement;

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
let formularioCadastro = document.getElementById("form-cadastro") as HTMLFormElement;
let inputNome = document.getElementById("input-cadastro-nome") as HTMLInputElement;
let inputEmail = document.getElementById("input-cadastro-email") as HTMLInputElement;
let inputSenha = document.getElementById("input-cadastro-senha") as HTMLInputElement;
let inputRepetirSenha = document.getElementById("input-cadastro-senha-repetir") as HTMLInputElement;
let spanNotificacao = document.getElementById("span-notificacao") as HTMLSpanElement;

// -- INTERFACE USUARIO --
interface Usuario {
    nome: string;
    email: string;
    senha: string;
    dark: boolean;
    recados: Array<any>
}

// -- EVENTO --
formularioCadastro.addEventListener('submit', (event) => {
    event.preventDefault();

    verificarCampos();
});

// -- FUNÇÕES --
function verificarCampos(): void {
    if (inputNome.value === '' || inputNome.value.length < 3) {
        inputNome.focus();
        inputNome.value = '';
        inputNome.setAttribute('style', 'outline-color: red');
        spanNotificacao.innerHTML = 'Nome deve conter no mínimo 3 caracteres.'
        spanNotificacao.setAttribute('style', 'color: red');

    } else if (inputEmail.value === '' || inputEmail.value.length < 10) {
        inputEmail.focus();
        inputEmail.value = '';
        inputEmail.setAttribute('style', 'outline-color: red');
        spanNotificacao.innerHTML = 'Insira um e-mail válido.'
        spanNotificacao.setAttribute('style', 'color: red');

    } else if (inputSenha.value === '' || inputSenha.value.length < 8) {
        inputSenha.focus();
        inputSenha.value = '';
        inputSenha.setAttribute('style', 'outline-color: red');
        spanNotificacao.innerHTML = 'Senha deve conter no mínimo 8 caracteres.'
        spanNotificacao.setAttribute('style', 'color: red');

    }else if(inputRepetirSenha.value === '' || inputRepetirSenha.value != inputSenha.value) {
        inputRepetirSenha.focus();
        inputRepetirSenha.value = '';
        inputRepetirSenha.setAttribute('style', 'outline-color: red');
        spanNotificacao.innerHTML = 'As senhas não correspondem.'
        spanNotificacao.setAttribute('style', 'color: red');

    } else {
        inputEmail.removeAttribute('style');
        inputSenha.removeAttribute('style');
        inputRepetirSenha.removeAttribute('style');
        spanNotificacao.removeAttribute('style');
        spanNotificacao.innerHTML = 'Use seu e-mail para realizar seu cadastro'

        let novoUsuario: Usuario = {
            nome: inputNome.value,
            email: inputEmail.value,
            senha: inputSenha.value,
            dark: false,
            recados: []
        }

        formularioCadastro.reset();
        cadastrarUsuario(novoUsuario);
    }
}

function cadastrarUsuario(novoUsuario: Usuario): void {

    let usuarios: Array<Usuario> = buscarUsuariosStorage();

    let existe: boolean = usuarios.some((usuario) => {
        return usuario.email === novoUsuario.email
    });

    if (existe) {
        alerta('E-mail já cadastrado', 'warning');
        container.classList.remove('painel-direito-ativo');
        inputLoginEmail.focus();
        return
    }

    usuarios.push(novoUsuario);

    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alerta('Conta criada com sucesso', 'success');

    setTimeout(() => {
        container.classList.remove("painel-direito-ativo");
    }, 1000);
}

function buscarUsuariosStorage(): Array<Usuario> {

    return JSON.parse(localStorage.getItem('usuarios') || '[]');
}


// -------------------------------------- LOGIN DE USUÁRIO --------------------------------------------

// -- VÁRIAVEIS --
let inputLoginEmail = document.getElementById('input-login-email') as HTMLInputElement;
let inputLoginSenha = document.getElementById('input-login-senha') as HTMLInputElement;
let formularioLogin = document.getElementById('form-login') as HTMLFormElement;

// -- EVENTO --
formularioLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    logarNoSistema();
});

// -- FUNÇÃO --
function logarNoSistema(): void {
    let usuarios: Array<Usuario> = buscarUsuariosStorage();

    let existe: boolean = usuarios.some((usuario) => {
        return usuario.email === inputLoginEmail.value && usuario.senha === inputLoginSenha.value
    });

    if (!existe) {
        alerta('E-mail ou senha incorretos', 'danger')
        return
    }

    sessionStorage.setItem('usuarioLogado', inputLoginEmail.value);
    window.location.href = './home.html';
}