// ==== IMAGE SLIDER ====
const slideContainer = document.querySelector('.slides');
let slides = document.querySelectorAll('.slide');
let currentSlide = 1;
let isTransitioning = false;
let startX = 0;
let currentX = 0;
let isDragging = false;
let animationID;
let interval;

// Clone slides for seamless looping
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);
slideContainer.appendChild(firstClone);
slideContainer.prepend(lastClone);
slides = document.querySelectorAll('.slide');

const slideWidth = window.innerWidth;
slideContainer.style.transform = `translateX(-${currentSlide * slideWidth}px)`;

// Transition to slide
function goToSlide(index) {
  isTransitioning = true;
  slideContainer.style.transition = 'transform 0.5s ease';
  slideContainer.style.transform = `translateX(-${index * slideWidth}px)`;
  currentSlide = index;
}

// After transition (handle clones)
slideContainer.addEventListener('transitionend', () => {
  slideContainer.style.transition = 'none';
  if (slides[currentSlide].isSameNode(firstClone)) {
    currentSlide = 1;
    slideContainer.style.transform = `translateX(-${slideWidth}px)`;
  } else if (slides[currentSlide].isSameNode(lastClone)) {
    currentSlide = slides.length - 2;
    slideContainer.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
  }
  isTransitioning = false;
  startAutoSlide();  // Restart auto-slide after transition
});

// Auto-slide
function startAutoSlide() {
  clearInterval(interval);
  interval = setInterval(() => {
    if (!isDragging) goToSlide(currentSlide + 1);
  }, 3000);
}
startAutoSlide();

// Drag functions
function startDrag(x) {
  isDragging = true;
  startX = x;
  currentX = x;
  slideContainer.style.transition = 'none';
  cancelAnimationFrame(animationID);
}

function duringDrag(x) {
  currentX = x;
  const translateX = -currentSlide * slideWidth + (currentX - startX);
  slideContainer.style.transform = `translateX(${translateX}px)`;
}

function endDrag() {
  const moveX = currentX - startX;
  if (Math.abs(moveX) > slideWidth / 4) {
    if (moveX < 0) {
      goToSlide(currentSlide + 1);
    } else {
      goToSlide(currentSlide - 1);
    }
  } else {
    goToSlide(currentSlide);
  }
  isDragging = false;
  startAutoSlide();  // Restart auto-slide after drag
}

// Wheel scroll to change slide
slideContainer.addEventListener("wheel", (e) => {
  if (isTransitioning || isDragging) return;

  stopAutoSlide();

  if (e.deltaX > 30) {
    goToSlide(currentSlide + 1); // right swipe
  } else if (e.deltaX < -30) {
    goToSlide(currentSlide - 1); // left swipe
  }

  startAutoSlide();  // Restart auto-slide after wheel interaction
});

// Mouse Events
slideContainer.addEventListener('mousedown', (e) => {
  stopAutoSlide();
  startDrag(e.clientX);
});

slideContainer.addEventListener('mousemove', (e) => {
  if (isDragging) duringDrag(e.clientX);
});

slideContainer.addEventListener('mouseup', () => {
  if (isDragging) endDrag();
});

slideContainer.addEventListener('mouseleave', () => {
  if (isDragging) endDrag();
});

// Touch Events
slideContainer.addEventListener('touchstart', (e) => {
  stopAutoSlide();
  startDrag(e.touches[0].clientX);
});

slideContainer.addEventListener('touchmove', (e) => {
  if (isDragging) duringDrag(e.touches[0].clientX);
});

slideContainer.addEventListener('touchend', () => {
  if (isDragging) endDrag();
});

// Stop slide
function stopAutoSlide() {
  clearInterval(interval);
}