
// Variáveis para gravação de áudio
let mediaRecorder;
let audioChunks = [];
let recordingStartTime;

// Event listeners para os anexos
document.getElementById('attachPhoto').addEventListener('click', () => {
    document.getElementById('photoInput').click();
});

document.getElementById('attachCamera').addEventListener('click', () => {
    document.getElementById('cameraInput').click();
});

document.getElementById('attachDocument').addEventListener('click', () => {
    document.getElementById('documentInput').click();
});

document.getElementById('attachAudio').addEventListener('click', startAudioRecording);
document.getElementById('stopRecording').addEventListener('click', stopAudioRecording);
document.getElementById('attachLocation').addEventListener('click', shareLocation);

// Manipuladores de arquivos
document.getElementById('photoInput').addEventListener('change', (e) => handleFileUpload(e, 'photo'));
document.getElementById('cameraInput').addEventListener('change', (e) => handleFileUpload(e, 'photo'));
document.getElementById('documentInput').addEventListener('change', (e) => handleFileUpload(e, 'document'));

// Função para enviar arquivos
function handleFileUpload(event, type) {
    if (!currentConversation) return;
    
    const file = event.target.files[0];
    if (!file) return;
    
    const conversation = conversations[currentConversation];
    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    let messageText = '';
    let additionalInfo = '';
    
    if (type === 'photo') {
        messageText = '📷 Foto enviada';
        additionalInfo = `${file.name} (${formatFileSize(file.size)})`;
        
        // Se for uma imagem, podemos mostrar uma miniatura
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                sendAttachmentMessage(conversation, timeString, 
                    `${messageText}<br><img src="${e.target.result}" style="max-width: 200px; max-height: 200px; border-radius: 5px; margin-top: 5px;">`, 
                    additionalInfo);
            };
            reader.readAsDataURL(file);
            return;
        }
    } else if (type === 'document') {
        messageText = '📄 Documento enviado';
        additionalInfo = `${file.name} (${formatFileSize(file.size)})`;
    }
    
    sendAttachmentMessage(conversation, timeString, `${messageText}<br><small class="text-muted">${additionalInfo}</small>`, additionalInfo);
}

// Função para formatar tamanho de arquivo
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Função para gravar áudio
async function startAudioRecording() {
    try {
        document.getElementById('attachmentMenu').classList.remove('show');
        document.getElementById('audioRecordingUI').style.display = 'block';
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            sendAudioMessage(audioBlob);
            stream.getTracks().forEach(track => track.stop());
        };
        
        recordingStartTime = Date.now();
        updateRecordingTimer();
        mediaRecorder.start();
    } catch (error) {
        console.error('Erro ao acessar o microfone:', error);
        alert('Não foi possível acessar o microfone. Por favor, verifique as permissões.');
    }
}

function updateRecordingTimer() {
    const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    document.getElementById('recordingTimer').textContent = `${minutes}:${seconds}`;
    
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        setTimeout(updateRecordingTimer, 1000);
    }
}

function stopAudioRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        document.getElementById('audioRecordingUI').style.display = 'none';
    }
}

function sendAudioMessage(audioBlob) {
    if (!currentConversation) return;
    
    const conversation = conversations[currentConversation];
    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    const audioUrl = URL.createObjectURL(audioBlob);
    const duration = Math.floor((Date.now() - recordingStartTime) / 1000);
    const durationStr = `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`;
    
    const messageText = `🎤 Áudio enviado<br>
        <audio controls style="width: 100%; margin-top: 5px;">
            <source src="${audioUrl}" type="audio/wav">
        </audio>`;
    
    sendAttachmentMessage(conversation, timeString, messageText, durationStr);
}

// Função para compartilhar localização
function shareLocation() {
    if (!currentConversation) return;
    
    document.getElementById('attachmentMenu').classList.remove('show');
    
    if (!navigator.geolocation) {
        alert('Geolocalização não é suportada pelo seu navegador');
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const conversation = conversations[currentConversation];
            const now = new Date();
            const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;
            
            const messageText = `📍 Localização enviada<br>
                <div style="margin-top: 10px;">
                    <a href="https://maps.google.com/?q=${lat},${lng}" target="_blank" style="color: #1976d2;">
                        Ver no Google Maps
                    </a>
                </div>
                <small class="text-muted">Precisão: ~${Math.round(accuracy)} metros</small>`;
            
            sendAttachmentMessage(conversation, timeString, messageText, 'Minha localização');
        },
        (error) => {
            alert('Não foi possível obter a localização: ' + error.message);
        },
        { enableHighAccuracy: true }
    );
}

// Função auxiliar para enviar mensagens com anexos
function sendAttachmentMessage(conversation, timeString, messageText, additionalInfo) {
    conversation.messages.push({
        sender: 'user',
        text: messageText,
        time: timeString
    });
    
    conversation.lastMessageTime = 'Agora';
    loadConversation(currentConversation);
    
    // Simular resposta após 1-3 segundos
    setTimeout(() => {
        const responses = {
            'photo': ["Ótima foto! Onde foi tirada?", "Adorei essa imagem!", "Que bela composição!"],
            'document': ["Recebi o documento, obrigado!", "Vou analisar e te retorno.", "Documento recebido com sucesso."],
            'audio': ["Obrigado pelo áudio!", "Entendi sua mensagem.", "Vou ouvir com atenção."],
            'location': ["Obrigado pela localização!", "Vou verificar no mapa.", "Que lugar interessante!"]
        };
        
        let responseType = 'photo';
        if (messageText.includes('Documento')) responseType = 'document';
        else if (messageText.includes('Áudio')) responseType = 'audio';
        else if (messageText.includes('Localização')) responseType = 'location';
        
        const randomResponse = responses[responseType][Math.floor(Math.random() * responses[responseType].length)];
        
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
