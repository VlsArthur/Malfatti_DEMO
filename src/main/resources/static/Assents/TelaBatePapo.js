// Dados das conversas
const conversations = {
    'ana-souza': {
        id: 'ana-souza',
        name: 'Ana Souza',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        messages: [], // Primeira pessoa sem mensagens iniciais
        unread: 0,
        lastMessageTime: ''
    },
    'carlos-mendes': {
        id: 'carlos-mendes',
        name: 'Carlos Mendes',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        messages: [
            { sender: 'carlos', text: 'Bom dia! Você recebeu meu último email sobre a proposta?', time: '09:15' },
            { sender: 'user', text: 'Bom dia Carlos! Recebi sim, estou analisando.', time: '10:30' },
            { sender: 'carlos', text: 'Ótimo! Qualquer dúvida pode me chamar.', time: '10:35' },
            { sender: 'user', text: 'Obrigado! Já te aviso.', time: '10:36' },
            { sender: 'carlos', text: 'Obrigado pelo feedback!', time: 'Ontem' }
        ],
        unread: 1,
        lastMessageTime: '10:35'
    },
    'mariana-oliveira': {
        id: 'mariana-oliveira',
        name: 'Mariana Oliveira',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        messages: [
            { sender: 'mariana', text: 'Oi! Tudo bem?', time: '13:45' },
            { sender: 'user', text: 'Tudo ótimo! E com você?', time: '13:50' },
            { sender: 'mariana', text: 'Tudo bem também! Enviei os detalhes do evento...', time: '13:55' }
        ],
        unread: 0,
        lastMessageTime: '13:55'
    },
    'pedro-santos': {
        id: 'pedro-santos',
        name: 'Pedro Santos',
        avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
        messages: [
            { sender: 'pedro', text: 'E aí, como está o projeto?', time: 'Seg' },
            { sender: 'user', text: 'Indo bem! Preciso de mais algumas informações.', time: 'Seg' },
            { sender: 'pedro', text: 'Sim, ainda tenho vagas para...', time: 'Seg' }
        ],
        unread: 2,
        lastMessageTime: 'Seg'
    },
    'beatriz-lima': {
        id: 'beatriz-lima',
        name: 'Beatriz Lima',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
        messages: [
            { sender: 'beatriz', text: 'Olá! Vi seu portfólio e adorei seu estilo.', time: 'Sex' },
            { sender: 'user', text: 'Oi Beatriz! Que legal que gostou.', time: 'Sex' },
            { sender: 'beatriz', text: 'Obrigada pelo interesse!', time: 'Sex' }
        ],
        unread: 0,
        lastMessageTime: 'Sex'
    },
    'joao-silva': {
        id: 'joao-silva',
        name: 'João Silva',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        messages: [],
        unread: 0,
        lastMessageTime: ''
    },
    'maria-costa': {
        id: 'maria-costa',
        name: 'Maria Costa',
        avatar: 'https://randomuser.me/api/portraits/women/25.jpg',
        messages: [],
        unread: 0,
        lastMessageTime: ''
    },
    'lucas-oliveira': {
        id: 'lucas-oliveira',
        name: 'Lucas Oliveira',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        messages: [],
        unread: 0,
        lastMessageTime: ''
    }
};

// Estado atual
let currentConversation = null;
let isRecording = false;
let recordingTimer = null;
let recordingStartTime = null;

// Inicializa a lista de contatos
function initContacts() {
    const contactsList = document.getElementById('contactsList');
    
    // Verifica se o elemento existe
    if (!contactsList) {
        console.error('Elemento contactsList não encontrado!');
        return;
    }
    
    contactsList.innerHTML = '';
    
    for (const [id, contact] of Object.entries(conversations)) {
        const lastMessage = contact.messages.length > 0 ? contact.messages[contact.messages.length - 1] : null;
        
        const contactItem = document.createElement('div');
        contactItem.className = `contact-item ${currentConversation === id ? 'active' : ''}`;
        contactItem.dataset.id = id;
        contactItem.innerHTML = `
            <img src="${contact.avatar}" alt="${contact.name}" class="contact-avatar">
            <div class="contact-info">
                <div class="d-flex align-items-center">
                    <div class="contact-name">${contact.name}</div>
                    ${contact.lastMessageTime ? `<div class="contact-time">${contact.lastMessageTime}</div>` : ''}
                </div>
                ${lastMessage ? `<div class="contact-lastmsg">${lastMessage.text}</div>` : '<div class="contact-lastmsg">Nenhuma mensagem ainda</div>'}
            </div>
            ${contact.unread > 0 ? `<div class="unread-badge">${contact.unread}</div>` : ''}
        `;
        
        contactItem.addEventListener('click', () => loadConversation(id));
        contactsList.appendChild(contactItem);
    }
}

