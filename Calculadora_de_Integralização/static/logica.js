// ==========================================
// DADOS E ESTADOS
// ==========================================

const todasMaterias = [
    { id: 'CIC0201', nome: 'Engenharia de Software', creditos: 4 },
    { id: 'CIC0199', nome: 'Inteligência Artificial', creditos: 4 },
    { id: 'CIC0204', nome: 'Sistemas Distribuídos', creditos: 4 },
    { id: 'CIC0301', nome: 'Redes de Computadores', creditos: 4 },
    { id: 'MAT0025', nome: 'Cálculo 1', creditos: 6 },
    { id: 'MAT0026', nome: 'Cálculo 2', creditos: 6 },
    { id: 'FGA0158', nome: 'Orientação a Objetos', creditos: 4 },
    { id: 'FGA0138', nome: 'Métodos de Desenvolvimento', creditos: 4 }
];

let disponiveis = [...todasMaterias]; 
let selecionadas = [];
let porcentagemBase = 42.0;

// Elementos do DOM
const listaEsquerda = document.getElementById('listaEsquerda');
const listaDireita = document.getElementById('listaDireita');
const emptyState = document.getElementById('emptyState');
const elTotalCreditos = document.getElementById('totalCreditos');
const elNovaIntegralizacao = document.getElementById('novaIntegralizacao');
const searchInput = document.getElementById('searchInput');
const btnSalvar = document.getElementById('btnSalvar');


// ==========================================
// FUNÇÕES DE RENDERIZAÇÃO (UI)
// ==========================================

function criarCardMateria(materia, tipo) {
    const div = document.createElement('div');
    div.className = 'materia-card fade-in';
    div.setAttribute('data-id', materia.id);

    const btnHTML = tipo === 'add' 
        ? `<button class="action-btn btn-add" onclick="adicionarMateria('${materia.id}')">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
           </button>`
        : `<button class="action-btn btn-remove" onclick="removerMateria('${materia.id}')">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
           </button>`;

    div.innerHTML = `
        <div class="materia-info">
            <div class="materia-codigo">${materia.id}</div>
            <div class="materia-nome">${materia.nome}</div>
            <span class="tag-creditos">${materia.creditos} créditos</span>
        </div>
        ${btnHTML}
    `;
    return div;
}

function renderizarTudo() {
    listaEsquerda.innerHTML = '';
    listaDireita.innerHTML = '';
    listaDireita.appendChild(emptyState);

    disponiveis.forEach(m => {
        listaEsquerda.appendChild(criarCardMateria(m, 'add'));
    });

    if (selecionadas.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        selecionadas.forEach(m => {
            listaDireita.appendChild(criarCardMateria(m, 'remove'));
        });
    }

    atualizarStats();
    aplicarFiltroBusca();
}

function atualizarStats() {
    const totalCreditos = selecionadas.reduce((acc, curr) => acc + curr.creditos, 0);
    elTotalCreditos.textContent = totalCreditos;
    
    const novaPorc = porcentagemBase + (totalCreditos * 0.5);
    elNovaIntegralizacao.textContent = novaPorc.toFixed(1) + '%';
}


// ==========================================
// INTERATIVIDADE (ADD / REMOVE / BUSCA)
// ==========================================

window.adicionarMateria = function(id) {
    const index = disponiveis.findIndex(m => m.id === id);
    if (index === -1) return;
    
    const materia = disponiveis[index];

    const card = listaEsquerda.querySelector(`div[data-id="${id}"]`);
    if(card) {
        card.classList.remove('fade-in');
        card.classList.add('fade-out');
    }

    setTimeout(() => {
        disponiveis.splice(index, 1);
        selecionadas.push(materia);
        renderizarTudo();
    }, 300); 
};

window.removerMateria = function(id) {
    const index = selecionadas.findIndex(m => m.id === id);
    if (index === -1) return;

    const materia = selecionadas[index];

    const card = listaDireita.querySelector(`div[data-id="${id}"]`);
    if(card) {
        card.classList.remove('fade-in');
        card.classList.add('fade-out');
    }

    setTimeout(() => {
        selecionadas.splice(index, 1);
        disponiveis.push(materia); 
        renderizarTudo();
    }, 300);
};

function aplicarFiltroBusca() {
    const termo = searchInput.value.toLowerCase();
    const cards = listaEsquerda.querySelectorAll('.materia-card');

    cards.forEach(card => {
        const codigo = card.querySelector('.materia-codigo').textContent.toLowerCase();
        const nome = card.querySelector('.materia-nome').textContent.toLowerCase();
        
        if (codigo.includes(termo) || nome.includes(termo)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

searchInput.addEventListener('input', aplicarFiltroBusca);

// ==========================================
// INTEGRAÇÃO COM PDF GENERATOR
// ==========================================

btnSalvar.addEventListener('click', () => {
    // Chama a função que está no outro arquivo (pdf_generator.js)
    // Passando os dados atuais como argumento
    if (typeof gerarPDFSimulacao === "function") {
        gerarPDFSimulacao(
            selecionadas, 
            elTotalCreditos.textContent, 
            elNovaIntegralizacao.textContent
        );
    } else {
        console.error("Função gerarPDFSimulacao não encontrada. Verifique se o script foi carregado.");
        alert("Erro ao gerar PDF. Tente novamente.");
    }
});

// Inicializa a tela
renderizarTudo();