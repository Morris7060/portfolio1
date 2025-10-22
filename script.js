/* script.js - animations, theme, EmailJS integration */
document.addEventListener('DOMContentLoaded', function(){

  // --- THEME (light/dark) with localStorage persistence ---
  const root = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  function setTheme(theme){
    if(theme === 'light') root.setAttribute('data-theme','light');
    else root.removeAttribute('data-theme');
    localStorage.setItem('theme', theme);
    themeToggle.textContent = theme === 'light' ? '☀️' : '🌙';
  }
  // initialize from storage or prefer dark
  const saved = localStorage.getItem('theme') || 'dark';
  setTheme(saved);

  themeToggle.addEventListener('click', ()=>{
    const current = localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
    setTheme(current === 'light' ? 'dark' : 'light');
  });

  // --- Smooth scroll for nav links ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // --- INTERSECTION OBSERVER for reveals ---
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('show');
      }
    });
  }, {threshold: 0.12});

  document.querySelectorAll('.section, .hero-card, .skill-card, .project, .about-item, .hero-text').forEach(el=>{
    // add base class if not present
    if(!el.classList.contains('fade-up')) el.classList.add('fade-up');
    io.observe(el);
  });

  // --- Card tilt micro-interaction using pointermove ---
  const tilt = document.querySelector('.animate-tilt');
  if(tilt){
    tilt.addEventListener('pointermove', (ev)=>{
      const r = tilt.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const dx = ev.clientX - cx;
      const dy = ev.clientY - cy;
      const tx = (dy / r.height) * 6; // rotateX
      const ty = (dx / r.width) * -6; // rotateY
      tilt.style.transform = `rotateX(${tx}deg) rotateY(${ty}deg)`;
    });
    tilt.addEventListener('pointerleave', ()=> tilt.style.transform = '');
  }

  // --- EmailJS contact form ---
  // Replace the following placeholders with your EmailJS user/service/template IDs
  const EMAILJS_USER_ID = 'YOUR_EMAILJS_USER_ID';
  const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

  if(window.emailjs) emailjs.init(EMAILJS_USER_ID);

  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    status.textContent = 'Sending...';
    // If EmailJS IDs are configured, send; otherwise emulate success
    if(EMAILJS_USER_ID && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_USER_ID !== 'YOUR_EMAILJS_USER_ID'){
      emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this)
        .then(()=> { status.textContent = 'Message sent — thanks!'; this.reset(); })
        .catch(()=> { status.textContent = 'There was an error sending the message.'; });
    } else {
      // Demo fallback
      setTimeout(()=>{ status.textContent = 'Message delivered (demo). Replace EmailJS IDs in script.js to enable real sending.'; form.reset(); }, 900);
    }
  });

});