function updateClock() {
  const now = new Date();
  const Sao_Paulo = new Date(now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
  const h = String(Sao_Paulo.getHours()).padStart(2, '0');
  const m = String(Sao_Paulo.getMinutes()).padStart(2, '0');
  document.getElementById('clock').textContent = `${h}:${m}`;
}

updateClock();
setInterval(updateClock, 1000);

function downloadCV(event) {
  // Efeito "pop" pequeno no botão no exato momento do clique
  if (event && event.currentTarget) {
    const btn = event.currentTarget;
    btn.style.transition = 'transform 0.15s ease-out';
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 150);
  }

  // Criar o efeito de onda
  const wave = document.createElement('div');
  wave.classList.add('wave-effect');
  
  // Pegar a posição do clique
  if (event) {
    wave.style.left = `${event.clientX}px`;
    wave.style.top = `${event.clientY}px`;
  } else {
    wave.style.left = '50%';
    wave.style.top = '50%';
  }
  
  document.body.appendChild(wave);
  
  // Remover a onda após terminar a animação
  setTimeout(() => {
    wave.remove();
  }, 2800);

  // Lógica de download com arquivo local
  const link = document.createElement('a');

  link.href = './CV.pdf';
  link.download = 'CV.pdf';

  link.style.display = 'none';
  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}