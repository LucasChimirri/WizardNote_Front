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

    // ========== GERENCIAMENTO DE NOTAS ==========
    
    // Inicializar gerenciador de notas apenas se estivermos na tela de notas
    if (document.getElementById('notesGrid')) {
        const notesManager = new NotesManager();
        // Tornar disponível globalmente para debug (opcional)
        window.notesManager = notesManager;
    }

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

// ========== CLASSE GERENCIADORA DE NOTAS ==========

class NotesManager {
    constructor() {
        this.notes = this.loadNotes();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderNotes();
    }

    // Carregar notas do localStorage
    loadNotes() {
        const savedNotes = localStorage.getItem('wizardNotes');
        return savedNotes ? JSON.parse(savedNotes) : [];
    }

    // Salvar notas no localStorage
    saveNotes() {
        localStorage.setItem('wizardNotes', JSON.stringify(this.notes));
    }

    // Configurar event listeners
    setupEventListeners() {
        // Botão abrir modal
        const createNoteBtn = document.getElementById('createNoteBtn');
        if (createNoteBtn) {
            createNoteBtn.addEventListener('click', () => this.openModal());
        }

        // Botões do modal
        const modalFecharBtn = document.getElementById('modalFecharBtn');
        const modalCriarBtn = document.getElementById('modalCriarBtn');
        const modalResumirBtn = document.getElementById('modalResumirBtn');
        const modalOverlay = document.getElementById('modalCreateNote');

        if (modalFecharBtn) {
            modalFecharBtn.addEventListener('click', () => this.closeModal());
        }

        if (modalCriarBtn) {
            modalCriarBtn.addEventListener('click', () => this.createNote());
        }

        if (modalResumirBtn) {
            modalResumirBtn.addEventListener('click', () => this.generateSummary());
        }

        // Fechar ao clicar fora
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }

        // Dropdown do usuário
        this.setupUserDropdown();

