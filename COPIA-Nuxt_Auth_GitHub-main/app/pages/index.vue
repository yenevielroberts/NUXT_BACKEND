

<template>
  <main class="landing">
    <header class="hero">
      <h1>Catálogo Personalizado de Galaxias y Planetas</h1>
      <p class="subtitle">Explora, aprende y crea tu propio universo. Descubre información única sobre galaxias y planetas, y personaliza tu catálogo astronómico.</p>
      <div class="cta-buttons">
        <NuxtLink to="/listado" class="cta">Explorar Catálogo</NuxtLink>
        <NuxtLink to="/register" class="cta secondary">Crear cuenta</NuxtLink>
      </div>
    </header>

    <section class="features">
      <div class="feature-grid">
        <article class="feature-card">
          <img src="/imgPlanetas/earth.png" alt="Planetas" class="feature-icon" />
          <h3>Planetas</h3>
          <p>Consulta fichas detalladas de planetas, filtra por tipo, tamaño y características.</p>
        </article>
        <article class="feature-card">
          <img src="/imgGalaxias/galaxia.png" alt="Galaxias" class="feature-icon" />
          <h3>Galaxias</h3>
          <p>Explora galaxias de distintas formas, tamaños y clasificaciones. Añade tus favoritas al catálogo.</p>
        </article>
        <article class="feature-card">
          <img src="/imgGalaxias/galaxia.png" alt="Personaliza" class="feature-icon" />
          <h3>Personaliza</h3>
          <p>Crea tu propio catálogo, guarda objetos astronómicos y comparte tus descubrimientos.</p>
        </article>
      </div>
    </section>

    <section class="about">
      <h2>¿Por qué usar este catálogo?</h2>
      <ul>
        <li>Información actualizada y visualmente atractiva.</li>
        <li>Herramientas para personalizar y organizar tus objetos favoritos.</li>
        <li>Recursos educativos para aprender sobre el universo.</li>
      </ul>
    </section>

    <footer class="site-footer">
      <small>© 2026 Catálogo Galaxias y Planetas</small>
    </footer>
  </main>
</template>


<style >
:root {
  --deep-space: #070b1a;
  --nebula-1: #1e1b4b;
  --nebula-2: #312e81;
  --nebula-3: #4c1d95;
  --accent: #7c3aed;
  --accent-soft: #4a1e3e;
  --text-main: #cbd5ff;
  --text-soft: #94a3b8;
  --glass: rgba(20, 25, 60, 0.55);

  /* Fondo principal basado en el negro del espacio */
  /*--deep-space: #040508; */
  
  /* Gradientes inspirados en las nubes de gas azul y rosa */
  /*--nebula-1: #1a1b3a;*/ 
  /*--nebula-2: #4a1e3e; /* Tono rojizo/púrpura de la imagen */
  /*--nebula-3: #1e3a5f; /* Azul profundo */
  
  /* Colores de acento extraídos de las estrellas jóvenes y núcleos */
  /*--accent: #f48fb1; /* Rosa vibrante */
  /*--accent-soft: #a5b9f9; /* Azul claro brillante */
  /*--accent-gold: #fde68a; /* Dorado para detalles pequeños */
  
  /* Texto */
  /*--text-main: #e2e8f0;
  --text-soft: #94a3b8;
  
  /* Efecto cristal mejorado */
  /*--glass: rgba(15, 20, 40, 0.65);*/
}



/* Fondo */
.landing {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 3rem 1.25rem;
  background:
    radial-gradient(circle at 15% 20%, var(--nebula-3), transparent 40%),
    radial-gradient(circle at 85% 0%, var(--nebula-2), transparent 40%),
    radial-gradient(circle at 50% 100%, var(--nebula-1), transparent 60%),
    var(--deep-space);
  color: var(--text-main);
  position: relative;
  overflow: hidden;
}

/* Estrellas más sutiles */
.landing::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 40px 60px, #aaa, transparent),
    radial-gradient(1px 1px at 140px 200px, #888, transparent),
    radial-gradient(1px 1px at 260px 120px, #777, transparent);
  opacity: 0.25;
  animation: twinkle 8s infinite alternate;
}

@keyframes twinkle {
  from { opacity: 0.15; }
  to { opacity: 0.35; }
}

/* HERO */
.hero {
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--glass);
  border-radius: 20px;
  backdrop-filter: blur(18px);
  box-shadow: 0 0 40px rgba(124,58,237,0.25);
}

.hero h1 {
  font-size: 2.8rem;
  background: linear-gradient(90deg, #7c3aed, #38bdf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  margin-top: 1rem;
  color: var(--text-soft);
  font-size: 1.1rem;
}

/* BOTONES */
.cta-buttons {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.cta {
  padding: 0.8rem 2rem;
  border-radius: 40px;
  text-decoration: none;
  font-weight: 600;
  transition: 0.3s ease;
  background: linear-gradient(90deg, #7c3aed, #4c1d95);
  color: #e0e7ff;
  box-shadow: 0 0 20px rgba(124,58,237,0.4);
}

.cta:hover {
  transform: scale(1.06);
  box-shadow: 0 0 25px rgba(56,189,248,0.6);
}

.cta.secondary {
  background: transparent;
  border: 2px solid var(--accent-soft);
  color: var(--accent-soft);
}

.cta.secondary:hover {
  background: var(--accent-soft);
  color: #070b1a;
}

/* FEATURES */
.features {
  max-width: 1100px;
  margin: 0 auto;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: var(--accent-soft);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  transition: 0.3s ease;
  border: 1px solid rgba(124,58,237,0.2);
  backdrop-filter: blur(12px);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 0 35px rgba(124,58,237,0.35);
}

.feature-icon {
  width: 220px;
  height: 160px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 10px rgba(124,58,237,0.6));
}

.feature-card h3 {
  font-size: 1.4rem;
  margin-bottom: 0.6rem;
  color: black;
}

.feature-card p {
  color: var(--text-soft);
  line-height: 1.6;
}

/* ABOUT */
.about {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.about h2 {
  margin-bottom: 1rem;
  color: var(--accent);
}

.about li {
  margin: 0.6rem 0;
  color: var(--text-soft);
}

/* FOOTER */
.site-footer {
  text-align: center;
  margin-top: auto;
  padding-top: 1.5rem;
  color: var(--text-soft);
  font-size: 0.9rem;
}
</style>
