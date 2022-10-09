'use strict';
///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
//--
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
//--
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
//--
const nav = document.querySelector('.nav');
//--
const header = document.querySelector('.header');
const secondSection = document.querySelector('#section--2');
const navHeight = nav.getBoundingClientRect().height;
//--
const allSections = document.querySelectorAll('.section');
//--
const lazyImages = document.querySelectorAll('img[data-src]');
//--
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
//--
const dotContainer = document.querySelector('.dots');
//--
//------------------------------------------------------
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
//------------------------------------------------------
// Main Button for scroller
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});
//------------------------------------------------------
//Headers Scroller buttons
//----------------------------Old Method
/*document.querySelectorAll('.nav__link').forEach(function (element) {
  element.addEventListener('click', e => {
    e.preventDefault();
    const id = document.querySelector(e.target.getAttribute('href'));
    id.scrollIntoView({ behavior: 'smooth' });
  });
}); */
//---------------------------- New way;
document.querySelector('.nav__links').addEventListener('click', e => {
  e.preventDefault();

  //My own way
  /*const id = document.querySelector(
    e.target.getAttribute('href') || e.target.getAttribute('#')
  );
  id !== null ? id.scrollIntoView({ behavior: 'smooth' }) : null; */

  // Matching
  if (e.target.classList.contains('nav__link')) {
    const id = document.querySelector(e.target.getAttribute('href'));
    id.scrollIntoView({ behavior: 'smooth' });
  }
});
//------------------------------------------------------
//three main tabs
tabContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  // Tabs Button Effects
  tabs.forEach(el => el.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //show content
  tabsContent.forEach(el => el.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.getAttribute('data-tab')}`)
    .classList.toggle('operations__content--active');
});
//------------------------------------------------------
// behavior of the navigation part
function Hover(e) {
  if (e.target.classList.contains('nav__link')) {
    const hovered = e.target;
    const sibling = hovered
      .closest('.nav__links')
      .querySelectorAll('.nav__link');
    const logo = document.querySelector('.nav__logo');

    sibling.forEach(el => {
      if (el != hovered) {
        el.style.opacity = this;
        logo.style.opacity = this;
      }
    });
  }
}
nav.addEventListener('mouseover', Hover.bind(0.5));
nav.addEventListener('mouseout', Hover.bind(1));
//------------------------------------------------------
// Implementing sticky navigation
const section1Coordinate = section1.getBoundingClientRect();
window.addEventListener('scroll', e => {
  if (window.pageYOffset > section1Coordinate.top) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
});
//------------------------------------------------------
const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    document.querySelector('.nav').classList.add('sticky');
  } else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);
//------------------------------------------------------
//Reveal sections
function revealSection(entries, observer) {
  const [entire] = entries;
  if (!entire.isIntersecting) return;
  entire.target.classList.remove('section--hidden');
  observer.unobserve(entire.target);
}
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});
allSections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});
//------------------------------------------------------
// Lazy loading images
function lazyLoad(entries, observer) {
  const [entire] = entries;
  if (!entire.isIntersecting) return;
  (async function () {
    try {
      entire.target.src = await entire.target.dataset.src;
      entire.target.classList.remove('lazy-img');
    } catch (err) {
      console.error(`2: ${err.message} 💥`);
    }
  })();
  // entire.target.src = entire.target.dataset.src;
  // entire.target.addEventListener('load', () => {
  //   entire.target.classList.remove('lazy-img');
  // });
  // observer.unobserve(entire.target);
}
const lazyLoadingObserver = new IntersectionObserver(lazyLoad, {
  root: null,
  threshold: 0.2,
});
lazyImages.forEach(image => lazyLoadingObserver.observe(image));

//Images Pixelation
const lazySections = [header, secondSection];
function lazyUnload(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  lazyImages.forEach(image => {
    image.classList.add('lazy-img');
  });
  // observer.unobserve(entry.target);
}
const sectionsObserver = new IntersectionObserver(lazyUnload, {
  root: null,
  threshold: 0.9,
});
lazySections.forEach(section => sectionsObserver.observe(section));
//------------------------------------------------------
//slider
let current = 0;
//--
const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

function reload(target) {
  goTo(target);
  activateDot(target);
}

function goTo(currents) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - currents)}%)`;
  });
}
reload(current);

function moveRight() {
  current < slides.length - 1 ? current++ : (current = 0);
  reload(current);
}
function moveLift() {
  current > 0 ? current-- : (current = slides.length - 1);
  reload(current);
}
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    reload(slide);
  }
});

document.addEventListener('keydown', e => {
  e.key == 'ArrowLeft' && moveLift();
  e.key == 'ArrowRight' && moveRight();
});
btnRight.addEventListener('click', moveRight);
btnLeft.addEventListener('click', moveLift);
