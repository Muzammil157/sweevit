class SweevitProductShowcase extends HTMLElement {
  constructor() {
    super();
    this.quantityInput = this.querySelector('[data-quantity-input]');
    this.minusBtn = this.querySelector('[data-quantity-minus]');
    this.plusBtn = this.querySelector('[data-quantity-plus]');
    this.options = this.querySelectorAll('[data-purchase-option]');
    this.variantOptions = this.querySelectorAll('[data-variant-option]');
    this.variantIdInput = this.querySelector('.product-variant-id');
    this.sellingPlanInput = this.querySelector('[data-selling-plan-input]');
    this.atcPrice = this.querySelector('[data-atc-price]');
    this.displayPrice = this.querySelector('[data-display-price]');
    this.subscribePrice = this.querySelector('[data-subscribe-price]');
    this.mainImage = this.querySelector(
      '.sweevit-pdp__main-image, [data-pdp-main-image], [data-showcase-main-image], .sweevit-product__image'
    );

    this.bindQuantity();
    this.bindVariants();
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

  getActivePurchaseOption() {
    return (
      Array.from(this.options).find((option) => option.classList.contains('is-active')) ||
      this.options[0]
    );
  }

  getActiveVariant() {
    return (
      Array.from(this.variantOptions).find((option) => option.classList.contains('is-active')) ||
      this.variantOptions[0]
    );
  }

  syncPrices() {
    const variant = this.getActiveVariant();
    const purchase = this.getActivePurchaseOption();
    if (!purchase) return;

    const isSubscribe = purchase.querySelector('input[type="radio"]')?.value === 'subscribe';
    const onetimePrice = variant?.dataset.variantPrice || '';
    const subscribePrice = variant?.dataset.variantSubscribePrice || '';

    if (this.displayPrice && onetimePrice) {
      this.displayPrice.textContent = onetimePrice;
    }

    if (this.subscribePrice && subscribePrice) {
      this.subscribePrice.textContent = subscribePrice;
    }

    if (this.atcPrice) {
      this.atcPrice.textContent = (isSubscribe ? subscribePrice : onetimePrice) || this.atcPrice.textContent;
    }
  }

  syncSellingPlan() {
    if (!this.sellingPlanInput) return;

    const purchase = this.getActivePurchaseOption();
    const variant = this.getActiveVariant();
    const isSubscribe = purchase?.querySelector('input[type="radio"]')?.value === 'subscribe';
    const planId = (variant?.dataset.sellingPlanId || purchase?.dataset.sellingPlanId || '').trim();

    if (isSubscribe && planId) {
      this.sellingPlanInput.name = 'selling_plan';
      this.sellingPlanInput.value = planId;
      if (purchase) purchase.dataset.sellingPlanId = planId;
    } else {
      this.sellingPlanInput.removeAttribute('name');
      this.sellingPlanInput.value = '';
    }
  }

  bindVariants() {
    if (!this.variantOptions.length) return;

    const setActive = (option) => {
      this.variantOptions.forEach((item) => {
        const isActive = item === option;
        item.classList.toggle('is-active', isActive);
        const input = item.querySelector('input[type="radio"]');
        if (input) input.checked = isActive;
      });

      if (this.variantIdInput && option.dataset.variantId) {
        this.variantIdInput.value = option.dataset.variantId;
        this.variantIdInput.disabled = false;
      }

      if (option.dataset.variantImage && this.mainImage) {
        this.mainImage.src = option.dataset.variantImage;
        if (option.dataset.variantImageSrcset) {
          this.mainImage.srcset = option.dataset.variantImageSrcset;
        }
      }

      this.syncSellingPlan();
      this.syncPrices();
    };

    this.variantOptions.forEach((option) => {
      option.addEventListener('click', () => setActive(option));
      option.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setActive(option);
        }
      });
    });

    const defaultVariant = this.getActiveVariant();
    if (defaultVariant) setActive(defaultVariant);
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

      this.syncSellingPlan();
      this.syncPrices();
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

    const defaultOption = this.getActivePurchaseOption();
    if (defaultOption) setActive(defaultOption);
  }

  bindGallery() {
    const mainImage =
      this.querySelector('.sweevit-pdp__main-image, [data-pdp-main-image], [data-showcase-main-image]') ||
      this.mainImage;
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
