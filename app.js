document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initTheme();
  initFontResize();
  initCardFlip();
  initBackgroundEasterEggs();
  initCheshireCat();
  initQuiz();
  initTabs();
  initSearch();
  initShare();
});

/* ==========================================================================
   NAVEGACIÓN POR PESTAÑAS (TABS)
   ========================================================================== */
function initTabs() {
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.tab-section');

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Desactivar botones anteriores
      navButtons.forEach(btn => btn.classList.remove('active'));
      // Activar botón actual
      button.classList.add('active');

      // Ocultar secciones anteriores y mostrar la activa
      sections.forEach(section => {
        if (section.id === targetTab) {
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });

      // Disparar animación de guiño 3D (wiggle) en cascada al entrar al Elenco
      if (targetTab === 'elenco') {
        const cards = document.querySelectorAll('.flip-card');
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('wiggle-active');
            setTimeout(() => {
              card.classList.remove('wiggle-active');
            }, 1400);
          }, index * 150);
        });
      }

      // Hacer scroll hacia arriba al cambiar de sección
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

/* ==========================================================================
   BUSCADOR DE ELENCO EN TIEMPO REAL
   ========================================================================== */
function initSearch() {
  const searchInput = document.getElementById('cast-search');
  const noResults = document.getElementById('no-results');
  
  // Elementos a buscar
  const mainCards = document.querySelectorAll('.cast-card');
  const solistCards = document.querySelectorAll('.solist-card');
  const groupDetails = document.querySelectorAll('.group-details');
  
  // Contenedores principales (para ocultar si están vacíos)
  const mainGrid = document.getElementById('main-roles-container');
  const secondaryContainer = document.getElementById('secondary-roles-container');
  const groupsContainer = document.getElementById('groups-container');

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = normalizeText(e.target.value.trim());

    let hasMainResults = false;
    let hasSolistResults = false;
    let hasGroupResults = false;

    // 1. Filtrar Personajes Principales (Grid)
    mainCards.forEach(card => {
      const searchData = normalizeText(card.getAttribute('data-search') || '');
      if (searchData.includes(query)) {
        card.style.display = 'flex';
        hasMainResults = true;
      } else {
        card.style.display = 'none';
      }
    });

    // Ocultar grid de principales si está vacío
    if (hasMainResults) {
      mainGrid.style.display = 'grid';
    } else {
      mainGrid.style.display = 'none';
    }

    // 2. Filtrar Solistas
    solistCards.forEach(card => {
      const searchData = normalizeText(card.getAttribute('data-search') || '');
      if (searchData.includes(query)) {
        card.style.display = 'flex';
        hasSolistResults = true;
      } else {
        card.style.display = 'none';
      }
    });

    // Ocultar sección de solistas completa si no hay coincidencias
    if (hasSolistResults) {
      secondaryContainer.style.display = 'block';
    } else {
      secondaryContainer.style.display = 'none';
    }

    // 3. Filtrar Grupos Coreográficos
    groupDetails.forEach(details => {
      const searchData = normalizeText(details.getAttribute('data-search') || '');
      
      if (searchData.includes(query)) {
        details.style.display = 'block';
        hasGroupResults = true;
        
        // Expandir grupo automáticamente si el usuario escribe una búsqueda específica
        if (query.length > 0) {
          details.setAttribute('open', '');
        } else {
          details.removeAttribute('open');
        }
      } else {
        details.style.display = 'none';
        details.removeAttribute('open');
      }
    });

    // Ocultar sección de grupos completa si no hay coincidencias
    if (hasGroupResults) {
      groupsContainer.style.display = 'flex';
    } else {
      groupsContainer.style.display = 'none';
    }

    // Mostrar banner de "no resultados" si absolutamente todo está oculto
    const anyResults = hasMainResults || hasSolistResults || hasGroupResults;
    if (!anyResults && query.length > 0) {
      noResults.classList.remove('hidden');
    } else {
      noResults.classList.add('hidden');
    }
  });
}

// Función auxiliar para quitar acentos y normalizar texto
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Quita marcas diacríticas (acentos)
}

/* ==========================================================================
   BOTÓN COMPARTIR (NATIVE SHARE API / PORTAPAPELES)
   ========================================================================== */
