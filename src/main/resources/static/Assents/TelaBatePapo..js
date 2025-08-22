
    // Dados das conversas
const conversations = {
    'ana-souza': {
        id: 'ana-souza',
        name: 'Ana Souza',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        messages: [
            { sender: 'ana', text: 'Olá! Como vai? Gostei muito do seu trabalho na última exposição.', time: '14:20' },
            { sender: 'user', text: 'Oi Ana! Muito obrigado pelo feedback. Fico feliz que tenha gostado.', time: '14:22' },
            { sender: 'ana', text: 'Estou organizando um evento e gostaria de saber se você tem disponibilidade para participar no dia 15/10.', time: '14:23' },
            { sender: 'user', text: 'Vou verificar minha agenda. Que tipo de participação você está pensando?', time: '14:25' },
            { sender: 'ana', text: 'Seria uma pequena exposição com 3-4 obras suas e talvez uma rápida fala sobre seu processo criativo.', time: '14:27' },
            { sender: 'user', text: 'Parece interessante! Tenho disponibilidade nesse dia. Podemos conversar mais detalhes?', time: '14:30' },
            { sender: 'ana', text: 'Ótimo! Podemos marcar para sexta-feira um café para discutir os detalhes?', time: '14:32' }
        ],
        unread: 0,
        lastMessageTime: '14:32'
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

// Inicializa a lista de contatos
function initContacts() {
    const contactsList = document.getElementById('contactsList');
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
    document.getElementById('chatHeader').innerHTML = `
        <img src="${conversation.avatar}" alt="${conversation.name}" class="chat-header-avatar">
        <span class="chat-header-name">${conversation.name}</span>
        <span class="badge bg-primary ms-2">Online</span>
    `;
    
    // Atualiza as mensagens
    const messagesContainer = document.getElementById('chatMessages');
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
    
    // Ativa o input
    document.getElementById('messageInput').disabled = false;
    document.getElementById('sendButton').disabled = false;
    
    // Marca como lida
    conversation.unread = 0;
    
    // Atualiza a lista de contatos
    initContacts();
}

// Envia uma mensagem
function sendMessage() {
    const input = document.getElementById('messageInput');
    const messageText = input.value.trim();
    
    if (messageText && currentConversation) {
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
        
        // Simula uma resposta após 1-3 segundos
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

// Manipula o clique em um item do menu de anexos
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
        case 'contact':
            messageText = '👤 Contato compartilhado';
            additionalInfo = 'Maria Silva (Artista)';
            break;
    }
    
    // Adiciona a mensagem com anexo
    conversation.messages.push({
        sender: 'user',
        text: `${messageText}\n<small class="text-muted">${additionalInfo}</small>`,
        time: timeString
    });
    
    // Atualiza a última mensagem e hora
    conversation.lastMessageTime = 'Agora';
    
    // Recarrega a conversa
    loadConversation(currentConversation);
    
    // Fecha o menu de anexos
    document.getElementById('attachmentMenu').classList.remove('show');
    
    // Simula uma resposta após 1-3 segundos
    setTimeout(() => {
        const responses = {
            'photo': ["Ótima foto! Onde foi tirada?", "Adorei essa imagem!", "Que bela composição!"],
            'document': ["Recebi o documento, obrigado!", "Vou analisar e te retorno.", "Documento recebido com sucesso."],
            'audio': ["Obrigado pelo áudio!", "Entendi sua mensagem.", "Vou ouvir com atenção."],
            'location': ["Obrigado pela localização!", "Vou verificar no mapa.", "Que lugar interessante!"],
            'contact': ["Obrigado pelo contato!", "Já entrei em contato com essa pessoa.", "Vou adicionar aos meus contatos."]
        };
        
        const randomResponse = responses[type][Math.floor(Math.random() * responses[type].length)];
        
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

// Pesquisa contatos
document.getElementById('searchContact').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        const contactName = item.querySelector('.contact-name').textContent.toLowerCase();
        if (contactName.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
});

// Mostra/esconde o menu de anexos
document.getElementById('attachBtn').addEventListener('click', function(e) {
    e.stopPropagation();
    const menu = document.getElementById('attachmentMenu');
    menu.classList.toggle('show');
});

// Fecha o menu de anexos ao clicar fora
document.addEventListener('click', function() {
    document.getElementById('attachmentMenu').classList.remove('show');
});

// Impede que o clique no menu feche ele
document.getElementById('attachmentMenu').addEventListener('click', function(e) {
    e.stopPropagation();
});

// Event listeners
document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Inicializa o app
initContacts();