        // Busca e filtros
        this.setupSearchAndFilters();
    }

    // Abrir modal
    openModal() {
        const modalOverlay = document.getElementById('modalCreateNote');
        if (modalOverlay) {
            modalOverlay.classList.add('active');
            // Focar no campo de título
            const titleInput = document.getElementById('noteTitleInput');
            if (titleInput) {
                setTimeout(() => titleInput.focus(), 100);
            }
        }
    }

    // Fechar modal
    closeModal() {
        const modalOverlay = document.getElementById('modalCreateNote');
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            this.clearModalFields();
        }
    }

    // Limpar campos do modal
    clearModalFields() {
        const form = document.getElementById('noteForm');
        const tagsInput = document.getElementById('noteTagsInput');
        
        if (form) form.reset();
        if (tagsInput) tagsInput.value = '';
    }

    // Criar nova nota
    createNote() {
        const titleInput = document.getElementById('noteTitleInput');
        const contentInput = document.getElementById('noteContentInput');
        const resumoInput = document.getElementById('noteResumoInput');
        const tagsInput = document.getElementById('noteTagsInput');

        if (!titleInput || !contentInput) {
            console.error('Elementos do formulário não encontrados');
            this.showNotification('Erro ao acessar os campos do formulário.', 'error');
            return;
        }

        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        const resumo = resumoInput ? resumoInput.value.trim() : '';
        const tagsInputValue = tagsInput ? tagsInput.value.trim() : '';

        console.log('Valores capturados:', { title, content, resumo, tagsInputValue });

        // Validação
        if (!title && !content) {
            this.showNotification('Por favor, preencha pelo menos o título ou conteúdo da nota.', 'error');
            return;
        }

        // Processar tags
        const tags = tagsInputValue ? tagsInputValue.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

        // Criar objeto da nota
        const newNote = {
            id: Date.now(),
            title: title || 'Sem título',
            content: content,
            resumo: resumo || this.autoGenerateResumo(content),
            tags: tags,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Adicionar à lista de notas
        this.notes.unshift(newNote);
        this.saveNotes();
        this.renderNotes();

        // Fechar modal e mostrar sucesso
        this.closeModal();
        this.showNotification('Nota criada com sucesso! ✨', 'success');
        
        console.log('Nova nota criada:', newNote);
    }

    // Gerar resumo automático simples
    autoGenerateResumo(content) {
        if (!content) return '';
        
        // Pegar as primeiras 100 caracteres
        const maxLength = 100;
        if (content.length <= maxLength) return content;
        
        return content.substring(0, maxLength).trim() + '...';
    }

    // Gerar resumo (pode ser integrado com IA futuramente)
    generateSummary() {
        const contentInput = document.getElementById('noteContentInput');
        const content = contentInput ? contentInput.value.trim() : '';
        
        if (!content) {
            this.showNotification('Por favor, adicione algum conteúdo antes de resumir.', 'warning');
            return;
        }

        // Resumo automático simples
        const resumo = this.autoGenerateResumo(content);
        const resumoInput = document.getElementById('noteResumoInput');
        if (resumoInput) {
            resumoInput.value = resumo;
        }
        
        this.showNotification('Resumo gerado! Você pode editá-lo.', 'success');
        console.log('Resumo gerado:', resumo);
    }

    // Renderizar notas no grid
    renderNotes() {
        const notesGrid = document.getElementById('notesGrid');
        if (!notesGrid) return;
        
        // Limpar grid
        notesGrid.innerHTML = '';

        // Se não houver notas, mostrar mensagem
        if (this.notes.length === 0) {
            notesGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #999;">
                    <p style="font-size: 1.2rem; margin-bottom: 10px;">📝</p>
                    <p>Nenhuma nota criada ainda. Clique em "Crie uma nota ..." para começar!</p>
                </div>
            `;
            return;
        }

        // Renderizar cada nota
        this.notes.forEach((note, index) => {
            const noteCard = this.createNoteCard(note, index);
            notesGrid.appendChild(noteCard);
        });
    }

    // Criar card de nota
    createNoteCard(note, index) {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.setAttribute('data-note-id', note.id);

        // Aplicar classes especiais para layout diferenciado
        if (index === 0) {
            card.style.gridRow = 'span 2';
            card.style.minHeight = '320px';
        } else if (index === 3) {
            card.style.gridColumn = 'span 2';
            card.style.gridRow = 'span 2';
            card.style.minHeight = '320px';
        }

        // Formatar data
        const date = new Date(note.createdAt);
        const formattedDate = date.toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });

        // Conteúdo do card
        card.innerHTML = `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <h3 style="font-size: 1.1rem; color: #333; margin-bottom: 10px; font-weight: 600;">
                    ${this.escapeHtml(note.title)}
                </h3>
                <p style="font-size: 0.85rem; color: #666; margin-bottom: 12px; line-height: 1.5; flex: 1; overflow: hidden;">
                    ${this.escapeHtml(note.resumo || note.content.substring(0, 150) + '...')}
                </p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                    <span style="font-size: 0.75rem; color: #999;">${formattedDate}</span>
                    ${note.tags.length > 0 ? `
                        <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                            ${note.tags.slice(0, 2).map(tag => `
                                <span style="font-size: 0.7rem; background-color: #999; color: #fff; padding: 3px 8px; border-radius: 4px;">
                                    ${this.escapeHtml(tag)}
                                </span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Adicionar evento de clique para visualizar/editar
        card.addEventListener('click', () => this.viewNote(note.id));

        return card;
    }

    // Visualizar nota
    viewNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;

        console.log('Visualizando nota:', note);
        
        // Por enquanto, mostrar um alert com o conteúdo
        // Futuramente, pode abrir um modal de visualização/edição
        const tagsText = note.tags.length > 0 ? `\n\nTags: ${note.tags.join(', ')}` : '';
        alert(`📝 ${note.title}\n\n${note.content}${note.resumo ? `\n\nResumo:\n${note.resumo}` : ''}${tagsText}`);
    }

    // Configurar dropdown do usuário
    setupUserDropdown() {
        const userMenuBtn = document.getElementById('userMenuBtn');
        const dropdownMenu = document.getElementById('dropdownMenu');

        if (userMenuBtn && dropdownMenu) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('active');
            });

            document.addEventListener('click', () => {
                dropdownMenu.classList.remove('active');
            });
        }

        // Logout
        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Fazendo logout...');
                if (confirm('Tem certeza que deseja sair?')) {
                    // Redirecionar para página de login
                    window.location.href = 'Login.html';
                }
            });
        }

        // Configurações
        const configLink = document.getElementById('configLink');
        if (configLink) {
            configLink.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Abrindo configurações...');
                alert('Página de configurações em desenvolvimento...');
            });
        }
    }

    // Configurar busca e filtros
    setupSearchAndFilters() {
        const searchInput = document.getElementById('searchInput');
        const filterInput = document.getElementById('filterInput');

        // Busca em tempo real
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                console.log('Buscando por:', searchTerm);
                this.filterNotes(searchTerm, filterInput ? filterInput.value : '');
            });
        }

        // Filtro
        if (filterInput) {
            filterInput.addEventListener('input', (e) => {
                const filterTerm = e.target.value.toLowerCase();
                console.log('Filtrando por:', filterTerm);
                this.filterNotes(searchInput ? searchInput.value : '', filterTerm);
            });
        }
    }

    // Filtrar notas
    filterNotes(searchTerm, filterTerm) {
        const notesGrid = document.getElementById('notesGrid');
        if (!notesGrid) return;

        const noteCards = notesGrid.querySelectorAll('.note-card');

        noteCards.forEach(card => {
            const noteId = parseInt(card.getAttribute('data-note-id'));
            const note = this.notes.find(n => n.id === noteId);
            
            if (!note) return;

            const searchMatch = !searchTerm || 
                note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                note.resumo.toLowerCase().includes(searchTerm.toLowerCase());

            const filterMatch = !filterTerm ||
                note.tags.some(tag => tag.toLowerCase().includes(filterTerm.toLowerCase()));

            if (searchMatch && filterMatch) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Mostrar notificação
    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;

        // Estilos baseados no tipo
        const styles = {
            success: 'background-color: #4caf50; color: white;',
            error: 'background-color: #f44336; color: white;',
            warning: 'background-color: #ff9800; color: white;',
            info: 'background-color: #2196f3; color: white;'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            font-size: 0.95rem;
            z-index: 3000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            animation: slideInRight 0.3s ease;
            ${styles[type] || styles.info}
        `;

        document.body.appendChild(notification);

        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Escapar HTML para prevenir XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ========== ANIMAÇÕES CSS PARA NOTIFICAÇÕES ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========== FUNÇÕES AUXILIARES ==========

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