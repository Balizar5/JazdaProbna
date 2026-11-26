const criteria = [
  'Jakość kształcenia', 'Możliwości znalezienia pracy', 'Zarobki absolwentów',
  'Koszty studiowania i życia', 'Lokalizacja uczelni', 'Praktyki i staże',
  'Wymiana międzynarodowa', 'Życie studenckie', 'Dopasowanie programu', 'Dostępność i wsparcie'
];

const demoSchools = [
  { id: 'a', name: 'Uczelnia Demo A', city: 'Kraków', type: 'Publiczna', programs: ['Informatyka', 'Automatyka i robotyka'], ratings: [5, 5, 4, 2, 3, 5, 4, 3, 4, 3] },
  { id: 'b', name: 'Uczelnia Demo B', city: 'Warszawa', type: 'Niepubliczna', programs: ['Psychologia', 'Zarządzanie'], ratings: [4, 3, 3, 2, 5, 4, 3, 4, 5, 4] },
  { id: 'c', name: 'Uczelnia Demo C', city: 'Poznań', type: 'Publiczna', programs: ['Informatyka', 'Ekonomia'], ratings: [4, 4, 4, 4, 4, 3, 4, 5, 4, 5] },
  { id: 'd', name: 'Uczelnia Demo D', city: 'Gdańsk', type: 'Publiczna', programs: ['Kierunek lekarski', 'Biotechnologia'], ratings: [5, 4, 3, 3, 4, 5, 5, 4, 3, 4] },
  { id: 'e', name: 'Uczelnia Demo E', city: 'Poznań', type: 'Niepubliczna', programs: ['Prawo', 'Pedagogika'], ratings: [3, 3, 2, 5, 4, 3, 2, 4, 5, 5] }
];

const questions = [
  ['Czy uczelnia numer jeden zawsze jest najlepszym wyborem?', false, 'Sprawdź, czy program, koszty i dojazd pasują do Twoich potrzeb.'],
  ['Czy wysoka pozycja oznacza wysokie zarobki?', false, 'Zarobki zależą m.in. od branży i doświadczenia. Porównaj dane konkretnych kierunków w ELA.'],
  ['Czy warto sprawdzić program kierunku nawet na prestiżowej uczelni?', true, 'Przedmioty i specjalizacje mogą się różnić między uczelniami.'],
  ['Czy różne rankingi mogą oceniać tę samą uczelnię inaczej?', true, 'Zestawienia stosują różne kryteria i wagi, np. badań, reputacji i umiędzynarodowienia.'],
  ['Czy mniej znana uczelnia może być lepszym wyborem?', true, 'Może mieć specjalizację, praktyki lub wsparcie, które lepiej Ci odpowiadają.']
];

const worldSources = {
  qs: ['https://www.topuniversities.com/world-university-rankings', 'QS uwzględnia m.in. reputację akademicką i opinie pracodawców.'],
  the: ['https://www.timeshighereducation.com/world-university-rankings', 'THE uwzględnia m.in. dydaktykę, środowisko badawcze i jakość badań.'],
  arwu: ['https://www.shanghairanking.com/rankings/arwu', 'ARWU koncentruje się na osiągnięciach badawczych, takich jak publikacje i nagrody.']
};

const byId = id => document.getElementById(id);
const storageKey = 'jazda-probna-rankingi';
let saved = {};
try {
  saved = JSON.parse(localStorage.getItem(storageKey)) ?? {};
} catch {
  // The tools also work when local storage is inaccessible.
}

const defaults = criteria.map(() => 3);
let weights = criteria.map((_, index) => {
  const value = saved.weights?.[index];
  return Number.isInteger(value) && value >= 1 && value <= 5 ? value : 3;
});
const favorites = new Set(demoSchools.filter(school => Array.isArray(saved.favorites) && saved.favorites.includes(school.id)).map(school => school.id));
const comparison = new Set();

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({ weights, favorites: [...favorites] }));
  } catch {
    // Keep the current state in memory when local storage is inaccessible.
  }
}

function schoolCard(school, inComparison = false) {
  const program = byId('school-program').value;
  const details = inComparison ? ' open' : '';
  const selected = comparison.has(school.id);
  return `<article class="ranking-card">
    <h3>${school.name}</h3>
    <p>${school.city} · ${school.type} (demo)</p>
    <p>Kierunki demonstracyjne: ${school.programs.join(', ')}.${program && !school.programs.includes(program) ? ' Wybranego kierunku nie ma w tej ofercie demonstracyjnej.' : ''}</p>
    <details${details}>
      <summary>Zobacz szczegóły</summary>
      <p>Program, stopień i tryb studiów, rekrutacja, czesne, akademiki, Erasmus+, praktyki, koła naukowe, pozycja rankingowa i dane o absolwentach: brak zweryfikowanych danych.</p>
      <p>Oceny fikcyjne używane w kreatorze:</p>
      <ul>${criteria.map((criterion, index) => `<li>${criterion}: ${school.ratings[index]}/5</li>`).join('')}</ul>
    </details>
    <div class="ranking-actions">
      <button type="button" data-compare="${school.id}">${selected ? 'Usuń z porównania' : 'Dodaj do porównania'}</button>
      ${inComparison ? '' : `<button type="button" data-favorite="${school.id}">${favorites.has(school.id) ? 'Usuń z ulubionych' : 'Zapisz w ulubionych'}</button>`}
    </div>
  </article>`;
}

