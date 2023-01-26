// ------------------------------------ ALERTS ---------------------------------------------------------

// -- ALERTA GLOBAL --
let espacoAlerta = document.getElementById('espaco-alerta') as HTMLDivElement;
let corpoAlerta: HTMLDivElement = document.createElement('div');

function mostrarAlerta(mensagem: string, tipo: string) {
    corpoAlerta.innerHTML = `
                        <div class="alert alert-${tipo} alert-dismissible" role="alert">
                                <div>${mensagem}</div>
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                        `;
    espacoAlerta.appendChild(corpoAlerta); 
    setTimeout(() => {
        corpoAlerta.innerHTML = '';
    }, 3000);  
}

// -- ALERTA MODAL --
let espacoAlertaModal = document.getElementById('espaco-alerta-modal') as HTMLDivElement;
let corpoAlertaModal: HTMLDivElement = document.createElement('div');

function mostrarAlertaModal(mensagem: string, tipo: string) {
    corpoAlertaModal.innerHTML = `
                        <div class="alert alert-${tipo} alert-dismissible" role="alert">
                                <div>${mensagem}</div>
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                        `;
    espacoAlertaModal.appendChild(corpoAlertaModal); 
    setTimeout(() => {
        corpoAlertaModal.innerHTML = '';
    }, 2000);  
}

// -------------------------------- DECLARAÇÃO DAS VÁRIAVEIS -------------------------------------------

// -- USUARIO LOGADO --
let userLogged: string | null = sessionStorage.getItem('usuarioLogado'); 

// -- MENU --
let menuDiv = document.querySelector('#menu-div') as HTMLDivElement;
let menuEmail = document.querySelector('#menu-email') as HTMLHeadingElement;
let chk = document.getElementById('chk') as HTMLInputElement;
let botaoSair = document.querySelector('#botao-sair') as HTMLButtonElement;

// -- ESPAÇO CARD --
let espacoCard = document.querySelector('#espaco-card') as HTMLDivElement;

// -- MODAL CRIAR --
let modalCriar = new bootstrap.Modal('#modal-criar');
let descricaoRecado = document.querySelector('#input-criar-descricao') as HTMLInputElement;
let detalhamentoRecado = document.querySelector('#input-criar-detalhamento') as HTMLInputElement;
let botaoCriar = document.querySelector('#botao-criar') as HTMLButtonElement;

// -- MODAL APAGAR --
let modalApagar = new bootstrap.Modal('#modal-apagar');
let btnApagarSim = document.getElementById('botao-sim') as HTMLButtonElement;

// -- MODAL EDITAR --
let modalEditar = new bootstrap.Modal('#modal-editar');
let inputEditDescricao = document.getElementById('input-editar-descricao') as HTMLInputElement;
let inputEditDetalhamento = document.getElementById('input-editar-detalhamento') as HTMLInputElement;
let btnAtualizar = document.getElementById('botao-atualizar') as HTMLButtonElement;

// -- INTERFACE RECADO --
interface Recado {
    id: number,
    descricao: string,
    detalhamento: string
}

// ------------------------------------- EVENTOS ---------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    if(!userLogged){
        mostrarAlerta('Voce precisa estar logado!', 'warning')

        setTimeout(() => {
            window.location.href = 'index.html';
        
        }, 3000);  
        
        return

    } else {
        carregarRecadosStorage();
    }
});

botaoCriar.addEventListener('click', () => {
    adicionarNovoRecado();
});

botaoSair.addEventListener('click', () =>{
    sairPagRecados();
});

// ------------------------------------- FUNÇÕES ---------------------------------------------------------

function buscarUsuarios(): Array<Usuario> {

    return JSON.parse(localStorage.getItem('usuarios')!);
}

function usuarioLogado(): Usuario{
    let listaUsuarios: Array<Usuario> = buscarUsuarios();

    
    let usuarioEncontrado = listaUsuarios.find((usuario) => usuario.email === userLogged)!;
    return usuarioEncontrado;
}

