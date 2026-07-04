class SweevitProductShowcase extends HTMLElement {
  constructor() {
    super();
    this.quantityInput = this.querySelector('[data-quantity-input]');
    this.minusBtn = this.querySelector('[data-quantity-minus]');
    this.plusBtn = this.querySelector('[data-quantity-plus]');
    this.options = this.querySelectorAll('[data-purchase-option]');
    this.sellingPlanInput = this.querySelector('[data-selling-plan-input]');
    this.atcPrice = this.querySelector('[data-atc-price]');

    this.bindQuantity();
    this.bindPurchaseOptions();
    this.bindGallery();
  }

  bindQuantity() {
    if (!this.quantityInput || !this.minusBtn || !this.plusBtn) return;

    const min = parseInt(this.quantityInput.min, 10) || 1;
    const max = this.quantityInput.max ? parseInt(this.quantityInput.max, 10) : null;

    const syncButtons = () => {
      const value = parseInt(this.quantityInput.value, 10) || min;
      this.minusBtn.disabled = value <= min;
      this.plusBtn.disabled = max !== null && value >= max;
    };

    this.minusBtn.addEventListener('click', () => {
      const value = parseInt(this.quantityInput.value, 10) || min;
      if (value > min) {
        this.quantityInput.value = value - 1;
        this.quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
      syncButtons();
    });

    this.plusBtn.addEventListener('click', () => {
      const value = parseInt(this.quantityInput.value, 10) || min;
      if (max === null || value < max) {
        this.quantityInput.value = value + 1;
        this.quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
      syncButtons();
    });

    this.quantityInput.addEventListener('change', syncButtons);
    syncButtons();
  }

  bindPurchaseOptions() {
    if (!this.options.length) return;

    const setActive = (option) => {
      this.options.forEach((item) => {
        const isActive = item === option;
        item.classList.toggle('is-active', isActive);
        const input = item.querySelector('input[type="radio"]');
        if (input) input.checked = isActive;
      });

      if (this.sellingPlanInput) {
        const planId = option.dataset.sellingPlanId || '';
        if (planId) {
          this.sellingPlanInput.name = 'selling_plan';
          this.sellingPlanInput.value = planId;
        } else {
          this.sellingPlanInput.removeAttribute('name');
          this.sellingPlanInput.value = '';
        }
      }

      this.updateAtcPrice(option);
    };

    this.updateAtcPrice = (option) => {
      if (!this.atcPrice) return;
      const priceEl = option.querySelector('.sweevit-product__option-price');
      if (priceEl) this.atcPrice.textContent = priceEl.textContent.trim();
    };

    this.options.forEach((option) => {
      option.addEventListener('click', () => setActive(option));
      option.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setActive(option);
        }
      });
    });

    const defaultOption =
      Array.from(this.options).find((option) => option.classList.contains('is-active')) || this.options[0];
    setActive(defaultOption);
  }

  bindGallery() {
    const mainImage = this.querySelector('.sweevit-pdp__main-image, [data-pdp-main-image]');
    const thumbnails = this.querySelectorAll('[data-pdp-thumbnail]');
    if (!mainImage || !thumbnails.length) return;

    thumbnails.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        thumbnails.forEach((item) => {
          item.classList.remove('is-active');
          item.setAttribute('aria-current', 'false');
        });
        thumb.classList.add('is-active');
        thumb.setAttribute('aria-current', 'true');

        if (thumb.dataset.src) mainImage.src = thumb.dataset.src;
        if (thumb.dataset.srcset) mainImage.srcset = thumb.dataset.srcset;
      });
    });
  }
}

if (!customElements.get('sweevit-product-showcase')) {
  customElements.define('sweevit-product-showcase', SweevitProductShowcase);
}