function renderCatalog() {
  const name = byId('school-search').value.trim().toLocaleLowerCase('pl');
  const city = byId('school-city').value;
  const type = byId('school-type').value;
  const program = byId('school-program').value;
  const order = byId('school-sort').value;
  const favoritesOnly = byId('school-favorites').checked;
  const matches = demoSchools.filter(school => school.name.toLocaleLowerCase('pl').includes(name) &&
    (!city || school.city === city) && (!type || school.type === type) &&
    (!program || school.programs.includes(program)) && (!favoritesOnly || favorites.has(school.id)));
  matches.sort((a, b) => a[order].localeCompare(b[order], 'pl'));
  byId('school-results').innerHTML = matches.map(school => schoolCard(school)).join('');
  byId('catalog-status').textContent = matches.length ? `Wyniki demonstracyjne: ${matches.length}.` : 'Brak wyników dla wybranych filtrów.';
  byId('comparison').innerHTML = comparison.size
    ? demoSchools.filter(school => comparison.has(school.id)).map(school => schoolCard(school, true)).join('')
    : '<p>Nie dodano jeszcze żadnej uczelni.</p>';
}

function handleSchoolAction(event) {
  const button = event.target.closest('button');
  if (!button) return;
  const { compare, favorite } = button.dataset;
  if (compare) {
    if (comparison.has(compare)) comparison.delete(compare);
    else if (comparison.size < 4) comparison.add(compare);
    else {
      byId('catalog-status').textContent = 'Możesz porównać maksymalnie cztery uczelnie. Usuń jedną, aby dodać kolejną.';
      return;
    }
  }
  if (favorite) {
    if (favorites.has(favorite)) favorites.delete(favorite);
    else favorites.add(favorite);
    save();
  }
  const region = event.currentTarget;
  renderCatalog();
  const replacement = region.querySelector(compare ? `[data-compare="${compare}"]` : `[data-favorite="${favorite}"]`);
  (replacement ?? byId('school-search')).focus();
}

const filterOptions = {
  'school-city': demoSchools.map(school => school.city),
  'school-type': demoSchools.map(school => school.type),
  'school-program': demoSchools.flatMap(school => school.programs),
  'school-names': demoSchools.map(school => school.name)
};
for (const [id, values] of Object.entries(filterOptions)) {
  for (const value of [...new Set(values)].sort((a, b) => a.localeCompare(b, 'pl'))) {
    byId(id).append(new Option(value, value));
  }
}
byId('demo-filters').addEventListener('input', renderCatalog);
byId('demo-filters').addEventListener('submit', event => event.preventDefault());
byId('school-results').addEventListener('click', handleSchoolAction);
byId('comparison').addEventListener('click', handleSchoolAction);
renderCatalog();

byId('criteria').innerHTML = criteria.map((name, index) =>
  `<label for="weight-${index}">${name} <output for="weight-${index}"></output><input id="weight-${index}" type="range" min="1" max="5" data-index="${index}"></label>`
).join('');

function renderWeights() {
  weights.forEach((weight, index) => {
    const input = byId(`weight-${index}`);
    input.value = weight;
    input.parentElement.querySelector('output').value = `${weight}/5`;
  });
  const highest = Math.max(...weights);
  const top = criteria.filter((_, index) => weights[index] === highest);
  byId('top-criteria').textContent = top.length === criteria.length
    ? 'Wszystkie kryteria mają równą wagę.'
    : `Najważniejsze kryteria: ${top.join(', ')}.`;
}

byId('weights-form').addEventListener('input', event => {
  weights[Number(event.target.dataset.index)] = Number(event.target.value);
  renderWeights();
  byId('personal-results').replaceChildren();
  save();
});

byId('weights-form').addEventListener('reset', event => {
  event.preventDefault();
  weights = [...defaults];
  renderWeights();
  byId('personal-results').replaceChildren();
  save();
});

byId('weights-form').addEventListener('submit', event => {
  event.preventDefault();
  const total = weights.reduce((sum, value) => sum + value, 0);
  const results = demoSchools.map(school => ({
    name: school.name,
    score: school.ratings.reduce((sum, rating, index) => sum + rating * weights[index], 0) / total
  })).sort((a, b) => b.score - a.score);
  byId('personal-results').innerHTML = results.map(result =>
    `<li>${result.name} – ${result.score.toLocaleString('pl', { maximumFractionDigits: 2 })}/5 (demo)</li>`
  ).join('');
});
renderWeights();

function updateWorld() {
  const [url, method] = worldSources[byId('world-source').value];
  byId('world-link').href = url;
  byId('world-method').textContent = method;
}
byId('world-source').addEventListener('change', updateWorld);
updateWorld();

byId('ranking-faq').innerHTML = questions.map(([question, , explanation]) =>
  `<details><summary>${question}</summary><p>${explanation}</p></details>`
).join('');
byId('quiz-questions').innerHTML = questions.map(([question], index) =>
  `<fieldset><legend>${question}</legend><label><input type="radio" name="question-${index}" value="true" required> Tak</label><label><input type="radio" name="question-${index}" value="false"> Nie</label><p class="quiz-feedback" id="feedback-${index}"></p></fieldset>`
).join('');
byId('ranking-quiz').addEventListener('submit', event => {
  event.preventDefault();
  const answers = new FormData(event.currentTarget);
  let score = 0;
  questions.forEach(([, correct, explanation], index) => {
    const right = answers.get(`question-${index}`) === String(correct);
    if (right) score++;
    byId(`feedback-${index}`).textContent = `${right ? 'Dobrze.' : 'Poprawna odpowiedź: ' + (correct ? 'tak.' : 'nie.')} ${explanation}`;
  });
  byId('quiz-score').textContent = `Twój wynik: ${score}/${questions.length}.`;
});