function initShare() {
  const btnShare = document.getElementById('btn-share');
  const toast = document.getElementById('toast');

  if (!btnShare) return;

  btnShare.addEventListener('click', async () => {
    const shareData = {
      title: 'Alicia en el país de las maravillas - Programa de Mano',
      text: 'Programa de mano digital del Ballet Teatro de Guadalajara para la obra Alicia en el país de las maravillas.',
      url: window.location.href
    };

    // Intentar Web Share API nativo (ideal en celulares)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // El usuario canceló la compartición o falló, no hacemos nada
        console.log('Compartición cancelada o no soportada', err);
      }
    } else {
      // Fallback: Copiar al portapapeles y mostrar Toast
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('¡Enlace del programa copiado al portapapeles!');
      } catch (err) {
        showToast('No se pudo copiar el enlace automáticamente.');
      }
    }
  });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.remove('hidden');

    // Desvanecer después de 2.5 segundos
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 2500);
  }
}

/* ==========================================================================
   PANTALLA DE CARGA (MADRIGUERA LOADER)
   ========================================================================== */
function initLoader() {
  const loader = document.getElementById('madriguera-loader');
  if (!loader) return;

  if (sessionStorage.getItem('madriguera_loaded')) {
    loader.style.display = 'none';
    loader.remove();
    return;
  }

  setTimeout(() => {
    loader.classList.add('hidden');
    sessionStorage.setItem('madriguera_loaded', 'true');
    setTimeout(() => {
      loader.remove();
    }, 600);
  }, 4000);
}

/* ==========================================================================
   SELECTOR DE TEMA: PINTAR LAS ROSAS DE ROJO
   ========================================================================== */
function initTheme() {
  const themeBtn = document.getElementById('theme-rose-btn');
  if (!themeBtn) return;

  // Cargar preferencia guardada
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('theme-dark');
  }

  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('theme-dark');
    
    // Guardar preferencia
    if (document.body.classList.contains('theme-dark')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
}

/* ==========================================================================
   CONTROLES CÓMEME / BÉBEME (TAMAÑO DE TEXTO)
   ========================================================================== */
function initFontResize() {
  const btnBebeme = document.getElementById('btn-bebeme');
  const btnComeme = document.getElementById('btn-comeme');
  if (!btnBebeme || !btnComeme) return;

  // Cargar escala guardada o usar 1 por defecto
  let currentScale = parseFloat(localStorage.getItem('font-scale')) || 1;
  updateFontScale(currentScale);

  btnBebeme.addEventListener('click', () => {
    if (currentScale > 0.85) {
      currentScale -= 0.15;
      updateFontScale(currentScale);
    }
  });

  btnComeme.addEventListener('click', () => {
    if (currentScale < 1.3) {
      currentScale += 0.15;
      updateFontScale(currentScale);
    }
  });

  function updateFontScale(scale) {
    document.documentElement.style.setProperty('--font-scale', scale);
    localStorage.setItem('font-scale', scale);
    
    // Activar/desactivar estados visuales si se llega a los límites
    if (scale <= 0.85) {
      btnBebeme.style.opacity = '0.4';
      btnBebeme.style.pointerEvents = 'none';
    } else {
      btnBebeme.style.opacity = '1';
      btnBebeme.style.pointerEvents = 'auto';
    }

    if (scale >= 1.3) {
      btnComeme.style.opacity = '0.4';
      btnComeme.style.pointerEvents = 'none';
    } else {
      btnComeme.style.opacity = '1';
      btnComeme.style.pointerEvents = 'auto';
    }
  }
}

/* ==========================================================================
   TARJETAS GIRATORIAS 3D (CARD FLIP)
   ========================================================================== */
function initCardFlip() {
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'a') return;
      card.classList.toggle('flipped');
    });
  });
}

/* ==========================================================================
   EASTER EGGS EN DECORACIONES FLOTANTES
   ========================================================================== */
