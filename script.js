let userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';

function updateClock() {
  const now = new Date();
  
  let timeString;
  try {
    timeString = new Intl.DateTimeFormat('pt-BR', {
      timeZone: userTimeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(now);
  } catch(e) {
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    timeString = `${h}:${m}`;
  }
  
  const clockEl = document.getElementById('clock');
  if(clockEl) {
    clockEl.textContent = timeString;
  }
}

updateClock();
setInterval(updateClock, 1000);


async function fallbackIPLocation() {
  const locationEl = document.getElementById('user-location');
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data && data.city) {
      locationEl.textContent = `${data.city}, ${data.region_code}`;
      if (data.timezone) {
        userTimeZone = data.timezone;
        updateClock();
      }
    } else {
      locationEl.textContent = 'Visitante';
    }
  } catch (error) {
    locationEl.textContent = 'Visitante';
  }
}

function fetchUserLocation() {
  const locationEl = document.getElementById('user-location');
  if (!locationEl) return;
  
  if (navigator.geolocation) {
    locationEl.textContent = 'Aguardando...';
    

    navigator.geolocation.getCurrentPosition(
      async (position) => {

        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          

          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`);
          const data = await response.json();
          
          if (data && (data.city || data.locality)) {
            const cidade = data.city || data.locality;
            let estado = data.principalSubdivisionCode || data.principalSubdivision;
            if (estado && estado.includes('-')) {
              estado = estado.split('-').pop();
            }
            locationEl.textContent = `${cidade}, ${estado}`;
          } else {
            fallbackIPLocation();
          }
        } catch (error) {
          fallbackIPLocation();
        }
      },
      (error) => {

        console.warn('Permissão de localização negada pelo usuário. Recorrendo ao IP.');
        fallbackIPLocation();
      }
    );
  } else {

    fallbackIPLocation();
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

    document.body.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card');
        if (!card) return;
        
        e.preventDefault();
        
        const title = card.querySelector('.project-name').innerText;
        const cat = card.querySelector('.project-cat').innerText;
        const projectImgHtml = card.querySelector('.project-img').innerHTML;
        const href = card.getAttribute('href');
        
        modalTitle.innerText = title;
        modalCat.innerText = cat;
        
        const modalImgContainer = document.querySelector('.modal-img-container');
        modalImgContainer.innerHTML = projectImgHtml;
        
        modalLink.href = href;
        
        modal.style.display = 'flex';

        void modal.offsetWidth;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
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

const translations = {
  "Disponível para Trabalho": "Available for Work",
  "Indisponível para Trabalho": "Unavailable for Work",
  "Desenvolvedor de Sistemas Jr. com foco em aplicações web, automações e integração com APIs.": "Jr. Systems Developer focused on web applications, automations, and API integrations.",
  "Download do CV": "Download CV",
  "Contato": "Contact",
  "Sobre Mim": "About Me",
  "Desenvolvedor de Sistemas Jr com experiência prática no desenvolvimento de aplicações utilizando Java, Python, Node.js, React e tecnologias web, atualmente residindo no interior de São Paulo, Brasil. Tenho projetos próprios desenvolvidos desde o MVP até a implementação, com foco em resolver problemas reais e fortalecer meu conhecimento em lógica, APIs e banco de dados.": "Jr Systems Developer with practical experience in application development using Java, Python, Node.js, React, and web technologies, currently living in the countryside of São Paulo, Brazil. I have personal projects developed from MVP to implementation, focusing on solving real problems and strengthening my knowledge in logic, APIs, and databases.",
  "Gosto de criar soluções eficientes, explorar novas tecnologias e evoluir de forma gradativa minhas habilidades com o mercado tecnológico. Com uma postura proativa e foco em resolução de problemas, busco uma oportunidade para demonstrar meu potencial, contribuir com projetos relevantes e crescer como desenvolvedor de sistemas.": "I enjoy creating efficient solutions, exploring new technologies, and gradually evolving my skills in the technology market. With a proactive attitude and a focus on problem-solving, I seek an opportunity to demonstrate my potential, contribute to relevant projects, and grow as a systems developer.",
  "Projetos": "Projects",
  "Aplicativo Web para organização de documentos": "Web application for organizing documents",
  "Aplicativo Web/Mobile para controle de carnês": "Web/Mobile app for payment booklet control",
  "Website de informações sobre moedas": "Cryptocurrency information website",
  "Bot multifuncional para Discord": "Multifunctional Discord bot",
  "Bot de Discord": "Discord Bot",
  "Sistema de controle de energia solar": "Solar energy control system",
  "Add-ons de sistemas para Minecraft": "System add-ons for Minecraft",
  "Site Portfólio": "Portfolio Website",
  "Portfólio para apresentar projetos pessoais": "Portfolio to showcase personal projects",
  "Experiências": "Experience",
  "Freelancer": "Freelance",
  "Desenvolvedor de Sistemas": "Systems Developer",
  "Desenvolvimento de sistemas por demanda, utilizando tecnologias como: Java, Python e Javascript. Integração com APIs e BDs. Uso de Frameworks como React, Node.js e SpringBoot.": "On-demand systems development, using technologies such as: Java, Python, and Javascript. Integration with APIs and DBs. Use of Frameworks like React, Node.js, and SpringBoot.",
  "📅 Março 2020 – Atual": "📅 March 2020 – Present",
  "📍 Porto Ferreira, SP (Home-Office)": "📍 Porto Ferreira, SP (Remote)",
  "Casa Verona Padaria Artesanal e Café Bar": "Casa Verona Artisanal Bakery and Coffee Bar",
  "Barista & Especialização em Cafés Especiais": "Barista & Specialization in Specialty Coffees",
  "Preparo de bebidas à base de café com foco em qualidade e padronização. Atendimento ao cliente, organização de estoque/insumos e eficiência em ambientes de alta demanda.": "Preparation of coffee-based drinks focusing on quality and standardization. Customer service, inventory/supplies organization, and efficiency in high-demand environments.",
  "📅 Julho 2024 – Março 2026": "📅 July 2024 – March 2026",
  "Auxiliar de Produção": "Production Assistant",
  "Montagem e controle de qualidade de componentes para chaves e motores. Organização de processos produtivos, manuseio de peças e atenção aos padrões de qualidade em ambiente industrial.": "Assembly and quality control of components for switches and motors. Organization of production processes, handling of parts, and attention to quality standards in an industrial environment.",
  "📅 Junho 2023 – Outubro 2023": "📅 June 2023 – October 2023",
  "Educação": "Education",
  "Unicesumar (Ensino à Distância - EaD)": "Unicesumar (Distance Learning)",
  "Bacharelado em Análise e Desenvolvimento de Sistemas - Tecnologia em Informática": "Bachelor of Systems Analysis and Development - Information Technology",
  "Formação voltada para desenvolvimento de software, lógica de programação e fundamentos de banco de dados. Aprendizado contínuo e aplicação prática.": "Degree focused on software development, programming logic, and database fundamentals. Continuous learning and practical application.",
  "📅 Outubro 2025 – Atual": "📅 October 2025 – Present",
  "📍 Online - EaD": "📍 Online - Distance Learning",
  "Bacharelado em Sistemas de Informação - Tecnologia em Informática (1° ao 3° semestre)": "Bachelor of Information Systems - Information Technology (1st to 3rd semester)",
  "📅 Fevereiro 2023 – Agosto 2024": "📅 February 2024 – August 2025",
  "Cursos": "Courses",
  "Django Web Framework com Python, HTML e CSS": "Django Web Framework with Python, HTML and CSS",
  "Outubro 2025": "October 2025",
  "Inglês Avançado - Básico à Fluência": "Advanced English - Basic to Fluency",
  "Fevereiro 2025": "February 2025",
  "Indústria 4.0": "Industry 4.0",
  "Março 2026": "March 2026",
  "Tecnologias e educação: espaço para além da sala de aula": "Technologies and education: space beyond the classroom",
  "Idiomas": "Languages",
  "Nível B1 - Conversação e Interpretação Textual": "Level B1 - Conversation and Textual Interpretation",
  "Inglês": "English",
  "Inglês intermediário": "Intermediate English",
  "Ver mais": "View more",
  "Ferramentas": "Tools",
  "Linguagem de Programação": "Programming Language",
  "Containerização": "Containerization",
  "Ambiente de Execução": "Runtime Environment",
  "Banco de Dados": "Database",
  "Linguagem de Marcação": "Markup Language",
  "Linguagem de Estilo": "Style Language",
  "Controle de Versão": "Version Control",
  "Sistema Operacional": "Operating System",
  "Framework": "Framework",
  "Banco de Dados Relacional": "Relational Database",
  "Ferramentas de Desenvolvimento": "Development Tools",
  "Ambiente de Execução": "Runtime Environment",
  "Telefone": "Phone",
  "Este projeto pode ser visualizado com mais detalhes diretamente na respectiva página, contemplando códigos, tecnologias e implementações.": "This project can be viewed in more detail directly on its respective page, covering code, technologies, and implementations.",
  "Acessar Projeto": "Access Project",
  "Título": "Title",
  "Categoria": "Category",
  "Localizando...": "Locating...",
  "Visitante": "Visitor",
  "Aguardando...": "Waiting...",
  "Voltar ao topo": "Back to top",
  "Sem descrição": "No description",
  "Projeto no GitHub": "GitHub Project"
};

const reverseTranslations = {};
for (const [pt, en] of Object.entries(translations)) {
  reverseTranslations[en] = pt;
}

function translatePage(isEnglish) {
  const dict = isEnglish ? translations : reverseTranslations;
  
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let node;
  while ((node = walker.nextNode())) {
    const trimmed = node.nodeValue.trim();
    if (trimmed && dict[trimmed]) {
      node.nodeValue = node.nodeValue.replace(trimmed, dict[trimmed]);
    }
  }

  document.querySelectorAll('[aria-label]').forEach(el => {
    if (el.id === 'lang-toggle') return;
    const attr = el.getAttribute('aria-label').trim();
    if (dict[attr]) el.setAttribute('aria-label', dict[attr]);
  });
  document.querySelectorAll('[title]').forEach(el => {
    if (el.id === 'lang-toggle') return;
    const attr = el.getAttribute('title').trim();
    if (dict[attr]) el.setAttribute('title', dict[attr]);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const langToggle = document.getElementById('lang-toggle');
  const langTooltip = document.getElementById('lang-tooltip');
  const langTooltipClose = document.getElementById('lang-tooltip-close');
  const darkmodeTooltip = document.getElementById('darkmode-tooltip');
  const darkmodeTooltipClose = document.getElementById('darkmode-tooltip-close');
  let isEnglish = false;

  if (langTooltip) {
    setTimeout(() => {
      langTooltip.classList.add('show');
    }, 700);
  }

  let darkmodeTooltipShown = false;

  const dismissTooltip = () => {
    if (langTooltip && langTooltip.classList.contains('show')) {
      langTooltip.classList.remove('show');
      
      if (darkmodeTooltip && !darkmodeTooltipShown) {
        darkmodeTooltipShown = true;
        setTimeout(() => {
          darkmodeTooltip.classList.add('show');
        }, 1000);
      }
    }
  };

  if (langTooltipClose) {
    langTooltipClose.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissTooltip();
    });
  }

  const dismissDarkmodeTooltip = () => {
    darkmodeTooltipShown = true; 
    if (darkmodeTooltip && darkmodeTooltip.classList.contains('show')) {
      darkmodeTooltip.classList.remove('show');
    }
  };

  if (darkmodeTooltipClose) {
    darkmodeTooltipClose.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissDarkmodeTooltip();
    });
  }

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      dismissTooltip();

      isEnglish = !isEnglish;
      langToggle.classList.toggle('active', isEnglish);
      langToggle.setAttribute('aria-label', isEnglish ? 'Translate to Portuguese' : 'Translate to English');
      langToggle.setAttribute('title', isEnglish ? 'Translate to Portuguese' : 'Translate to English');
      translatePage(isEnglish);
    });
  }

  // --- Space Mode Logic ---
  const spaceToggle = document.getElementById('space-toggle');
  let isSpaceMode = false;

  if (spaceToggle) {
    spaceToggle.addEventListener('click', () => {
      dismissDarkmodeTooltip();
      if (langTooltip) langTooltip.classList.remove('show');

      isSpaceMode = !isSpaceMode;
      document.body.classList.toggle('space-mode', isSpaceMode);
      spaceToggle.classList.toggle('active', isSpaceMode);
      initSpaceCanvas();
    });
  }
  initSpaceCanvas();
});

function initSpaceCanvas() {
  const canvas = document.getElementById('space-canvas');
  if (!canvas || canvas.dataset.initialized) return;
  canvas.dataset.initialized = 'true';
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  
  // Parallax variables
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX - width / 2) / (width / 2);
    targetY = (e.clientY - height / 2) / (height / 2);
  });
  
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < -50) this.x = width + 50;
      if (this.x > width + 50) this.x = -50;
      if (this.y < -50) this.y = height + 50;
      if (this.y > height + 50) this.y = -50;
    }
  }

  function init() {
    particles = [];
    const numParticles = Math.min(Math.floor(window.innerWidth / 10), 120);
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      
      const pX = particles[i].x + (mouseX * particles[i].size * 25);
      const pY = particles[i].y + (mouseY * particles[i].size * 25);
      
      ctx.globalAlpha = particles[i].opacity;
      const isDark = document.body.classList.contains('space-mode');
      ctx.fillStyle = isDark ? '#ffffff' : '#111111';
      ctx.beginPath();
      ctx.arc(pX, pY, particles[i].size, 0, Math.PI * 2);
      ctx.fill();
      
      for (let j = i + 1; j < particles.length; j++) {
        const p2X = particles[j].x + (mouseX * particles[j].size * 25);
        const p2Y = particles[j].y + (mouseY * particles[j].size * 25);
        
        const dx = pX - p2X;
        const dy = pY - p2Y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          const maxLineOpacity = isDark ? 0.15 : 0.4;
          ctx.globalAlpha = (120 - dist) / 120 * maxLineOpacity;
          ctx.strokeStyle = isDark ? '#ffffff' : '#111111';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(pX, pY);
          ctx.lineTo(p2X, p2Y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  init();
  animate();
}

async function loadGitHubProjects() {
  const container = document.getElementById('github-projects-container');
  if (!container) return;

  const githubUsername = 'leandrobanin';
  const url = `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=12`;

  const repositoriosIgnorados = [
    'leandrobanin',
    'leandrobanin.github.io'
  ];

  try {
    const response = await fetch(url);
    const repos = await response.json();
    
    container.innerHTML = '';

    const activeRepos = repos
      .filter(repo => !repo.fork && !repositoriosIgnorados.includes(repo.name))
      .slice(0, 8);

    activeRepos.forEach(repo => {
      const card = document.createElement('a');
      card.className = 'project-card';
      card.href = repo.html_url;
      card.target = '_blank';

      let formattedName = repo.name.replace(/-/g, ' ');
      formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);

      card.innerHTML = `
        <div class="project-img">
          <div class="aesthetic-bg">
            <div class="aesthetic-glow"></div>
            <div class="aesthetic-grid"></div>
            <div class="aesthetic-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
          </div>
        </div>
        <div class="project-info">
          <div>
            <div class="project-name">${formattedName}</div>
            <div class="project-cat">${repo.description ? repo.description : 'Sem descrição'}</div>
          </div>
          <span class="project-arrow">↗</span>
        </div>
      `;

      container.appendChild(card);
    });

    const langToggle = document.getElementById('lang-toggle');
    if (langToggle && langToggle.classList.contains('active')) {
      translatePage(true);
    }

  } catch (error) {
    console.error('Erro ao buscar repositórios do GitHub', error);
    container.innerHTML = '<p style="color: red; text-align: center; grid-column: 1 / -1;">Erro ao carregar projetos do GitHub.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadGitHubProjects();

  const viewMoreBtn = document.getElementById('view-more-projects-btn');
  const projectsWrapper = document.getElementById('projects-wrapper');

  if (viewMoreBtn && projectsWrapper) {
    viewMoreBtn.addEventListener('click', () => {
      // Pega a altura real do conteúdo
      const scrollHeight = projectsWrapper.scrollHeight;
      
      // Aplica a transição diretamente via JavaScript (bem lenta e suave)
      projectsWrapper.style.transition = 'max-height 1.5s ease-in-out';
      projectsWrapper.style.maxHeight = scrollHeight + 'px';
      
      projectsWrapper.classList.remove('collapsed');

      const overlay = document.getElementById('projects-overlay');
      if (overlay) {
        // Faz o overlay do botão sumir lentamente também
        overlay.style.transition = 'opacity 1s ease-in-out';
        overlay.style.opacity = '0';
        
        setTimeout(() => {
          overlay.style.display = 'none';
          // Limpa a restrição de altura depois da animação para manter o layout flexível
          projectsWrapper.style.maxHeight = 'none';
        }, 1500); 
      }
    });
  }
});
