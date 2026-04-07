// Variável global para armazenar o fuso horário (timezone)
let userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';

function updateClock() {
  const now = new Date();
  
  // Converte o tempo pro fuso horário detectado do usuário
  let localTime;
  try {
    localTime = new Date(now.toLocaleString('pt-BR', { timeZone: userTimeZone }));
  } catch(e) {
    localTime = now; // Fallback se timezone for inválido
  }
  
  const h = String(localTime.getHours()).padStart(2, '0');
  const m = String(localTime.getMinutes()).padStart(2, '0');
  
  const clockEl = document.getElementById('clock');
  if(clockEl) {
    clockEl.textContent = `${h}:${m}`;
  }
}

updateClock();
setInterval(updateClock, 1000);

// Buscar localização via API pública
async function fetchUserLocation() {
  const locationEl = document.getElementById('user-location');
  if (!locationEl) return;
  
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data && data.city) {
      // Exibe a cidade e o país ou região, ex: "São Paulo, SP"
      locationEl.textContent = `${data.city}, ${data.region_code || data.country_name}`;
      
      // Atualiza a global com o fuso horário da API, para garantir precisão
      if (data.timezone) {
        userTimeZone = data.timezone;
        updateClock(); // Força atualização imediata da tela
      }
    } else {
      locationEl.textContent = 'Visitante';
    }
  } catch (error) {
    console.error('Erro ao buscar localização da API:', error);
    locationEl.textContent = 'Visitante';
  }
}

fetchUserLocation();

function downloadCV(event) {
  if (event && event.currentTarget) {
    const btn = event.currentTarget;
    btn.style.transition = 'transform 0.15s ease-out';
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 150);
  }

  const wave = document.createElement('div');
  wave.classList.add('wave-effect');
  
  if (event) {
    wave.style.left = `${event.clientX}px`;
    wave.style.top = `${event.clientY}px`;
  } else {
    wave.style.left = '50%';
    wave.style.top = '50%';
  }
  
  document.body.appendChild(wave);
  
  setTimeout(() => {
    wave.remove();
  }, 2800);

  const link = document.createElement('a');

  link.href = './CV.pdf';
  link.download = 'CV.pdf';

  link.style.display = 'none';
  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('project-modal');
    if (!modal) return;
    
    const modalClose = document.querySelector('.modal-close');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalCat = document.getElementById('modal-cat');
    const modalLink = document.getElementById('modal-link');

    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            
            const title = card.querySelector('.project-name').innerText;
            const cat = card.querySelector('.project-cat').innerText;
            const imgSrc = card.querySelector('img').src;
            const href = card.getAttribute('href');
            
            modalTitle.innerText = title;
            modalCat.innerText = cat;
            modalImg.src = imgSrc;
            modalLink.href = href;
            
            modal.style.display = 'flex';

            void modal.offsetWidth;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeModal = () => {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => {
            if(!modal.classList.contains('show')) {
                modal.style.display = 'none';
            }
        }, 400);
    };

    modalClose.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });


    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
});