function initBackgroundEasterEggs() {
  const teapot = document.getElementById('decor-teapot');
  const clock = document.getElementById('decor-clock');
  const key = document.getElementById('decor-key');
  const heart = document.getElementById('decor-heart');

  if (teapot) {
    teapot.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerEgg(teapot, 'decor-spin', '¡Siempre es la hora del té! ☕', e);
    });
  }

  if (clock) {
    clock.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerEgg(clock, 'decor-bounce', '¡Voy tarde, voy tarde! ⏰', e);
    });
  }

  if (key) {
    key.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerEgg(key, 'decor-shake', '¿Dónde estará la cerradura? 🔑', e);
    });
  }

  if (heart) {
    heart.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerEgg(heart, 'decor-bounce', '¡Que le corten la cabeza! ♥️', e);
    });
  }

  function triggerEgg(element, animClass, quote, event) {
    // 1. Lanzar animación CSS
    element.classList.add(animClass);
    setTimeout(() => {
      element.classList.remove(animClass);
    }, 700);

    // 2. Limpiar burbujas previas
    const oldBubbles = document.querySelectorAll('.decor-bubble');
    oldBubbles.forEach(b => b.remove());

    // 3. Crear la nueva burbuja de diálogo
    const bubble = document.createElement('div');
    bubble.className = 'decor-bubble';
    bubble.textContent = quote;

    // Calcular posición sobre el elemento
    const rect = element.getBoundingClientRect();
    const bubbleWidth = 120; // Aproximado para cálculo de centrado
    
    let top = window.scrollY + rect.top - 48;
    let left = window.scrollX + rect.left + (rect.width / 2) - (bubbleWidth / 2);

    // Evitar desbordamiento de pantalla
    if (left < 10) left = 10;
    if (left + bubbleWidth > window.innerWidth - 10) {
      left = window.innerWidth - bubbleWidth - 10;
    }

    bubble.style.top = `${top}px`;
    bubble.style.left = `${left}px`;

    document.body.appendChild(bubble);

    // 4. Autodestrucción tras 2.5 segundos con desvanecimiento
    setTimeout(() => {
      bubble.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      bubble.style.opacity = '0';
      bubble.style.transform = 'translateY(-8px) scale(0.9)';
      setTimeout(() => {
        bubble.remove();
      }, 400);
    }, 2500);
  }
}

/* ==========================================================================
   GATO DE CHESHIRE INTERACTIVO (TEMA OSCURO)
   ========================================================================== */
function initCheshireCat() {
  const cat = document.getElementById('cheshire-cat');
  if (!cat) return;

  let clickTimeout;

  // Hover en Desktop
  cat.addEventListener('mouseenter', () => {
    if (document.body.classList.contains('theme-dark')) {
      cat.classList.add('reveal-body');
    }
  });

  cat.addEventListener('mouseleave', () => {
    if (clickTimeout) return;
    cat.classList.remove('reveal-body');
  });

  // Tap/Click en Celular & Desktop
  cat.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!document.body.classList.contains('theme-dark')) return;

    cat.classList.add('reveal-body');
    
    const quotes = [
      '¿Hacia dónde vas? 😸',
      'Aquí todos estamos locos. 🌀',
      'Yo no estoy loco, mi realidad es diferente. 😺',
      '¿Viste al conejo pasar? 🐇',
      'Si no sabes a dónde ir, cualquier camino te llevará. 🐾'
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    displayBubble(cat, randomQuote);

    if (clickTimeout) clearTimeout(clickTimeout);

    // Quitar cuerpo iluminado tras 3 segundos
    clickTimeout = setTimeout(() => {
      cat.classList.remove('reveal-body');
      clickTimeout = null;
    }, 3000);
  });

  function displayBubble(element, text) {
    const oldBubbles = document.querySelectorAll('.decor-bubble');
    oldBubbles.forEach(b => b.remove());

    const bubble = document.createElement('div');
    bubble.className = 'decor-bubble';
    bubble.textContent = text;

    const rect = element.getBoundingClientRect();
    const bubbleWidth = 130;

    let top = window.scrollY + rect.top - 48;
    let left = window.scrollX + rect.left + (rect.width / 2) - (bubbleWidth / 2);

    if (left < 10) left = 10;
    if (left + bubbleWidth > window.innerWidth - 10) {
      left = window.innerWidth - bubbleWidth - 10;
    }

    bubble.style.top = `${top}px`;
    bubble.style.left = `${left}px`;

    document.body.appendChild(bubble);

    setTimeout(() => {
      bubble.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      bubble.style.opacity = '0';
      bubble.style.transform = 'translateY(-8px) scale(0.9)';
      setTimeout(() => {
        bubble.remove();
      }, 400);
    }, 2500);
  }
}

/* ==========================================================================
   TEST DE PERSONALIDAD (TRIVIA MODAL)
   ========================================================================== */
