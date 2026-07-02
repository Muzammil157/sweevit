class SweevitMobileMenu {
  constructor() {
    this.drawer = document.querySelector('[data-sweevit-drawer]');
    if (!this.drawer) return;

    this.toggle = document.querySelector('[data-sweevit-menu-toggle]');
    this.closeBtn = this.drawer.querySelector('[data-sweevit-drawer-close]');
    this.overlay = this.drawer.querySelector('[data-sweevit-drawer-overlay]');
    this.panel = this.drawer.querySelector('.sweevit-header__drawer-panel');
    this.menuItems = this.drawer.querySelectorAll('.sweevit-header__drawer-menu li');
    this.cta = this.drawer.querySelector('.sweevit-header__drawer-cta');
    this.isAnimating = false;
    this.duration = 480;

    document.body.appendChild(this.drawer);

    this.toggle?.addEventListener('click', () => this.open());
    this.closeBtn?.addEventListener('click', () => this.close());
    this.overlay?.addEventListener('click', () => this.close());

    this.drawer.querySelectorAll('.sweevit-header__drawer-link').forEach((link) => {
      link.addEventListener('click', () => this.close());
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.drawer.classList.contains('is-open')) {
        this.close();
      }
    });
  }

  open() {
    if (this.isAnimating || this.drawer.classList.contains('is-open')) return;

    this.isAnimating = true;
    this.drawer.classList.remove('is-closing');
    this.drawer.classList.add('is-active');
    this.drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('sweevit-drawer-open');
    this.toggle?.setAttribute('aria-expanded', 'true');

    /* Force closed-state paint before animating open */
    void this.panel.offsetWidth;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.drawer.classList.add('is-open');
        window.setTimeout(() => {
          this.isAnimating = false;
        }, this.duration);
      });
    });
  }

  close() {
    if (this.isAnimating || !this.drawer.classList.contains('is-open')) return;

    this.isAnimating = true;
    this.drawer.classList.add('is-closing');
    this.drawer.classList.remove('is-open');
    document.body.classList.remove('sweevit-drawer-open');
    this.toggle?.setAttribute('aria-expanded', 'false');

    window.setTimeout(() => this.finishClose(), this.duration + 80);
  }

  finishClose() {
    this.drawer.classList.remove('is-closing', 'is-active');
    this.drawer.setAttribute('aria-hidden', 'true');
    this.isAnimating = false;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new SweevitMobileMenu());
} else {
  new SweevitMobileMenu();
}
