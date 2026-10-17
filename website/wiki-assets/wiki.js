document.documentElement.classList.add('js');
const input = document.querySelector('#wiki-search');
const results = document.querySelector('#search-results');
const content = document.querySelector('#page-content');
const list = document.querySelector('#search-list');
const status = document.querySelector('#search-status');
const data = JSON.parse(document.querySelector('#wiki-search-data').textContent);
const normalize = text => text.toLocaleLowerCase('de').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g,'ss');
function search() {
  const query = normalize(input.value.trim());
  results.hidden = !query;
  content.hidden = Boolean(query);
  list.replaceChildren();
  if (!query) return;
  const words = query.split(/\s+/);
  const matches = data.filter(a => words.every(word => normalize(a.text).includes(word)));
  status.textContent = `${matches.length} ${matches.length === 1 ? 'Treffer' : 'Treffer'} für „${input.value.trim()}“`;
  if (!matches.length) status.textContent += '. Versuche einen anderen Begriff, zum Beispiel Inventar oder Werkstatt.';
  for (const a of matches) {
    const link = document.createElement('a'); link.href = a.url;
    const category = document.createElement('small'); category.textContent = a.planned ? 'Bald verfügbar' : a.category;
    const title = document.createElement('strong'); title.textContent = a.title;
    link.append(category, title); list.append(link);
  }
}
input.addEventListener('input', search);
document.querySelector('#clear-search').addEventListener('click', () => { input.value=''; search(); input.focus(); });
input.addEventListener('keydown', e => { if (e.key==='Escape') {input.value='';search();} });
const toggle = document.querySelector('#menu-toggle');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded',String(open));
  document.querySelector('#wiki-nav').classList.toggle('is-open',open);
});
for (const button of document.querySelectorAll('[data-filter]')) button.addEventListener('click', () => {
  for (const b of document.querySelectorAll('[data-filter]')) b.setAttribute('aria-pressed',String(b===button));
  let count = 0;
  for (const card of document.querySelectorAll('[data-card]')) {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    if (!card.hidden) count++;
  }
  document.querySelector('#filter-empty').hidden = count > 0;
});
document.querySelector('#copy-link')?.addEventListener('click', async () => {
  const url = new URL(location.href); url.hash=''; url.search='';
  try { await navigator.clipboard.writeText(url.href); document.querySelector('#copy-status').textContent='Link kopiert.'; }
  catch { document.querySelector('#copy-status').textContent='Kopiere den Link aus der Adresszeile.'; }
});
