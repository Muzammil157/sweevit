class SweevitMobileMenu {
  constructor(drawer) {
    this.drawer = drawer;
    this.toggle = document.querySelector('[data-sweevit-menu-toggle]');
    this.closeBtn = this.drawer.querySelector('[data-sweevit-drawer-close]');
    this.overlay = this.drawer.querySelector('[data-sweevit-drawer-overlay]');
    this.panel = this.drawer.querySelector('.sweevit-header__drawer-panel');
    this.isAnimating = false;
    this.duration = 480;

    if (this.drawer.parentElement !== document.body) {
      document.body.appendChild(this.drawer);
    }

    this.toggle?.addEventListener('click', () => this.open());
    this.closeBtn?.addEventListener('click', () => this.close());
    this.overlay?.addEventListener('click', () => this.close());

    this.drawer.querySelectorAll('.sweevit-header__drawer-link').forEach((link) => {
      link.addEventListener('click', () => this.close());
    });

    this.onKeydown = (event) => {
      if (event.key === 'Escape' && this.drawer.classList.contains('is-open')) {
        this.close();
      }
    };

    document.addEventListener('keydown', this.onKeydown);
  }

  open() {
    if (this.isAnimating || this.drawer.classList.contains('is-open')) return;

    this.isAnimating = true;
    this.drawer.classList.remove('is-closing');
    this.drawer.classList.add('is-active');
    this.drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('sweevit-drawer-open');
    this.toggle?.setAttribute('aria-expanded', 'true');

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

function initSweevitMobileMenu() {
  const drawer = document.querySelector('[data-sweevit-drawer]:not([data-sweevit-initialized])');
  if (!drawer) return;

  drawer.dataset.sweevitInitialized = 'true';
  new SweevitMobileMenu(drawer);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSweevitMobileMenu);
} else {
  initSweevitMobileMenu();
}

document.addEventListener('shopify:section:load', initSweevitMobileMenu);
