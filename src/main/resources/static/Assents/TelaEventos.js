
        // Inicialização do mapa
        function initMap() {
            // Coordenadas padrão (centro da cidade)
            const defaultCoords = [-23.5505, -46.6333]; // São Paulo
            
            // Criar o mapa
            const map = L.map('map').setView(defaultCoords, 13);
            
            // Adicionar camada do mapa
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // Adicionar marcadores para os eventos
            const events = [
                {
                    coords: [-23.5515, -46.6333],
                    title: "Festival de Música Independente",
                    category: "music"
                },
                {
                    coords: [-23.5495, -46.6343],
                    title: "Exposição: Arte Contemporânea",
                    category: "art"
                },
                {
                    coords: [-23.5500, -46.6320],
                    title: "Ballet Clássico: O Lago dos Cisnes",
                    category: "dance"
                },
                {
                    coords: [-23.5520, -46.6350],
                    title: "Peça: Romeu e Julieta",
                    category: "theater"
                },
                {
                    coords: [-23.5480, -46.6325],
                    title: "Sarau Literário",
                    category: "literature"
                },
                {
                    coords: [-23.5530, -46.6300],
                    title: "Festival de Cinema Independente",
                    category: "cinema"
                }
            ];
            
            // Adicionar marcadores ao mapa
            events.forEach(event => {
                const marker = L.marker(event.coords).addTo(map);
                marker.bindPopup(`<b>${event.title}</b>`);
            });
            
            // Botão para usar localização atual
            document.getElementById('useLocationBtn').addEventListener('click', function(e) {
                e.preventDefault();
                
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        function(position) {
                            const userCoords = [position.coords.latitude, position.coords.longitude];
                            map.setView(userCoords, 13);
                            
                            // Adicionar marcador da localização do usuário
                            L.marker(userCoords)
                                .addTo(map)
                                .bindPopup("<b>Sua localização</b>")
                                .openPopup();
                        },
                        function(error) {
                            alert("Não foi possível obter sua localização: " + error.message);
                        }
                    );
                } else {
                    alert("Geolocalização não é suportada pelo seu navegador.");
                }
            });
            
            // Filtros de categoria
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remover classe active de todos os botões
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Adicionar classe active ao botão clicado
                    this.classList.add('active');
                    
                    // Aqui você implementaria a lógica para filtrar os eventos
                    // por categoria quando o backend estiver disponível
                });
            });
        }
        
        // Inicializar o mapa quando a página carregar
        window.onload = initMap;
    