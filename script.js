
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const closeMenu = () => { if (!toggle || !nav) return; nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); };
  if (toggle && nav) {
    toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    document.addEventListener('click', e => { if (!nav.contains(e.target) && !toggle.contains(e.target)) closeMenu(); });
  }

  document.querySelectorAll('[data-current-year]').forEach(el => el.textContent = new Date().getFullYear());

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) revealEls.forEach(el => el.classList.add('visible'));
  else {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), {threshold:.08});
    revealEls.forEach(el => observer.observe(el));
  }

  const params = new URLSearchParams(location.search);
  const diagnosticForm = document.querySelector('[data-diagnostic-form]');
  if (diagnosticForm) {
    const parcours = params.get('parcours');
    const rythme = params.get('rythme');
    if (parcours) {
      const select = diagnosticForm.elements.parcours;
      const map = {'arabe':'Langue arabe','lecture-coran':'Coran — lecture depuis zéro','tajwid':'Coran — tajwid et récitation','memorisation':'Coran — mémorisation','comprehension-coran':'Compréhension du Coran'};
      const wanted = map[parcours] || parcours;
      [...select.options].forEach(o => { if (o.value === wanted) select.value = wanted; });
    }
    if (rythme) { const s = diagnosticForm.elements.rythme; const value = rythme + ' cours par semaine'; [...s.options].forEach(o => { if (o.value === value) s.value = value; }); }
    diagnosticForm.addEventListener('submit', e => {
      e.preventDefault();
      const status = diagnosticForm.querySelector('.form-status');
      if (!diagnosticForm.checkValidity()) { diagnosticForm.reportValidity(); status.textContent = 'Merci de compléter les champs obligatoires.'; return; }
      const data = Object.fromEntries(new FormData(diagnosticForm).entries());
      const message = `Assalamu alaykoum, je souhaite réserver un diagnostic gratuit.

Nom : ${data.nom}
E-mail : ${data.email}
WhatsApp : ${data.whatsapp}
Parcours : ${data.parcours}
Niveau : ${data.niveau}
Rythme envisagé : ${data.rythme || 'À déterminer'}
Objectif dans 6 mois : ${data.objectif}
Difficultés : ${data.difficultes || 'Non précisées'}
Disponibilités : ${data.disponibilites || 'À déterminer'}`;
      const result = document.querySelector('[data-diagnostic-result]');
      result.hidden = false;
      result.querySelector('[data-message-preview]').textContent = message;
      result.querySelector('[data-whatsapp-result]').href = 'https://wa.me/905057122637?text=' + encodeURIComponent(message);
      status.textContent = 'Votre demande est prête. Continuez avec les deux boutons ci-dessous.';
      result.scrollIntoView({behavior: reduced ? 'auto' : 'smooth', block:'center'});
    });
  }

  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const status = contactForm.querySelector('.form-status');
    if (!contactForm.checkValidity()) { contactForm.reportValidity(); status.textContent='Merci de compléter les champs obligatoires.'; return; }
    const data = Object.fromEntries(new FormData(contactForm).entries());
    const msg = `Assalamu alaykoum,

Nom : ${data.nom}
E-mail : ${data.email}
Sujet : ${data.sujet}

${data.message}`;
    status.textContent='Ouverture de WhatsApp…';
    window.open('https://wa.me/905057122637?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });

  const quiz = document.querySelector('[data-level-quiz]');
  if (quiz) quiz.addEventListener('submit', e => {
    e.preventDefault();
    if (!quiz.checkValidity()) { quiz.reportValidity(); return; }
    const d = Object.fromEntries(new FormData(quiz).entries());
    const score = Number(d.q1)+Number(d.q2)+Number(d.q3);
    let title, text, link;
    if (d.goal === 'arabe') { title='Programme de langue arabe'; text = score < 3 ? 'Commencez par le parcours Débutant complet : alphabet, lecture, écriture et premières phrases.' : 'Explorez le parcours Fondations ou Intermédiaire, avec compréhension, conversation et grammaire.'; link='langue-arabe.html'; }
    else if (d.goal === 'tajwid') { title='Tajwid et perfectionnement'; text = score < 3 ? 'Avant le tajwid détaillé, consolidez d’abord la lecture et la prononciation de base.' : 'Le parcours de tajwid peut vous aider à corriger la récitation et appliquer les règles.'; link= score < 3 ? 'lecture-coran.html':'tajwid.html'; }
    else if (d.goal === 'memorisation') { title='Mémorisation et révision'; text = score < 3 ? 'Consolidez la lecture, puis construisez un plan de mémorisation adapté.' : 'Vous pouvez explorer un parcours de mémorisation avec révision organisée.'; link= score < 3 ? 'lecture-coran.html':'memorisation.html'; }
    else { title='Lecture du Coran'; text = score < 3 ? 'Commencez par l’alphabet et l’assemblage des lettres.' : 'Travaillez la fluidité, la prononciation et l’autonomie de lecture.'; link='lecture-coran.html'; }
    const result = quiz.querySelector('[data-quiz-result]');
    result.innerHTML = `<h3>${title}</h3><p>${text}</p><a class="btn btn-gold" href="${link}">Découvrir ce parcours</a> <a class="btn btn-light" href="diagnostic.html">Confirmer avec le diagnostic</a>`;
    result.hidden=false;
    result.scrollIntoView({behavior: reduced ? 'auto':'smooth', block:'center'});
  });
})();
