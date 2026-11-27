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