function carregarRecadosStorage() {
    let usuarioListaRecados = usuarioLogado();

    for(let recado of usuarioListaRecados.recados){
        mostrarNoHTML(recado);
    }

    menuEmail.innerHTML = usuarioListaRecados.email;

    if(usuarioListaRecados.dark === true) {
        chk.checked = true
        darkMode();
    }
    
}

function adicionarNovoRecado() {
    let usuarioRecados = usuarioLogado();

    let listaRecados: Recado[] = usuarioRecados.recados;
    let ultimoId: number = listaRecados.length + 1;

    if(listaRecados.length >= 2){
        let ultimoRegistro = listaRecados.reduce((anterior, proximo) => {
            if(anterior.id > proximo.id){
                return anterior
            }else{
                return proximo
            }
        });

        ultimoId = ultimoRegistro.id + 1;
    }

    let novoRecado: Recado = {
        id: ultimoId,
        descricao: descricaoRecado.value,
        detalhamento: detalhamentoRecado.value
    }

    if(descricaoRecado.value && detalhamentoRecado.value) {
        descricaoRecado.removeAttribute('style');
        detalhamentoRecado.removeAttribute('style');

        listaRecados.push(novoRecado);
        salvarNoStorage(listaRecados);
        mostrarNoHTML(novoRecado);
        limparCampos();
        modalCriar.hide();
        mostrarAlerta('Recado adicionado com sucesso', 'success');
    } else {
        if(!descricaoRecado.value){
            descricaoRecado.setAttribute('style', 'box-shadow: none; border-color: red');
            descricaoRecado.focus();
            mostrarAlertaModal('Preencha todos os campos', 'danger');

        }else if(!detalhamentoRecado.value){
            descricaoRecado.removeAttribute('style');
            detalhamentoRecado.setAttribute('style', 'box-shadow: none; border-color: red');
            detalhamentoRecado.focus();
            mostrarAlertaModal('Preencha todos os campos', 'danger');
        }  
    }
}

function mostrarNoHTML(novoRecado: Recado) {
    let cardContainer: HTMLDivElement = document.createElement('div');
    cardContainer.setAttribute('class', 'col-3 card me-3 my-3');
    cardContainer.setAttribute('id', `${novoRecado.id}`);
    cardContainer.setAttribute('style', 'width: 18rem; height: 18rem;');

    if (chk.checked) {
        cardContainer.classList.toggle('darkModeClaro');
    }

    let cardBody: HTMLDivElement = document.createElement('div');
    cardBody.setAttribute('class', 'card-body d-flex flex-column justify-content-between');

    let descricaoCard: HTMLHeadingElement = document.createElement('h5');
    descricaoCard.setAttribute('class', 'card-title');
    descricaoCard.innerHTML = novoRecado.descricao;

    let detalhamentoCard: HTMLParagraphElement = document.createElement('p');
    detalhamentoCard.setAttribute('class', 'card-text overflow-auto');
    detalhamentoCard.setAttribute('style', 'height: 8rem;');
    detalhamentoCard.innerHTML = novoRecado.detalhamento;

    let containerButtons: HTMLDivElement = document.createElement('div');
    containerButtons.setAttribute('class', 'container d-flex justify-content-end');

    let botaoApagar: HTMLButtonElement = document.createElement('button');
    botaoApagar.setAttribute('class', 'btn btn-danger fs-5 mx-2');
    botaoApagar.setAttribute('data-bs-toggle', 'modal');
    botaoApagar.setAttribute('data-bs-target', '#modal-apagar');
    botaoApagar.addEventListener('click', () => {
        apagarRecado(novoRecado.id);
    })
    botaoApagar.innerHTML = `<i class="bi bi-trash"></i>`;

    let botaoEditar: HTMLButtonElement = document.createElement('button');
    botaoEditar.setAttribute('class', 'btn btn-success fs-5');
    botaoEditar.setAttribute('data-bs-toggle', 'modal');
    botaoEditar.setAttribute('data-bs-target', '#modal-editar');
    botaoEditar.addEventListener('click', () => {
        editarRecado(novoRecado);
    })
    botaoEditar.innerHTML = `<i class="bi bi-pencil-square"></i>`;

    containerButtons.appendChild(botaoApagar);
    containerButtons.appendChild(botaoEditar);
    cardBody.appendChild(descricaoCard);
    cardBody.appendChild(detalhamentoCard);
    cardBody.appendChild(containerButtons);
    cardContainer.appendChild(cardBody);
    espacoCard.appendChild(cardContainer); 
}

