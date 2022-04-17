const options = {
  root: document.body.main,
  rootMargin: '0px 0px -90% 0px',
  threshold: 0 // half of item height
}

const figure = document.getElementById('Fahrzeug');

const observer = new IntersectionObserver(entries => {
  const [{ isIntersecting }] = entries
  if (isIntersecting) {
    // console.log('intersected');
    figure.classList.add('intersected');
  } else {
    figure.classList.remove('intersected');
    // console.log('not-intersecting');
  }
}, options);

window.addEventListener('load', () => {
  if ('IntersectionObserver' in window) observer.observe(figure);
}, false);
