document.addEventListener('DOMContentLoaded', () => {
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
