class SweevitCarousel {
  constructor(root) {
    this.root = root;
    this.track = root.querySelector('[data-carousel-track]');
    this.dots = root.querySelectorAll('[data-carousel-dot]');
    this.slides = root.querySelectorAll('[data-carousel-slide]');

    if (!this.track || this.slides.length < 2) return;

    this.onScroll = this.syncDots.bind(this);
    this.track.addEventListener('scroll', this.onScroll, { passive: true });

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goTo(index));
    });

    this.syncDots();
  }

  goTo(index) {
    const slide = this.slides[index];
    if (!slide) return;

    this.track.scrollTo({
      left: slide.offsetLeft,
      behavior: 'smooth',
    });
  }

  syncDots() {
    if (!this.dots.length) return;

    const scrollLeft = this.track.scrollLeft;
    const trackWidth = this.track.clientWidth || 1;
    let activeIndex = 0;
    let closestDistance = Infinity;

    this.slides.forEach((slide, index) => {
      const distance = Math.abs(slide.offsetLeft - scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        activeIndex = index;
      }
    });

    this.dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }
}

function initSweevitCarousels() {
  document.querySelectorAll('[data-sweevit-carousel]:not([data-sweevit-carousel-init])').forEach((root) => {
    root.dataset.sweevitCarouselInit = 'true';
    new SweevitCarousel(root);
  });
}

function initComparisonScrollbars() {
  const mobileQuery = window.matchMedia('(max-width: 749px)');

  document.querySelectorAll('[data-comparison-scroll]:not([data-comparison-scroll-init])').forEach((wrap) => {
    const track = wrap.parentElement?.querySelector('.sweevit-comparison__scroll-track');
    const thumb = track?.querySelector('[data-comparison-thumb]');
    if (!thumb || !track) return;

    wrap.dataset.comparisonScrollInit = 'true';

    const updateThumb = () => {
      if (!mobileQuery.matches) {
        track.classList.add('is-hidden');
        return;
      }

      const trackWidth = track.clientWidth;
      const maxScroll = wrap.scrollWidth - wrap.clientWidth;

      if (maxScroll <= 0 || trackWidth <= 0) {
        track.classList.add('is-hidden');
        thumb.style.transform = 'translateX(0)';
        return;
      }

      track.classList.remove('is-hidden');

      const thumbWidth = 139;
      const trackWidth = track.clientWidth;
      const maxThumbTravel = Math.max(trackWidth - thumbWidth, 0);
      const scrollRatio = wrap.scrollLeft / maxScroll;

      thumb.style.width = '139px';
      thumb.style.transform = `translateX(${scrollRatio * maxThumbTravel}px)`;
    };

    wrap.addEventListener('scroll', updateThumb, { passive: true });
    window.addEventListener('resize', updateThumb);
    mobileQuery.addEventListener('change', updateThumb);
    updateThumb();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initSweevitCarousels();
    initComparisonScrollbars();
  });
} else {
  initSweevitCarousels();
  initComparisonScrollbars();
}

document.addEventListener('shopify:section:load', () => {
  initSweevitCarousels();
  initComparisonScrollbars();
});
