const topicTitles = [...document.querySelectorAll('.topic h3')];

if (topicTitles.length > 0) {
  const topicGrid = document.querySelector('.topic-grid');
  document.documentElement.classList.add('fit-topic-titles');
  const textRange = document.createRange();

  function fitTopicTitles() {
    topicGrid.style.removeProperty('--topic-title-size');

    const baseSize = parseFloat(getComputedStyle(topicTitles[0]).fontSize);
    let sharedSize = baseSize;

    for (const title of topicTitles) {
      textRange.selectNodeContents(title.querySelector('a') ?? title);
      const textWidth = textRange.getBoundingClientRect().width;
      const availableWidth = title.getBoundingClientRect().width;
      if (textWidth > availableWidth) {
        sharedSize = Math.min(sharedSize, baseSize * (availableWidth - 1) / textWidth);
      }
    }

    topicGrid.style.setProperty('--topic-title-size', `${sharedSize}px`);
  }

  fitTopicTitles();
  window.addEventListener('resize', fitTopicTitles);
}
