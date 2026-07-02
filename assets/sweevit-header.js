class SweevitMobileMenu {
  constructor() {
    this.drawer = document.querySelector('[data-sweevit-drawer]');
    if (!this.drawer) return;

    this.toggle = document.querySelector('[data-sweevit-menu-toggle]');
    this.closeBtn = document.querySelector('[data-sweevit-drawer-close]');
    this.overlay = document.querySelector('[data-sweevit-drawer-overlay]');
    this.panel = this.drawer.querySelector('.sweevit-header__drawer-panel');
    this.isAnimating = false;

    this.duration = this.getTransitionDuration();

    this.toggle?.addEventListener('click', () => this.open());
    this.closeBtn?.addEventListener('click', () => this.close());
    this.overlay?.addEventListener('click', () => this.close());
    this.panel?.addEventListener('transitionend', (event) => this.onTransitionEnd(event));

    this.drawer.querySelectorAll('.sweevit-header__drawer-link').forEach((link) => {
      link.addEventListener('click', () => this.close());
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.drawer.classList.contains('is-open')) {
        this.close();
      }
    });
  }

  getTransitionDuration() {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue('--sweevit-drawer-duration')
      .trim();

    if (!value) return 480;

    return value.endsWith('ms') ? parseFloat(value) : parseFloat(value) * 1000;
  }

  open() {
    if (this.isAnimating || this.drawer.classList.contains('is-open')) return;

    this.isAnimating = true;
    this.drawer.classList.remove('is-closing');
    this.drawer.classList.add('is-open');
    this.drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    this.toggle?.setAttribute('aria-expanded', 'true');

    window.setTimeout(() => {
      this.isAnimating = false;
    }, this.duration);
  }

  close() {
    if (this.isAnimating || !this.drawer.classList.contains('is-open')) return;

    this.isAnimating = true;
    this.drawer.classList.add('is-closing');
    this.drawer.classList.remove('is-open');
    document.body.style.overflow = '';
    this.toggle?.setAttribute('aria-expanded', 'false');
  }

  onTransitionEnd(event) {
    if (event.target !== this.panel || event.propertyName !== 'transform') return;

    if (this.drawer.classList.contains('is-closing')) {
      this.drawer.classList.remove('is-closing');
      this.drawer.setAttribute('aria-hidden', 'true');
      this.isAnimating = false;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SweevitMobileMenu();
});