function initQuiz() {
  const modal = document.getElementById('quiz-modal');
  const startBtn = document.getElementById('start-quiz-btn');
  const closeBtn = document.getElementById('quiz-close-btn');
  const nextStart = document.getElementById('quiz-next-start');
  const restartBtn = document.getElementById('quiz-restart-btn');

  if (!modal || !startBtn) return;

  let scores = { alicia: 0, conejo: 0, sombrerero: 0, reina: 0, cheshire: 0 };

  // Abrir modal
  startBtn.addEventListener('click', () => {
    modal.classList.add('active');
    resetQuiz();
  });

  // Cerrar modal
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  // Cerrar clickeando afuera
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // Iniciar preguntas
  nextStart.addEventListener('click', () => {
    goToStep(1);
  });

  // Reiniciar test
  restartBtn.addEventListener('click', () => {
    resetQuiz();
    goToStep(1);
  });

  // Escuchar respuestas de opciones
  const optionButtons = modal.querySelectorAll('.quiz-option-btn');
  optionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const scoreKey = btn.getAttribute('data-score');
      if (scoreKey && scores.hasOwnProperty(scoreKey)) {
        scores[scoreKey]++;
      }

      // Avanzar al siguiente paso
      const parentStep = btn.closest('.quiz-step');
      const stepId = parentStep.id;
      if (stepId === 'quiz-step-1') {
        goToStep(2);
      } else if (stepId === 'quiz-step-2') {
        goToStep(3);
      } else if (stepId === 'quiz-step-3') {
        showResults();
      }
    });
  });

  function goToStep(stepNum) {
    const steps = modal.querySelectorAll('.quiz-step');
    steps.forEach(step => step.classList.remove('active'));

    let target;
    if (stepNum === 'start') {
      target = document.getElementById('quiz-step-start');
    } else if (stepNum === 'result') {
      target = document.getElementById('quiz-step-result');
    } else {
      target = document.getElementById(`quiz-step-${stepNum}`);
    }

    if (target) {
      target.classList.add('active');
    }
  }

  function resetQuiz() {
    scores = { alicia: 0, conejo: 0, sombrerero: 0, reina: 0, cheshire: 0 };
    goToStep('start');
  }

  function showResults() {
    let winner = 'alicia';
    let maxScore = -1;

    for (const char in scores) {
      if (scores[char] > maxScore) {
        maxScore = scores[char];
        winner = char;
      }
    }

    const characterData = {
      alicia: {
        emoji: '👧🏼',
        name: 'Alicia',
        desc: 'Eres una persona sumamente curiosa, noble y analítica. Te encanta explorar nuevos rumbos y cuestionar las reglas absurdas del mundo. Siempre intentas encontrarle sentido a lo que parece no tenerlo.'
      },
      conejo: {
        emoji: '🐇',
        name: 'El Conejo Blanco',
        desc: 'Eres una persona puntual, responsable y muy organizada. Siempre andas con prisas y preocupado por cumplir tus citas y deberes a la perfección. ¡No olvides tomar un respiro de vez en cuando!'
      },
      sombrerero: {
        emoji: '🎩',
        name: 'El Sombrerero Loco',
        desc: 'Eres el alma de la fiesta, creativo, excéntrico y leal. Para ti la vida es una eterna celebración y te encanta resolver acertijos extraños con una buena taza de té y mucha imaginación.'
      },
      reina: {
        emoji: '👑',
        name: 'La Reina de Corazones',
        desc: 'Eres una persona de temperamento fuerte, decidida y líder por naturaleza. Te gusta que las cosas se hagan a tu manera y de inmediato, aunque a veces tu enojo te haga perder la cabeza. ¡A disfrutar las tartas!'
      },
      cheshire: {
        emoji: '😸',
        name: 'El Gato de Cheshire',
        desc: 'Eres enigmático, sabio y muy bromista. Prefieres observar las cosas a la distancia con una gran sonrisa y desaparecer de los problemas cuando las cosas se complican. Tu filosofía es única.'
      }
    };

    const data = characterData[winner];
    const resultCard = document.getElementById('quiz-result-card');
    if (resultCard && data) {
      resultCard.innerHTML = `
        <div class="result-emoji">${data.emoji}</div>
        <div class="result-name">${data.name}</div>
        <div class="result-desc">${data.desc}</div>
      `;
    }

    goToStep('result');
  }
}

