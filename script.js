/* ==========================================================================
   BMPS Landing Page - Core Interaction Script (Vanilla JavaScript)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. Custom Cursor & Background Glow System
  // ==========================================================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorGlow = document.getElementById('cursorGlow');
  const bgMouseGlow = document.getElementById('bgMouseGlow');
  
  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let glowX = 0, glowY = 0;
  
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  if (!isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Lag-follow movement loop using requestAnimationFrame
    const updateCursorLoop = () => {
      // Lerp (Linear Interpolation) formula: Current += (Target - Current) * Speed
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;
      
      glowX += (mouseX - glowX) * 0.15;
      glowY += (mouseY - glowY) * 0.15;
      
      cursorDot.style.left = `${dotX}px`;
      cursorDot.style.top = `${dotY}px`;
      
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
      
      // Update large background gradient tracking the cursor
      bgMouseGlow.style.left = `${mouseX}px`;
      bgMouseGlow.style.top = `${mouseY}px`;
      
      requestAnimationFrame(updateCursorLoop);
    };
    requestAnimationFrame(updateCursorLoop);

    // Interactive Hover States
    const interactiveSelectors = 'a, button, select, input, .grid-card, .floating-badge';
    const interactiveElements = document.querySelectorAll(interactiveSelectors);

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  } else {
    // Hide cursor elements on touch devices
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorGlow) cursorGlow.style.display = 'none';
    if (bgMouseGlow) bgMouseGlow.style.display = 'none';
  }

  // ==========================================================================
  // 2. Sticky Navbar Trigger
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  const scrollThreshold = 60;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('sticky');
    } else {
      navbar.classList.remove('sticky');
    }
  });

  // ==========================================================================
  // 3. Scroll Reveal System (Intersection Observer)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.grid-card, .text-reveal, .bottom-card-info');
  
  // Set initial styles dynamically to support users without JS
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================================================
  // 4. Statistics Counting Animation
  // ==========================================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const countUp = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    const isDollar = el.textContent.includes('$');
    const isBillion = el.textContent.includes('B');
    const suffix = el.textContent.includes('+') ? '+' : '';
    
    const duration = 2000; // 2 seconds animation
    let startTime = null;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad formula
      const easedProgress = progress * (2 - progress);
      const currentCount = Math.floor(easedProgress * target);
      
      let displayValue = currentCount;
      if (isDollar) displayValue = '$' + displayValue;
      if (isBillion) displayValue = displayValue + 'B';
      
      el.textContent = displayValue + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        let finalValue = target;
        if (isDollar) finalValue = '$' + finalValue;
        if (isBillion) finalValue = finalValue + 'B';
        el.textContent = finalValue + suffix;
      }
    };
    
    requestAnimationFrame(animate);
  };

  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => statObserver.observe(num));

  // ==========================================================================
  // 5. Magnetic Hover Pull effect
  // ==========================================================================
  if (!isTouchDevice) {
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(el => {
      const strength = parseInt(el.getAttribute('data-strength')) || 15;
      
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        
        // Translate element relative to hover center
        el.style.transform = `translate(${deltaX / (rect.width / strength)}px, ${deltaY / (rect.height / strength)}px)`;
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // ==========================================================================
  // 6. Interactive 3D Card Tilting Parallax
  // ==========================================================================
  if (!isTouchDevice) {
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
      // We skip the hero card since the vault handles its own internal rotation
      if (card.classList.contains('hero-vault-card')) return;
      
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const tiltX = -((y - centerY) / centerY) * 8; // Max 8 degrees tilt
        const tiltY = ((x - centerX) / centerX) * 8;
        
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        card.style.boxShadow = 'var(--shadow-hover)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        card.style.boxShadow = 'var(--shadow)';
      });
    });
  }

  // ==========================================================================
  // 7. Interactive 3D Vault Rotate System
  // ==========================================================================
  const vaultCard = document.querySelector('.hero-vault-card');
  const vaultBox = document.getElementById('vaultBox');
  
  if (vaultCard && vaultBox && !isTouchDevice) {
    vaultCard.addEventListener('mousemove', (e) => {
      const rect = vaultCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width * 0.75; // Skew center closer to the right vault zone
      const centerY = rect.height / 2;
      
      // Calculate rotation angles (resting coordinates are rotateX(-10deg) and rotateY(15deg))
      const rotateX = -((y - centerY) / centerY) * 20 - 10;
      const rotateY = ((x - centerX) / centerX) * 20 + 15;
      
      vaultBox.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    vaultCard.addEventListener('mouseleave', () => {
      vaultBox.style.transform = 'rotateX(-10deg) rotateY(15deg)';
    });
  }

  // ==========================================================================
  // 8. Form Validation & Simulation Interaction
  // ==========================================================================
  const tokenizeForm = document.getElementById('tokenizeForm');
  const btnTokenize = document.getElementById('btnTokenize');
  const vaultCoreGlow = document.querySelector('.vault-core-glow');
  
  if (tokenizeForm) {
    tokenizeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Disable form inputs
      const inputs = tokenizeForm.querySelectorAll('input, select');
      inputs.forEach(input => input.disabled = true);
      
      // Loading button text
      const originalBtnHTML = btnTokenize.innerHTML;
      btnTokenize.disabled = true;
      btnTokenize.innerHTML = `
        <span>Tokenizing Asset...</span>
        <span class="btn-icon animate-spin">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
        </span>
      `;
      
      // Amplify vault glow animation
      if (vaultCoreGlow) {
        vaultCoreGlow.style.background = 'radial-gradient(circle, var(--accent) 0%, #FF7A00 80%)';
        vaultCoreGlow.style.filter = 'blur(15px)';
        vaultCoreGlow.style.animation = 'pulse-core 0.5s infinite alternate';
      }
      
      // Simulate Web3 Blockchain mint delay
      setTimeout(() => {
        // Reset Vault Core glow
        if (vaultCoreGlow) {
          vaultCoreGlow.style.background = 'radial-gradient(circle, var(--accent) 0%, rgba(255, 122, 0, 0.4) 40%, rgba(255,122,0,0) 70%)';
          vaultCoreGlow.style.filter = 'blur(10px)';
          vaultCoreGlow.style.animation = 'pulse-core 2.5s infinite ease-in-out';
        }
        
        // Show Success status on Card
        const cardNode = tokenizeForm.parentNode;
        const successMessage = document.createElement('div');
        successMessage.className = 'tokenize-success-overlay';
        successMessage.style.cssText = `
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(15, 15, 16, 0.95);
          color: var(--white);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 40px; text-align: center;
          z-index: 20; border-radius: var(--border-radius);
          opacity: 0; transition: opacity 0.5s ease-out;
        `;
        
        const randomTx = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
        successMessage.innerHTML = `
          <div style="background: var(--primary); border-radius: 50%; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; box-shadow: 0 0 20px var(--primary);">
            <svg viewBox="0 0 24 24" fill="none" stroke="#0F0F10" stroke-width="3" width="32" height="32">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3 style="font-family: var(--font-display); font-size: 24px; margin-bottom: 12px;">Asset Successfully Tokenized</h3>
          <p style="font-size: 13px; color: #A3A3A3; margin-bottom: 24px; line-height: 1.5; max-width: 90%;">
            Your asset has been validated and tokenized into programmatic smart contracts on the Robinhood Chain.
          </p>
          <div style="background: rgba(255,255,255,0.05); padding: 12px 18px; border-radius: 12px; font-family: monospace; font-size: 11px; color: var(--accent); margin-bottom: 24px; width: 100%; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
            TX: ${randomTx}
          </div>
          <button class="btn-secondary" id="btnSuccessReset" style="padding: 12px 24px; font-size: 14px;">Done</button>
        `;
        
        cardNode.appendChild(successMessage);
        
        // Trigger opacity fade
        setTimeout(() => successMessage.style.opacity = '1', 50);
        
        // Attach listener to reset form
        document.getElementById('btnSuccessReset').addEventListener('click', () => {
          successMessage.style.opacity = '0';
          setTimeout(() => {
            successMessage.remove();
            inputs.forEach(input => {
              input.disabled = false;
              if (input.tagName === 'INPUT') input.value = '';
              if (input.tagName === 'SELECT') input.selectedIndex = 0;
            });
            btnTokenize.disabled = false;
            btnTokenize.innerHTML = originalBtnHTML;
          }, 500);
        });
        
      }, 2500);
    });
  }

  // Add keyframe animation for spinner in JS success flow if not in style.css
  const spinStyle = document.createElement('style');
  spinStyle.innerHTML = `
    @keyframes spin-loader {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin svg {
      animation: spin-loader 1.2s linear infinite;
    }
  `;
  document.head.appendChild(spinStyle);
});
