// Função para abrir modal com dados da arte
function openArtPreview(mediaElement, artCode, title, author) {
  const previewModal = document.getElementById('artPreview');
  
  // Configurar mídia (imagem ou vídeo)
  if (mediaElement.tagName === 'IMG') {
    document.getElementById('artImage').src = mediaElement.src;
    document.getElementById('artImage').classList.remove('d-none');
    document.getElementById('artVideo').classList.add('d-none');
    document.getElementById('artVideo').pause();
  } else if (mediaElement.tagName === 'VIDEO') {
    const video = document.getElementById('artVideo');
    video.src = mediaElement.querySelector('source').src;
    video.classList.remove('d-none');
    document.getElementById('artImage').classList.add('d-none');
    video.play();
  }
  
  // Configurar informações da obra
  document.getElementById('artCode').textContent = artCode;
  document.getElementById('artTitle').textContent = title;
  document.getElementById('artistName').textContent = author;
  document.getElementById('previewDescription').textContent = "Descrição detalhada sobre a obra...";
  
  // Gerar números aleatórios para likes e visualizações
  const randomLikes = Math.floor(Math.random() * 10000);
  const randomViews = Math.floor(Math.random() * 50000);
  document.getElementById('likeCount').textContent = randomLikes.toLocaleString();
  document.getElementById('viewCount').textContent = randomViews.toLocaleString();
  
  // Armazenar o número atual de likes como atributo para manipulação posterior
  document.querySelector('.action-circle.like').setAttribute('data-likes', randomLikes);
  document.querySelector('.action-circle.like').classList.remove('active');
  document.querySelector('.action-circle.fav').classList.remove('active');
  
  // Exibir o modal
  new bootstrap.Modal(previewModal).show();
}

// Configurar interações de like e favorito
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.action-circle');
  if (!btn) return;

  if (btn.classList.contains('like')) {
    // Alternar estado ativo
    btn.classList.toggle('active');
    
    // Atualizar contador de likes
    const likeCountElement = document.getElementById('likeCount');
    let currentLikes = parseInt(likeCountElement.textContent.replace(/\D/g, '')) || 0;
    
    if (btn.classList.contains('active')) {
      currentLikes += 1; // Curtir
    } else {
      currentLikes -= 1; // Descurtir
    }
    
    likeCountElement.textContent = currentLikes.toLocaleString();
  }
  
  if (btn.classList.contains('fav')) {
    // Alternar estado ativo
    btn.classList.toggle('active');
  }
});

// Configurar eventos de clique para cada tipo de carrossel
document.querySelectorAll('#dancaCarousel .reel-card video').forEach((video, index) => {
  video.addEventListener('click', (e) => {
    const card = e.target.closest('.reel-card');
    const title = card.querySelector('.video-title').textContent;
    openArtPreview(video, '#DANCA' + (index+1), title, "Artista de Dança");
  });
});

document.querySelectorAll('#FotoCarousel img').forEach((img, index) => {
  img.addEventListener('click', () => {
    openArtPreview(img, '#FOTO' + (index+1), "Fotografia Artística", "Fotógrafo Profissional");
  });
});

document.querySelectorAll('#albunsCarousel .card').forEach((card, index) => {
  const img = card.querySelector('img');
  img.addEventListener('click', () => {
    const title = card.querySelector('.card-title').textContent;
    const author = card.querySelector('.card-text').textContent;
    openArtPreview(img, '#ALBUM' + (index+1), title, author);
  });
});

document.querySelectorAll('#livrosCarousel .card').forEach((card, index) => {
  const img = card.querySelector('img');
  img.addEventListener('click', () => {
    const title = card.querySelector('.card-title').textContent;
    const author = card.querySelector('.card-text').textContent;
    openArtPreview(img, '#LIVRO' + (index+1), title, author);
  });
});

// Funções para controle de vídeo no carrossel de dança
function startVideo(videoElement) {
  const video = videoElement.querySelector('video');
  if (video) {
    video.play();
  }
}

function stopVideo(videoElement) {
  const video = videoElement.querySelector('video');
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
}

// Funções para rolar os carrosséis
function scrollCarousel(direction) {
  const carousel = document.getElementById('artistCarousel');
  const scrollAmount = 400;
  carousel.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
}

function scrollCarouselLivros(direction) {
  const carousel = document.getElementById('livrosCarousel');
  const scrollAmount = 400;
  carousel.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
}

function scrollCarouselAlbuns(direction) {
  const carousel = document.getElementById('albunsCarousel');
  const scrollAmount = 400;
  carousel.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
}

function scrollCarouselDanca(direction) {
  const carousel = document.getElementById('dancaCarousel');
  const scrollAmount = 400;
  carousel.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
}

function scrollCarouselFoto(direction) {
  const carousel = document.getElementById('FotoCarousel');
  const scrollAmount = 400;
  carousel.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
}