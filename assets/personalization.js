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

// === Spin Wheel Popup Logic ===
(function() {
  const POPUP_KEY = 'spin_popup_done';
  const popup = document.getElementById('spin-popup-modal');
  const closeBtn = document.getElementById('spin-popup-close');
  const form = document.getElementById('spin-popup-form');
  const phoneInput = document.getElementById('spin-phone');
  const resultDiv = document.getElementById('spin-result');
  const wheelInner = document.getElementById('spin-wheel-inner');
  let spinning = false;

  // Show popup if not already spun/closed
  function shouldShowPopup() {
    return !localStorage.getItem(POPUP_KEY);
  }

  function showPopup() {
    if (popup) popup.style.display = 'flex';
  }
  function hidePopup() {
    if (popup) popup.style.display = 'none';
  }
  function setPopupDone() {
    localStorage.setItem(POPUP_KEY, '1');
  }

  // Spin animation and result
  function spinWheel() {
    if (spinning) return;
    spinning = true;
    // Random rotation for effect (always lands on 10%)
    const spins = 5;
    const deg = 36 * 1 + 360 * spins + Math.floor(Math.random()*10); // 10% section
    wheelInner.style.transform = `rotate(${deg}deg)`;
    setTimeout(() => {
      resultDiv.style.display = 'block';
      spinning = false;
    }, 2500);
  }

  // Simulate saving phone number (replace with webhook/Google Sheets/API as needed)
  function savePhoneNumber(phone) {
    fetch('https://script.google.com/macros/s/AKfycbyZRZUQMNazmJIZa_SffnpieoSd3G4-vBRgsrWTZEV87itdLCWmlcRfqkyZcPyqGKE0/exec', {
      method: 'POST',
      body: JSON.stringify({ phone }),
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Form submit
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const phone = phoneInput.value.trim();
      if (!phone.match(/^\d{10,15}$/)) {
        phoneInput.style.borderColor = 'red';
        phoneInput.focus();
        return;
      }
      phoneInput.style.borderColor = '#ccc';
      form.querySelector('button[type="submit"]').disabled = true;
      savePhoneNumber(phone);
      spinWheel();
      setPopupDone();
      setTimeout(() => {
        form.style.display = 'none';
      }, 300);
    });
  }

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      hidePopup();
      setPopupDone();
    });
  }

  // Show popup on load if needed
  window.addEventListener('DOMContentLoaded', function() {
    if (shouldShowPopup()) {
      setTimeout(showPopup, 1200); // 1.2s delay after page load
    }
  });
})();
