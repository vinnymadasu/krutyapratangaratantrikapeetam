function setLang(lang) {
  document.body.className = 'lang-' + lang;
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.textContent.trim() === (lang === 'te' ? 'తెలుగు' : 'English')) btn.classList.add('active');
  });
}

function closePopup() {
  const overlay = document.getElementById('promoPopup');
  if (overlay) overlay.classList.remove('open');
}

(function initPopup() {
  const overlay = document.getElementById('promoPopup');
  if (!overlay) return;
  if (sessionStorage.getItem('krutyaPopupShown')) return;

  setTimeout(() => {
    overlay.classList.add('open');
    sessionStorage.setItem('krutyaPopupShown', '1');
  }, 800);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePopup();
  });
})();