function salvarNoStorage(listaRecados: Recado[]) {
    let usuarios = buscarUsuarios();
    let indiceUsuario = usuarios.findIndex((usuario) => usuario.email === userLogged);
    
   
    usuarios[indiceUsuario].recados = listaRecados;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

function limparCampos() {
    descricaoRecado.value = '';
    detalhamentoRecado.value = ''
}

function apagarRecado(id: number) {
    let usuarioListaRecados = usuarioLogado();
    let indiceRecado = usuarioListaRecados.recados.findIndex((recadoList) => recadoList.id == id);
    
    btnApagarSim.addEventListener('click', () =>{
        let listaCards = document.querySelectorAll('.card') as NodeListOf<HTMLDivElement>;

        for (let card of listaCards) {

           if (card.id == `${id}`){
            espacoCard.removeChild(card);
            usuarioListaRecados.recados.splice(indiceRecado, 1);
            modalApagar.hide();
            mostrarAlerta('Recado apagado!', 'success')
           }
        }
        salvarNoStorage(usuarioListaRecados.recados);
    });
}

function editarRecado(recado: Recado) {
    btnAtualizar.setAttribute('onclick', `atualizarRecado(${recado.id})`);
    inputEditDescricao.value = recado.descricao;
    inputEditDetalhamento.value = recado.detalhamento;
}

function atualizarRecado(id: number) {
    let recadoEdit: Recado = {
        id: id,
        descricao: inputEditDescricao.value,
        detalhamento: inputEditDetalhamento.value
    }

    let usuarioListaRecados = usuarioLogado();
    let indiceRecado = usuarioListaRecados.recados.findIndex((recadoList) => recadoList.id == id);

    usuarioListaRecados.recados[indiceRecado] = recadoEdit;
    
    let listaCards = document.querySelectorAll('.card') as NodeListOf<HTMLDivElement>;

    for (let card of listaCards) {

        if (card.id == `${id}`) {
            
            let descricaoRegistro = card.children[0].childNodes[0] as HTMLHeadingElement;
            let detalhamentoRegistro = card.children[0].childNodes[1] as HTMLParagraphElement;
            
            descricaoRegistro.innerHTML = recadoEdit.descricao;
            detalhamentoRegistro.innerHTML = recadoEdit.detalhamento;
        }
    }

    salvarNoStorage(usuarioListaRecados.recados);
    modalEditar.hide();
    mostrarAlerta('Recado atualizado!', 'primary');
}

function sairPagRecados() {
    sessionStorage.removeItem('usuarioLogado');

    window.location.href = 'index.html';
}

// ------------------------------------- DARK MODE ---------------------------------------------------------

// -- EVENTO --
chk.addEventListener('change', darkMode);

// -- FUNÇÃO --
function darkMode() {
   
    // -- FAZ AS MUDANÇAS P/ O DARK -- 
    document.body.classList.toggle('darkMode');
    menuDiv.classList.toggle('darkModeClaro');

    let listaModal = document.querySelectorAll('.modalDark') as NodeListOf<HTMLDivElement>;
    for (let modal of listaModal) {
        modal.classList.toggle('darkModeClaro');
    }

    let listaCards = document.querySelectorAll('.card') as NodeListOf<HTMLDivElement>;
    for (let card of listaCards) {
        card.classList.toggle('darkModeClaro');
    }
    
    // -- MUDA NO LOCALSTORAGE -- 
    let usuariosDark = buscarUsuarios();
    let indiceUsuario = usuariosDark.findIndex((usuario) => usuario.email === userLogged);

    if (chk.checked) {
        usuariosDark[indiceUsuario].dark = true; 
    } else {
        usuariosDark[indiceUsuario].dark = false;  
    }

    localStorage.setItem('usuarios', JSON.stringify(usuariosDark));
    
}



