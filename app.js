document.documentElement.classList.add('js');

const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');
const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];

const setMenu = (open) => {
  navigation.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  document.body.classList.toggle('menu-open', open);
  if (open) navigation.querySelector('a')?.focus();
};

menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));
navigation.addEventListener('click', (event) => {
  if (event.target === navigation) setMenu(false);
});

document.addEventListener('click', (event) => {
  if (menuButton.getAttribute('aria-expanded') === 'true' && !navigation.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 820 && menuButton.getAttribute('aria-expanded') === 'true') setMenu(false);
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }
}, { rootMargin: '0px 0px -8% 0px', threshold: .08 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sectionMap = navLinks.map((link) => ({
  link,
  section: document.querySelector(link.getAttribute('href'))
})).filter(({ section }) => section);

const activeObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach((link) => link.removeAttribute('aria-current'));
  sectionMap.find(({ section }) => section === visible.target)?.link.setAttribute('aria-current', 'true');
}, { rootMargin: '-28% 0px -57% 0px', threshold: [0, .2, .5] });

sectionMap.forEach(({ section }) => activeObserver.observe(section));

const syncHeaderBackground = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);

syncHeaderBackground();
window.addEventListener('scroll', () => {
  syncHeaderBackground();
  if (window.scrollY < document.querySelector('.hero').offsetHeight * .55) {
    navLinks.forEach((link) => link.removeAttribute('aria-current'));
  }
}, { passive: true });

document.querySelectorAll('a.button, .service-card').forEach((element) => {
  element.addEventListener('pointerdown', () => element.classList.add('is-tapped'));
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((name) => element.addEventListener(name, () => element.classList.remove('is-tapped')));
});
