class Personalization {
  constructor() {
    this.cartDrawer = document.querySelector('cart-drawer');
    this.codPaymentMethods = document.querySelectorAll('.payment-method[data-payment-method="cod"]');
    
    if (this.cartDrawer) {
      this.init();
    }
  }

  init() {
    // Check if cart has personalized items
    this.checkPersonalizedItems();
    
    // Listen for cart updates
    document.addEventListener('cart:updated', this.checkPersonalizedItems.bind(this));
  }

  checkPersonalizedItems() {
    const hasPersonalizedItems = this.cartDrawer.hasAttribute('data-no-cod');
    this.toggleCodPaymentMethods(!hasPersonalizedItems);
  }

  toggleCodPaymentMethods(enable) {
    this.codPaymentMethods.forEach(method => {
      if (enable) {
        method.removeAttribute('disabled');
        method.style.opacity = '1';
        method.style.pointerEvents = 'auto';
      } else {
        method.setAttribute('disabled', 'disabled');
        method.style.opacity = '0.5';
        method.style.pointerEvents = 'none';
      }
    });
  }
}

// Initialize the personalization functionality
if (!window.personalization) {
  window.personalization = new Personalization();
}
