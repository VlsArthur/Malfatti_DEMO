// Declarar as variáveis do mapa, geocoder, autocomplete e do marcador do usuário globalmente
var mapa;
var geocoder;
var autocomplete;
var userMarker; // Variável para armazenar o marcador do usuário

// Função principal de inicialização do mapa
function initMap() {
    geocoder = new google.maps.Geocoder();

    // 1. Configura o Autocomplete no campo de entrada de texto
    const input = document.getElementById('endereco');
    autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['geocode'], // Restringe as sugestões para endereços
        componentRestrictions: { 'country': ['br'] } // Opcional: Restringe a busca ao Brasil
    });

    // 2. Adiciona um 'listener' para o evento 'place_changed'
    // Este evento é disparado quando o usuário seleciona uma sugestão do Autocomplete
    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
            console.error("Local selecionado sem geometria. Usando a busca manual.");
            // Se o Autocomplete falhar, podemos usar o valor do campo para buscar manualmente
            searchAddress();
            return;
        }
        
        // Atualiza o mapa com o local selecionado
        updateMapWithLocation(place.geometry.location, place.name);
        
        input.value = "";
    });

    // 3. Coordenadas padrão de São Paulo, Brasil
    const saoPauloLatLng = { lat: -23.5505, lng: -46.6333 };

    // 4. Verificar se há usuário logado para personalizar o mapa
    if (localStorage.idUsuario) {
        // Fazer a requisição para obter os dados do usuário e inicializar o mapa.
        fetch(`/api/usuarios/id/${localStorage.idUsuario}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao buscar dados do usuário.');
            }
            return response.json();
        })
        .then(usuario => {
            // Se o usuário tem endereço completo, usar suas coordenadas
            if (usuario.logradouro && usuario.cidade && usuario.estado) {
                const enderecoUsuario = `${usuario.logradouro}, ${usuario.numero}, ${usuario.bairro}, ${usuario.cidade}, ${usuario.estado}, Brasil`;

                return getCoordenadas(enderecoUsuario).then(userCoordinates => {
                    const myLatLng = {
                        lat: userCoordinates.latitude,
                        lng: userCoordinates.longitude
                    };

                    mapa = new google.maps.Map(document.getElementById('map'), {
                        zoom: 12,
                        center: myLatLng
                    });

                    updateMapWithLocation(myLatLng, "Seu endereço");

                    // Fazer a requisição para obter os eventos após ter o mapa pronto.
                    return fetch('/api/eventos', {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    });
                });
            } else {
                // Usuário sem endereço completo, usar São Paulo como padrão
                mapa = new google.maps.Map(document.getElementById('map'), {
                    zoom: 12,
                    center: saoPauloLatLng
                });

                updateMapWithLocation(saoPauloLatLng, "São Paulo, SP");

                // Fazer a requisição para obter os eventos
                return fetch('/api/eventos', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao buscar dados dos eventos.');
            }
            return response.json();
        })
        .then(eventos => {
            exibirEventos(eventos);
        })
        .catch(error => {
            console.error('Erro ao inicializar o mapa:', error);
            // Em caso de falha, inicializa o mapa com São Paulo como padrão
            mapa = new google.maps.Map(document.getElementById('map'), {
                zoom: 12,
                center: saoPauloLatLng
            });
            updateMapWithLocation(saoPauloLatLng, "São Paulo, SP - Localização Padrão");

            // Tentar carregar eventos mesmo com erro no usuário
            fetch('/api/eventos', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(eventos => exibirEventos(eventos))
            .catch(err => console.error('Erro ao carregar eventos:', err));
        });
    } else {
        // Usuário não logado, usar São Paulo como padrão
        mapa = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: saoPauloLatLng
        });

        updateMapWithLocation(saoPauloLatLng, "São Paulo, SP");

        // Carregar eventos mesmo sem usuário logado
        fetch('/api/eventos', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao buscar dados dos eventos.');
            }
            return response.json();
        })
        .then(eventos => {
            exibirEventos(eventos);
        })
        .catch(error => {
            console.error('Erro ao carregar eventos:', error);
        });
    }
}

// Array para armazenar os marcadores de eventos
var eventMarkers = [];

// Função de exibir eventos modificada para limpar os marcadores antigos
function exibirEventos(eventos) {
    // Primeiro, remove todos os marcadores de eventos antigos
    clearEventMarkers();

    const promises = eventos.map(evento => {
        const endereco = `${evento.logradouro}, ${evento.numero}, ${evento.bairro}, ${evento.cidade}, ${evento.estado}, Brasil`;
        return getCoordenadas(endereco)
            .then(coordenadas => {
                const posicao = {
                    lat: coordenadas.latitude,
                    lng: coordenadas.longitude
                };
                const icone = {
                    url: evento.imagem,
                    scaledSize: new google.maps.Size(50, 50),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(25, 25)
                };
                const marker = new google.maps.Marker({
                    position: posicao,
                    map: mapa,
                    title: evento.nome,
                    icon: icone
                });
                // Adiciona o novo marcador ao array de eventos
                eventMarkers.push(marker);
            })
            .catch(error => {
                console.error(`Erro ao obter coordenadas para o evento ${evento.nome}:`, error);
                return Promise.resolve();
            });
    });
    return Promise.all(promises);
}

// Nova função para remover apenas os marcadores de eventos
function clearEventMarkers() {
    for (let i = 0; i < eventMarkers.length; i++) {
        eventMarkers[i].setMap(null);
    }
    eventMarkers = []; // Esvazia o array
}

// Função auxiliar para converter endereço em coordenadas (getCoordenadas)
function getCoordenadas(endereco) {
    return new Promise((resolve, reject) => {
        if (!geocoder) {
            reject(new Error("O geocoder não foi inicializado."));
            return;
        }
        geocoder.geocode({ 'address': endereco }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;
                resolve({ latitude: location.lat(), longitude: location.lng() });
            } else {
                reject(new Error(`Geocodificação falhou com o status: ${status}`));
            }
        });
    });
}

// Função auxiliar para atualizar o mapa e gerenciar o marcador do usuário
function updateMapWithLocation(location, title) {
    // Se já existir um marcador de usuário, o remove
    if (userMarker) {
        userMarker.setMap(null);
    }
    
    mapa.setCenter(location);
    // Cria um novo marcador e o salva na variável global
    userMarker = new google.maps.Marker({
        position: location,
        map: mapa,
        title: title
    });
}

// Função para exibir a rota (código fornecido por você)
var directionsRenderer = null;

function displayRoute(origin, destination) {
    // Apaga a rota anterior, se existir
    if (directionsRenderer) {
        directionsRenderer.setMap(null);
    }
    
    const directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(mapa); // O mapa agora é a variável global 'mapa'

    const request = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
        } else {
            console.error('Falha ao calcular a rota:', status);
            alert('Não foi possível calcular a rota. Por favor, tente novamente.');
        }
    });
}

// Função de exibir eventos modificada
function exibirEventos(eventos) {
    clearEventMarkers();

    const promises = eventos.map(evento => {
        const endereco = `${evento.logradouro}, ${evento.numero}, ${evento.bairro}, ${evento.cidade}, ${evento.estado}, Brasil`;
        return getCoordenadas(endereco)
            .then(coordenadas => {
                const posicao = {
                    lat: coordenadas.latitude,
                    lng: coordenadas.longitude
                };
                const icone = {
                    url: evento.imagem,
                    scaledSize: new google.maps.Size(50, 50),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(25, 25)
                };
                const marker = new google.maps.Marker({
                    position: posicao,
                    map: mapa,
                    title: evento.nome,
                    icon: icone
                });
                eventMarkers.push(marker);

                // NOVIDADE: Adiciona o listener de clique ao marcador do evento
                marker.addListener('click', () => {
                    if (userMarker && userMarker.getPosition()) {
                        const origin = userMarker.getPosition();
                        const destination = marker.getPosition();
                        
                        // Chama a sua função para exibir a rota
                        displayRoute(origin, destination);
                    } else {
                        alert("Sua localização não está definida. Por favor, faça uma busca antes de ver a rota.");
                    }
                });
            })
            .catch(error => {
                console.error(`Erro ao obter coordenadas para o evento ${evento.nome}:`, error);
                return Promise.resolve();
            });
    });
    return Promise.all(promises);
}