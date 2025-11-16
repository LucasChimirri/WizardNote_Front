// Services.js - Funcionalidades da WizardNote

// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    
    // Seleciona os botões da página inicial
    const loginBtn = document.getElementById('loginBtn');
    const cadastroBtn = document.getElementById('cadastroBtn');

    // Verifica se os botões existem (página inicial)
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            console.log('Botão Login clicado');
            window.location.href = 'Acessar_conta.html';
        });
    }

    if (cadastroBtn) {
        cadastroBtn.addEventListener('click', function() {
            console.log('Botão Cadastro clicado');
            window.location.href = 'Criar_conta.html';
        });
    }

    // Formulário de Cadastro
    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const nome = document.getElementById('nome').value;
            const senha = document.getElementById('senha').value;

            console.log('Cadastro:', { email, nome, senha });
            
            // Aqui você implementaria a lógica de cadastro
            const resultado = criarCadastro(nome, email, senha);
            
            if (resultado.sucesso) {
                alert('Cadastro realizado com sucesso!');
                window.location.href = 'Acessar_conta.html';
            }
        });
    }

    // Formulário de Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const lembrarMe = document.getElementById('lembrarMe').checked;

            console.log('Login:', { email, senha, lembrarMe });
            
            // Aqui você implementaria a lógica de login
            const resultado = validarLogin(email, senha);
            
            if (resultado) {
                alert('Login realizado com sucesso!');
                // Redirecionar para página principal
                window.location.href = 'Tela_inicio.html';
            } else {
                alert('E-mail ou senha incorretos!');
            }
        });
    }

    // ========== FUNCIONALIDADES DA TELA INICIAL ==========
    
    // Dropdown do usuário
    const userMenuBtn = document.getElementById('userMenuBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (userMenuBtn && dropdownMenu) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });

        // Fechar dropdown ao clicar fora
        document.addEventListener('click', function(e) {
            if (!userMenuBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('active');
            }
        });
    }

    // Link de Configurações
    const configLink = document.getElementById('configLink');
    if (configLink) {
        configLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Abrindo Configurações...');
            alert('Página de Configurações em desenvolvimento');
        });
    }

    // Link de Logout
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Fazendo logout...');
            if (confirm('Deseja realmente sair?')) {
                window.location.href = 'Login.html';
            }
        });
    }

    // Botão Criar Nova Nota
    const createNoteBtn = document.getElementById('createNoteBtn');
    if (createNoteBtn) {
        createNoteBtn.addEventListener('click', function() {
            console.log('Criando nova nota...');
            alert('Funcionalidade de criar nota em desenvolvimento');
        });
    }

    // Busca de notas
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            console.log('Buscando por:', searchTerm);
            filtrarNotas(searchTerm);
        });
    }

    // Filtro de notas
    const filterInput = document.getElementById('filterInput');
    if (filterInput) {
        filterInput.addEventListener('input', function(e) {
            const filterTerm = e.target.value.toLowerCase();
            console.log('Filtrando por:', filterTerm);
            filtrarNotas(filterTerm);
        });
    }

    // Click nas notas
    const noteCards = document.querySelectorAll('.note-card');
    noteCards.forEach(card => {
        card.addEventListener('click', function() {
            const noteId = this.getAttribute('data-note-id');
            console.log('Nota clicada:', noteId);
            alert(`Abrindo nota ${noteId}`);
        });
    });

    // Adiciona efeito de animação suave ao carregar a página
    const leftSide = document.querySelector('.left-side');
    const rightSide = document.querySelector('.right-side');
    
    if (leftSide && rightSide) {
        leftSide.style.opacity = '0';
        rightSide.style.opacity = '0';
        
        setTimeout(() => {
            leftSide.style.transition = 'opacity 1s ease-in';
            rightSide.style.transition = 'opacity 1s ease-in';
            leftSide.style.opacity = '1';
            rightSide.style.opacity = '1';
        }, 100);
    }
});

// Função para validar login
function validarLogin(email, senha) {
    // Aqui você implementaria a lógica de validação com backend
    if (email && senha) {
        console.log('Validando credenciais...');
        return true;
    }
    return false;
}

// Função para criar novo cadastro
function criarCadastro(nome, email, senha) {
    // Aqui você implementaria a lógica de cadastro com backend
    console.log('Criando novo usuário...');
    return {
        sucesso: true,
        mensagem: 'Cadastro realizado com sucesso!'
    };
}

// Exporta funções para uso em outros arquivos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validarLogin,
        criarCadastro
    };
}