// Carrega uma conversa
function loadConversation(conversationId) {
    currentConversation = conversationId;
    const conversation = conversations[conversationId];
    
    // Atualiza o header com o avatar da pessoa
    const chatHeader = document.getElementById('chatHeader');
    if (chatHeader) {
        chatHeader.innerHTML = `
            <img src="${conversation.avatar}" alt="${conversation.name}" class="chat-header-avatar">
            <span class="chat-header-name">${conversation.name}</span>
            <span class="badge bg-success ms-2">Online</span>
        `;
    }
    
    // Atualiza as mensagens
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer) {
        messagesContainer.innerHTML = '';
        
        if (conversation.messages.length === 0) {
            messagesContainer.innerHTML = `
                <div class="no-conversation">
                    <i class="bi bi-chat-square-text"></i>
                    <h5>Nenhuma mensagem ainda</h5>
                    <p>Inicie uma conversa com ${conversation.name}</p>
                </div>
            `;
        } else {
            conversation.messages.forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${msg.sender === 'user' ? 'message-sent sent' : 'message-received received'}`;
                messageDiv.innerHTML = `
                    <div class="message-content">${msg.text}</div>
                    <div class="message-info">${msg.sender === 'user' ? 'Você' : conversation.name} • ${msg.time}</div>
                `;
                messagesContainer.appendChild(messageDiv);
            });
            
            // Rolagem para a última mensagem
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
    
    // Ativa o input
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    
    if (messageInput) messageInput.disabled = false;
    if (sendButton) sendButton.disabled = false;
    
    // Marca como lida
    conversation.unread = 0;
    
    // Atualiza a lista de contatos
    initContacts();
}

// Envia uma mensagem
function sendMessage() {
    const input = document.getElementById('messageInput');
    
    if (!input || !currentConversation) return;
    
    const messageText = input.value.trim();
    
    if (messageText) {
        const conversation = conversations[currentConversation];
        const now = new Date();
        const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        // Adiciona a mensagem enviada
        conversation.messages.push({
            sender: 'user',
            text: messageText,
            time: timeString
        });
        
        // Atualiza a última mensagem e hora
        conversation.lastMessageTime = 'Agora';
        
        // Recarrega a conversa
        loadConversation(currentConversation);
        input.value = '';
        
        // Resposta específica para "Bom dia" da Ana Souza
        if (currentConversation === 'ana-souza' && messageText.toLowerCase().includes('bom dia')) {
            setTimeout(() => {
                conversation.messages.push({
                    sender: 'ana',
                    text: 'Bom dia! Em que posso ajudar?',
                    time: 'Agora'
                });
                
                conversation.lastMessageTime = 'Agora';
                loadConversation(currentConversation);
                initContacts();
            }, 1000);
        } else {
            // Simula uma resposta após 1-3 segundos para outros casos
            setTimeout(() => {
                const responses = [
                    "Claro, podemos marcar sim!",
                    "Que ótima ideia!",
                    "Vou verificar minha agenda e te aviso.",
                    "Obrigada pelo interesse no meu trabalho!",
                    "Podemos discutir mais detalhes pessoalmente?",
                    "Excelente proposta!",
                    "Vamos combinar os detalhes por aqui mesmo.",
                    "Perfeito! Estou animado com essa colaboração.",
                    "Ótimo! Qualquer dúvida pode me perguntar."
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                
                // Adiciona a resposta
                conversation.messages.push({
                    sender: currentConversation.split('-')[0],
                    text: randomResponse,
                    time: 'Agora'
                });
                
                // Atualiza a última mensagem e hora
                conversation.lastMessageTime = 'Agora';
                
                // Recarrega a conversa
                loadConversation(currentConversation);
                
                // Atualiza a lista de contatos
                initContacts();
            }, 1000 + Math.random() * 2000);
        }
    }
}

// Manipula anexos
function handleAttachment(type) {
    if (!currentConversation) return;
    
    const conversation = conversations[currentConversation];
    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    let messageText = '';
    let additionalInfo = '';
    
    switch(type) {
        case 'photo':
            messageText = '📷 Foto enviada';
            additionalInfo = 'imagem.jpg (2.4 MB)';
            break;
        case 'camera':
            messageText = '📸 Foto capturada';
            additionalInfo = 'captura.jpg (1.8 MB)';
            break;
        case 'document':
            messageText = '📄 Documento enviado';
            additionalInfo = 'proposta.pdf (1.8 MB)';
            break;
        case 'audio':
            messageText = '🎤 Áudio enviado';
            additionalInfo = '0:45';
            break;
        case 'location':
            messageText = '📍 Localização enviada';
            additionalInfo = 'Galeria de Arte Moderna, São Paulo';
            break;
    }
    
    // Adiciona a mensagem com anexo
    conversation.messages.push({
        sender: 'user',
        text: `${messageText}<br><small class="text-muted">${additionalInfo}</small>`,
        time: timeString
    });
    
    // Atualiza a última mensagem e hora
    conversation.lastMessageTime = 'Agora';
    
    // Recarrega a conversa
    loadConversation(currentConversation);
    
    // Fecha o menu de anexos
    const attachmentMenu = document.getElementById('attachmentMenu');
    if (attachmentMenu) {
        attachmentMenu.classList.remove('show');
    }
    
    // Simula uma resposta
    setTimeout(() => {
        const responses = {
            'photo': ["Ótima foto! Onde foi tirada?", "Adorei essa imagem!", "Que bela composição!"],
            'camera': ["Excelente captura!", "Que momento interessante!", "Gostei da foto!"],
            'document': ["Recebi o documento, obrigado!", "Vou analisar e te retorno.", "Documento recebido com sucesso."],
            'audio': ["Obrigado pelo áudio!", "Entendi sua mensagem.", "Vou ouvir com atenção."],
            'location': ["Obrigado pela localização!", "Vou verificar no mapa.", "Que lugar interessante!"]
        };
        
        const randomResponse = responses[type][Math.floor(Math.random() * responses[type].length)];
        
        conversation.messages.push({
            sender: currentConversation.split('-')[0],
            text: randomResponse,
            time: 'Agora'
        });
        
        conversation.lastMessageTime = 'Agora';
        loadConversation(currentConversation);
        initContacts();
    }, 1000 + Math.random() * 2000);
}

// Funções de gravação de áudio
function startAudioRecording() {
    if (!currentConversation) return;
    
    isRecording = true;
    recordingStartTime = Date.now();
    
    // Mostra a UI de gravação
    const recordingUI = document.getElementById('audioRecordingUI');
    if (recordingUI) {
        recordingUI.style.display = 'block';
    }
    
    // Fecha o menu de anexos
    const attachmentMenu = document.getElementById('attachmentMenu');
    if (attachmentMenu) {
        attachmentMenu.classList.remove('show');
    }
    
    // Inicia o timer
    recordingTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timerElement = document.getElementById('recordingTimer');
        if (timerElement) {
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function stopAudioRecording() {
    if (!isRecording) return;
    
    isRecording = false;
    clearInterval(recordingTimer);
    
    // Esconde a UI de gravação
    const recordingUI = document.getElementById('audioRecordingUI');
    if (recordingUI) {
        recordingUI.style.display = 'none';
    }
    
    // Simula o envio do áudio
    handleAttachment('audio');
}

// Função para inicializar todos os event listeners
function initEventListeners() {
    // Botão enviar
    const sendButton = document.getElementById('sendButton');
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    // Enter no input
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Pesquisa contatos
    const searchContact = document.getElementById('searchContact');
    if (searchContact) {
        searchContact.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const contactItems = document.querySelectorAll('.contact-item');
            
            contactItems.forEach(item => {
                const contactName = item.querySelector('.contact-name');
                if (contactName) {
                    const name = contactName.textContent.toLowerCase();
                    if (name.includes(searchTerm)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    }

    // Menu de anexos
    const attachBtn = document.getElementById('attachBtn');
    if (attachBtn) {
        attachBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const menu = document.getElementById('attachmentMenu');
            if (menu) {
                menu.classList.toggle('show');
            }
        });
    }

    // Fecha o menu de anexos ao clicar fora
    document.addEventListener('click', function() {
        const attachmentMenu = document.getElementById('attachmentMenu');
        if (attachmentMenu) {
            attachmentMenu.classList.remove('show');
        }
    });

    // Impede que o clique no menu feche ele
    const attachmentMenu = document.getElementById('attachmentMenu');
    if (attachmentMenu) {
        attachmentMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Event listeners para itens de anexo
    document.querySelectorAll('.attachment-item').forEach(item => {
        item.addEventListener('click', function() {
            const type = this.dataset.type;
            if (type === 'audio') {
                startAudioRecording();
            } else {
                handleAttachment(type);
            }
        });
    });

    // Botão de parar gravação
    const stopRecording = document.getElementById('stopRecording');
    if (stopRecording) {
        stopRecording.addEventListener('click', stopAudioRecording);
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando chat...');
    initContacts();
    initEventListeners();
});

// Fallback caso DOMContentLoaded já tenha disparado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM carregado, inicializando chat...');
        initContacts();
        initEventListeners();
    });
} else {
    console.log('DOM já carregado, inicializando chat...');
    initContacts();
    initEventListeners();
}