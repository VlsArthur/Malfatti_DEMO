
  
  // Seçao para copntrolar o looping do video
  function startVideo(card) {
    const video = card.querySelector('video');
    video.currentTime = 0; // Reinicia o vídeo
    video.play();
    
    // Para o vídeo após 30 segundos
    video.timeout = setTimeout(() => {
      video.pause();
    }, 30000);
  }
  
  function stopVideo(card) {
    const video = card.querySelector('video');
    video.pause();
    clearTimeout(video.timeout); // Limpa o timeout se o mouse sair antes dos 30s
  }