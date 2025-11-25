// Mobile Menu Functionality and Responsive Features
document.addEventListener('DOMContentLoaded', function() {
    // Form validation and loading states
    const cropForm = document.getElementById('cropForm');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const btnText = analyzeBtn?.querySelector('.btn-text');
    const btnLoading = analyzeBtn?.querySelector('.btn-loading');
    
    if (cropForm && analyzeBtn) {
        cropForm.addEventListener('submit', function(e) {
            // Show loading state
            analyzeBtn.disabled = true;
            if (btnText && btnLoading) {
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline';
            }
            
            // Validate form before submission
            const inputs = cropForm.querySelectorAll('input[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                input.classList.remove('error');
                const value = parseFloat(input.value);
                const min = parseFloat(input.min);
                const max = parseFloat(input.max);
                
                if (!input.value || isNaN(value) || value < min || value > max) {
                    input.classList.add('error');
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                // Reset loading state
                analyzeBtn.disabled = false;
                if (btnText && btnLoading) {
                    btnText.style.display = 'inline';
                    btnLoading.style.display = 'none';
                }
                alert('Please check all input values and ensure they are within the valid ranges.');
            }
        });
    }
    // Mobile menu toggle functionality
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on nav links
        const navLinkItems = navLinks.querySelectorAll('a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuToggle.contains(event.target) && !navLinks.contains(event.target)) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // Enhanced navbar scroll effect for modern design
    const navbar = document.querySelector('.navbar-modern');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Enhanced smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize comparison bars from data attributes
    initializeComparisonBars();
    
    // Form validation improvements for mobile
    const form = document.querySelector('.modern-form');
    if (form) {
        const inputs = form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            // Touch-friendly validation feedback
            input.addEventListener('blur', function() {
                if (this.value.trim() === '') {
                    this.style.borderColor = '#dc3545';
                    this.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
                } else {
                    this.style.borderColor = '#28a745';
                    this.style.boxShadow = '0 0 0 3px rgba(40, 167, 69, 0.1)';
                }
            });
            
            input.addEventListener('input', function() {
                if (this.style.borderColor === 'rgb(220, 53, 69)') {
                    this.style.borderColor = '#e0e0e0';
                    this.style.boxShadow = '';
                }
            });
        });
        
        // Enhanced form submission for mobile
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('.btn-analyze');
            if (submitBtn) {
                submitBtn.innerHTML = '<span class="loading">⏳</span> Analyzing...';
                submitBtn.disabled = true;
                
                // Show loading feedback
                showNotification('Processing your soil analysis...', 'info');
            }
        });
    }
    
    // Modal enhancements for mobile
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        // Close modal on backdrop click
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                modals.forEach(modal => closeModal(modal));
            }
        });
        
        // Touch handling for mobile
        let touchStartY = 0;
        modal.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
        });
        
        modal.addEventListener('touchend', function(e) {
            const touchEndY = e.changedTouches[0].clientY;
            const modalContent = modal.querySelector('.modal-content');
            
            // Close modal if swiped down significantly
            if (touchEndY - touchStartY > 150 && e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Intersection Observer for responsive animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card-modern, .result-card-modern, .form-card-modern');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Auto scroll to results after form submission (mobile-friendly)
    setTimeout(() => {
        const resultsSection = document.getElementById('results');
        if (resultsSection && window.location.hash === '#results') {
            // Smooth scroll with mobile considerations
            const yOffset = window.innerWidth <= 768 ? -60 : -80;
            const y = resultsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, 100);
});

// Enhanced notification system for mobile
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; margin-left: 10px; cursor: pointer; font-size: 18px;">×</button>
    `;
    
    // Responsive styles
    const isMobile = window.innerWidth <= 768;
    Object.assign(notification.style, {
        position: 'fixed',
        top: isMobile ? '70px' : '20px',
        right: isMobile ? '10px' : '20px',
        left: isMobile ? '10px' : 'auto',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease-out',
        maxWidth: isMobile ? 'none' : '300px',
        fontSize: isMobile ? '14px' : '16px'
    });
    
    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Sample data function
function loadSampleData() {
  try {
    document.getElementById('Nitrogen').value = 90;
    document.getElementById('Phosphorus').value = 42;
    document.getElementById('Potassium').value = 43;
    document.getElementById('Temperature').value = 20.8;
    document.getElementById('Humidity').value = 82;
    document.getElementById('Ph').value = 6.5;
    document.getElementById('Rainfall').value = 202;
    
    if (typeof showFeedback === 'function') {
      showFeedback('Sample data loaded successfully!', 'success');
    }
  } catch (error) {
    console.error('Error loading sample data:', error);
  }
}

// Modal functions for nutrient management
function showRecovery(item) {
  const modal = document.getElementById('recoveryModal');
  const modalBody = document.getElementById('modalBody');
  const modalTitle = document.getElementById('modalTitle');
  
  if (modal && modalBody && modalTitle) {
    const isHigh = item.toLowerCase().includes('high');
    const isLow = item.toLowerCase().includes('low');
    
    // Extract parameter name from the item
    let parameter = '';
    let recoveryContent = '';
    
    if (item.toLowerCase().includes('nitrogen') || item.toLowerCase().includes(' n ')) {
      parameter = 'Nitrogen (N)';
      modalTitle.textContent = isHigh ? '🔺 Nitrogen Management Plan' : '🔻 Nitrogen Recovery Plan';
      
      if (isLow) {
        recoveryContent = `
          <div class="recovery-header">
            <h3>🧪 Nitrogen Deficiency Recovery</h3>
            <p><strong>Issue:</strong> ${item}</p>
          </div>
          <div class="recovery-solutions">
            <div class="solution-item">
              <h4>🌾 Immediate Action:</h4>
              <ul>
                <li><strong>Apply Urea (46% N)</strong> – 50–70 kg/acre split into two doses</li>
                <li><strong>Compost application</strong> to slowly increase nitrogen</li>
                <li><strong>Legume cover crops</strong> (pea, cowpea, beans)</li>
              </ul>
            </div>
            <div class="solution-item">
              <h4>📅 Timeline:</h4>
              <p>First dose: Apply immediately<br>Second dose: After 3-4 weeks</p>
            </div>
          </div>
        `;
      } else if (isHigh) {
        recoveryContent = `
          <div class="recovery-header">
            <h3>🧪 Nitrogen Excess Management</h3>
            <p><strong>Issue:</strong> ${item}</p>
          </div>
          <div class="recovery-solutions">
            <div class="solution-item">
              <h4>🚫 Stop Immediately:</h4>
              <ul>
                <li><strong>Stop nitrogen fertilizers</strong> immediately</li>
                <li>Add <strong>carbon-rich organic matter</strong> (dry straw, sawdust) to absorb excess N</li>
              </ul>
            </div>
            <div class="solution-item">
              <h4>💧 Water Management:</h4>
              <ul>
                <li>Increase <strong>irrigation frequency</strong> to flush nitrate (avoid in sandy soil)</li>
                <li>Plant <strong>nitrogen-heavy feeders</strong> → spinach, maize, sorghum</li>
              </ul>
            </div>
          </div>
        `;
      }
    } else if (item.toLowerCase().includes('phosphorus') || item.toLowerCase().includes(' p ')) {
      parameter = 'Phosphorus (P)';
      modalTitle.textContent = isHigh ? '🔺 Phosphorus Management Plan' : '🔻 Phosphorus Recovery Plan';
      
      if (isLow) {
        recoveryContent = `
          <div class="recovery-header">
            <h3>🧪 Phosphorus Deficiency Recovery</h3>
            <p><strong>Issue:</strong> ${item}</p>
          </div>
          <div class="recovery-solutions">
            <div class="solution-item">
              <h4>💪 Immediate Action:</h4>
              <ul>
                <li><strong>Apply DAP (18-46-0)</strong> – 50 kg/acre</li>
                <li><strong>Bone meal</strong> or <strong>rock phosphate</strong> for long-term supply</li>
              </ul>
            </div>
            <div class="solution-item">
              <h4>🌱 Soil Optimization:</h4>
              <p>Maintain pH <strong>6.0–7.0</strong> for better P availability</p>
            </div>
          </div>
        `;
      } else if (isHigh) {
        recoveryContent = `
          <div class="recovery-header">
            <h3>🧪 Phosphorus Excess Management</h3>
            <p><strong>Issue:</strong> ${item}</p>
          </div>
          <div class="recovery-solutions">
            <div class="solution-item">
              <h4>🚫 Stop P Fertilizers:</h4>
              <ul>
                <li>Stop P fertilizers immediately</li>
                <li>Apply <strong>zinc sulphate</strong> or <strong>iron chelates</strong> — excess P locks these nutrients</li>
              </ul>
            </div>
            <div class="solution-item">
              <h4>🌿 Organic Approach:</h4>
              <p>Use <strong>organic compost</strong>, not chemical P fertilizers</p>
            </div>
          </div>
        `;
      }
    } else if (item.toLowerCase().includes('potassium') || item.toLowerCase().includes(' k ')) {
      parameter = 'Potassium (K)';
      modalTitle.textContent = isHigh ? '🔺 Potassium Management Plan' : '🔻 Potassium Recovery Plan';
      
      if (isLow) {
        recoveryContent = `
          <div class="recovery-header">
            <h3>🧪 Potassium Deficiency Recovery</h3>
            <p><strong>Issue:</strong> ${item}</p>
          </div>
          <div class="recovery-solutions">
            <div class="solution-item">
              <h4>⚡ Quick Fix:</h4>
              <ul>
                <li><strong>Apply Muriate of Potash (MOP)</strong> – 30–40 kg/acre</li>
                <li><strong>Wood ash</strong> (if available) increases K quickly</li>
              </ul>
            </div>
          </div>
        `;
      } else if (isHigh) {
        recoveryContent = `
          <div class="recovery-header">
            <h3>🧪 Potassium Excess Management</h3>
            <p><strong>Issue:</strong> ${item}</p>
          </div>
          <div class="recovery-solutions">
            <div class="solution-item">
              <h4>⚖️ Balance Nutrients:</h4>
              <ul>
                <li>Avoid K fertilizers immediately</li>
                <li>Increase <strong>magnesium</strong> (apply MgSO₄ 10–15 kg/acre)</li>
                <li>Increase <strong>calcium</strong> (gypsum 20–30 kg/acre)</li>
              </ul>
            </div>
            <div class="solution-item">
              <h4>⚠️ Important:</h4>
              <p>Excess K usually causes Mg/Ca deficiency — fix that first</p>
            </div>
          </div>
        `;
      }
    } else if (item.toLowerCase().includes('temperature')) {
      parameter = 'Temperature';
      modalTitle.textContent = isHigh ? '🔺 Temperature Management Plan' : '🔻 Temperature Recovery Plan';
      
      if (isLow) {
        recoveryContent = `
          <div class="recovery-header">
            <h3>🌡️ Low Temperature Recovery</h3>
            <p><strong>Issue:</strong> ${item}</p>
          </div>
          <div class="recovery-solutions">
            <div class="solution-item">
              <h4>🛡️ Protection Methods:</h4>
              <ul>
                <li>Use <strong>mulch</strong> around crops</li>
                <li>Protective <strong>plastic tunnels</strong> or <strong>greenhouse sheet</strong></li>
                <li>Choose <strong>cold-tolerant varieties</strong></li>
              </ul>
            </div>
          </div>
        `;
      } else if (isHigh) {
        recoveryContent = `
          <div class="recovery-header">
            <h3>🌡️ High Temperature Management</h3>
            <p><strong>Issue:</strong> ${item}</p>
          </div>
          <div class="recovery-solutions">
            <div class="solution-item">
              <h4>🌤️ Cooling Solutions:</h4>
              <ul>
                <li><strong>Shade nets</strong> (35–50%)</li>
                <li>Increase irrigation frequency by 20–30%</li>
                <li><strong>Mulching</strong> to cool soil</li>
                <li><strong>Drip irrigation</strong> instead of flood</li>
              </ul>
            </div>
          </div>
        `;
      }
    } else if (item.toLowerCase().includes('humidity')) {
      parameter = 'Humidity';
      modalTitle.textContent = isHigh ? '🔺 Humidity Management Plan' : '🔻 Humidity Recovery Plan';
      
      if (isLow) {
        recoveryContent = `
          <div class="recovery-header">
            <h3>💨 Low Humidity Recovery</h3>
            <p><strong>Issue:</strong> ${item}</p>
          </div>
          <div class="recovery-solutions">
            <div class="solution-item">
              <h4>💧 Moisture Enhancement:</h4>
              <ul>
                <li><strong>Mist irrigation/sprinklers</strong></li>
                <li>Increase plant density slightly</li>
                <li>Add organic matter to retain moisture</li>
              </ul>
            </div>
          </div>
        `;
      } else if (isHigh) {
        recoveryContent = `
          <div class="recovery-header">
            <h3>💨 High Humidity Management</h3>
            <p><strong>Issue:</strong> ${item}</p>
          </div>
          <div class="recovery-solutions">
            <div class="solution-item">
              <h4>🌬️ Air Flow & Disease Prevention:</h4>
              <ul>
                <li>Improve air flow → row spacing + pruning</li>
                <li>Use <strong>fungicides</strong> (humidity = fungal risk)</li>
                <li><strong>Drip irrigation</strong> instead of overhead</li>
                <li><strong>Morning watering only</strong></li>
              </ul>
            </div>
          </div>
        `;
      }
    } else if (item.toLowerCase().includes('ph')) {
      parameter = 'Soil pH';
      modalTitle.textContent = isHigh ? '🔺 pH Management Plan' : '🔻 pH Recovery Plan';
      
      if (isLow) {
        recoveryContent = `
          <div class="recovery-header">
            <h3>🧪 Acidic Soil Recovery (pH < 6)</h3>
            <p><strong>Issue:</strong> ${item}</p>
          </div>
          <div class="recovery-solutions">
            <div class="solution-item">
              <h4>🏔️ Alkalizing Solutions:</h4>
              <ul>
                <li>Apply <strong>agricultural lime</strong> – 100–200 kg/acre</li>
                <li>Add <strong>wood ash</strong></li>
                <li>Avoid ammonium-based fertilizers</li>
              </ul>
            </div>
          </div>
        `;
      } else if (isHigh) {
        recoveryContent = `
          <div class="recovery-header">
            <h3>🧪 Alkaline Soil Management (pH > 7)</h3>
            <p><strong>Issue:</strong> ${item}</p>
          </div>
          <div class="recovery-solutions">
            <div class="solution-item">
              <h4>⬇️ Acidifying Solutions:</h4>
              <ul>
                <li>Add <strong>elemental sulfur</strong> – 20–40 kg/acre</li>
                <li>Apply <strong>ferrous sulfate</strong> to bring pH down</li>
                <li>Add organic matter (compost lowers pH slowly)</li>
              </ul>
            </div>
          </div>
        `;
      }
    } else if (item.toLowerCase().includes('rainfall')) {
      parameter = 'Rainfall/Water';
      modalTitle.textContent = isHigh ? '🔺 Water Management Plan' : '🔻 Water Recovery Plan';
      
      if (isLow) {
        recoveryContent = `
          <div class="recovery-header">
            <h3>🌧️ Drought Management</h3>
            <p><strong>Issue:</strong> ${item}</p>
          </div>
          <div class="recovery-solutions">
            <div class="solution-item">
              <h4>💧 Water Conservation:</h4>
              <ul>
                <li><strong>Drip irrigation</strong></li>
                <li><strong>Mulching</strong> 3–4 cm thick</li>
                <li>Water during <strong>early morning</strong></li>
                <li>Add <strong>biochar</strong> for moisture retention</li>
              </ul>
            </div>
          </div>
        `;
      } else if (isHigh) {
        recoveryContent = `
          <div class="recovery-header">
            <h3>🌧️ Waterlogging Management</h3>
            <p><strong>Issue:</strong> ${item}</p>
          </div>
          <div class="recovery-solutions">
            <div class="solution-item">
              <h4>🏞️ Drainage Solutions:</h4>
              <ul>
                <li>Create <strong>drainage channels</strong> immediately</li>
                <li><strong>Raised beds</strong></li>
                <li>Use <strong>fungicides</strong> (excess rain causes root rot)</li>
                <li>Mix sand into clay-heavy soil</li>
              </ul>
            </div>
          </div>
        `;
      }
    }
    
    // Default fallback
    if (!recoveryContent) {
      recoveryContent = `
        <div class="recovery-header">
          <h3>🌱 General Recovery Plan</h3>
          <p><strong>Issue:</strong> ${item}</p>
        </div>
        <div class="recovery-solutions">
          <div class="solution-item">
            <h4>📋 Recommended Actions:</h4>
            <ul>
              <li>Adjust fertilizer application rates based on soil test</li>
              <li>Monitor soil and water conditions regularly</li>
              <li>Consult with local agricultural experts</li>
              <li>Consider comprehensive soil testing for precise recommendations</li>
            </ul>
          </div>
        </div>
      `;
    }
    
    modalBody.innerHTML = recoveryContent;
    modal.style.display = 'block';
    
    // Add styling for the modal content
    const style = document.createElement('style');
    style.textContent = `
      .recovery-header {
        background: linear-gradient(135deg, #2d5a27, #4a7c59);
        color: white;
        padding: 20px;
        border-radius: 8px 8px 0 0;
        margin: -20px -20px 20px -20px;
      }
      .recovery-header h3 {
        margin: 0 0 10px 0;
        font-size: 1.3em;
      }
      .recovery-solutions {
        padding: 0;
      }
      .solution-item {
        background: #f8f9fa;
        border-left: 4px solid #28a745;
        padding: 15px;
        margin: 15px 0;
        border-radius: 0 8px 8px 0;
      }
      .solution-item h4 {
        color: #2d5a27;
        margin: 0 0 10px 0;
        font-size: 1.1em;
      }
      .solution-item ul {
        margin: 10px 0;
        padding-left: 20px;
      }
      .solution-item li {
        margin: 8px 0;
        line-height: 1.5;
      }
      .solution-item strong {
        color: #1e4620;
        font-weight: 600;
      }
    `;
    document.head.appendChild(style);
  }
}

function closeRecoveryModal() {
  const modal = document.getElementById('recoveryModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Update hero section with prediction result
function updateHeroSection(cropName, confidence = "High") {
  const heroCard = document.getElementById('hero-prediction-card');
  const heroCropIcon = document.getElementById('hero-crop-icon');
  const heroCropName = document.getElementById('hero-crop-name');
  const heroConfidence = document.getElementById('hero-confidence');
  const heroProgress = document.getElementById('hero-progress');

  if (heroCard && heroCropIcon && heroCropName) {
    // Get crop icon from crop data
    const cropMapping = {
      'rice': '🌾', 'wheat': '🌾', 'cotton': '🌱', 'sugarcane': '🎋', 
      'maize': '🌽', 'jute': '🌿', 'coconut': '🥥', 'papaya': '🫐',
      'orange': '🍊', 'apple': '🍎', 'mango': '🥭', 'banana': '🍌',
      'grapes': '🍇', 'watermelon': '🍉', 'muskmelon': '🍈',
      'pomegranate': '🫐', 'lentil': '🫘', 'chickpea': '🫛',
      'kidneybeans': '🫘', 'mothbeans': '🫘', 'pigeonpeas': '🫛',
      'blackgram': '🫘', 'mungbean': '🫛', 'coffee': '☕'
    };

    const icon = cropMapping[cropName.toLowerCase()] || '🌾';

    heroCropIcon.textContent = icon;
    heroCropName.textContent = cropName.charAt(0).toUpperCase() + cropName.slice(1);
    heroConfidence.textContent = confidence + " Confidence";
    
    if (heroProgress) {
      heroProgress.style.width = "95%";
    }

    // Add animation effect
    heroCard.style.transform = "scale(1.05)";
    setTimeout(() => {
      heroCard.style.transform = "scale(1)";
    }, 300);
  }
}

// Auto-update hero section if crop result exists on page load
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on a page with results
  const resultElement = document.querySelector('.recommended-crop-modern');
  if (resultElement) {
    const cropName = resultElement.textContent.trim();
    if (cropName) {
      updateHeroSection(cropName, "High");
    }
  }

  // Initialize other features
  const form = document.querySelector('.modern-form');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const btnLoading = document.getElementById('btnLoading');

  if (form && submitBtn) {
    form.addEventListener('submit', function(e) {
      // Show loading state
      if (btnText && btnLoading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        submitBtn.disabled = true;
      }
      
      // After form submission, scroll to results section
      setTimeout(() => {
        const resultsSection = document.getElementById('results');
        if (resultsSection) {
          resultsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 1000);
      
      // Let the form submit normally to Flask
    });
  }

  initializeSmoothScrolling();
  initializeInputAnimations();
  addAnimations();
});

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Input animations and validation
function initializeInputAnimations() {
  const inputs = document.querySelectorAll('input[type="number"]');
  
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 8px 16px rgba(45, 90, 39, 0.15)';
    });
    
    input.addEventListener('blur', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '';
    });
    
    input.addEventListener('input', function() {
      validateInput(this);
    });
  });
}

function validateInput(input) {
  const value = parseFloat(input.value);
  const min = parseFloat(input.min);
  const max = parseFloat(input.max);
  
  if (value < min || value > max) {
    input.style.borderColor = '#dc3545';
    input.style.background = '#fff5f5';
  } else {
    input.style.borderColor = '#28a745';
    input.style.background = '#f0fff4';
  }
}

// Feedback messages
function showFeedback(message, type = 'success') {
  // Remove existing feedback
  const existing = document.querySelector('.feedback-message');
  if (existing) existing.remove();
  
  const feedback = document.createElement('div');
  feedback.className = 'feedback-message';
  feedback.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 24px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    ${type === 'success' ? 'background: #28a745;' : 'background: #dc3545;'}
  `;
  feedback.textContent = message;
  
  document.body.appendChild(feedback);
  
  setTimeout(() => {
    feedback.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => feedback.remove(), 300);
  }, 3000);
}

// Mouse tracking for floating elements
document.addEventListener('mousemove', function(e) {
  const floatingElements = document.querySelectorAll('.float-element');
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;
  
  floatingElements.forEach((element, index) => {
    const speed = (index + 1) * 0.5;
    const x = (mouseX - 0.5) * speed * 10;
    const y = (mouseY - 0.5) * speed * 10;
    element.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.5}deg)`;
  });
});

// Close modal when clicking outside
document.addEventListener('click', function(e) {
  const modal = document.getElementById('recoveryModal');
  if (modal && e.target === modal) {
    closeRecoveryModal();
  }
});

// Add CSS animations to document head
function addAnimations() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// Initialize comparison bars from data attributes
function initializeComparisonBars() {
  const barElements = document.querySelectorAll('.bar-user[data-width]');
  barElements.forEach(bar => {
    const width = bar.getAttribute('data-width');
    if (width) {
      bar.style.width = width + '%';
    }
  });
}

// Scroll to top functionality
function addScrollToTop() {
  const scrollBtn = document.createElement('button');
  scrollBtn.innerHTML = '↑';
  scrollBtn.className = 'scroll-to-top';
  scrollBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 50%;
    background: var(--primary-dark);
    color: white;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  `;
  
  document.body.appendChild(scrollBtn);
  
  // Show/hide based on scroll position
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollBtn.style.opacity = '1';
      scrollBtn.style.visibility = 'visible';
    } else {
      scrollBtn.style.opacity = '0';
      scrollBtn.style.visibility = 'hidden';
    }
  });
  
  // Smooth scroll to top
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
// ============================================
// CROP DISEASE DETECTION FUNCTIONS
// ============================================

// Handle file selection and preview
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    // Display file name
    const fileNameDisplay = document.getElementById('fileName');
    fileNameDisplay.textContent = `📁 ${file.name}`;
    fileNameDisplay.style.display = 'block';
    
    // Show image preview
    const reader = new FileReader();
    reader.onload = function(e) {
      const previewContainer = document.getElementById('imagePreview');
      const previewImg = document.getElementById('previewImg');
      previewImg.src = e.target.result;
      previewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

// Predict crop disease
async function predictDisease() {
  const imageInput = document.getElementById('imageInput');
  const resultDiv = document.getElementById('diseaseResult');
  const detectBtn = document.getElementById('detectBtn');
  
  if (!imageInput.files || !imageInput.files[0]) {
    showResult(resultDiv, '⚠️ Please upload an image first!', 'result-warning');
    return;
  }
  
  // Show loading state
  detectBtn.classList.add('loading');
  detectBtn.disabled = true;
  resultDiv.style.display = 'none';
  
  const formData = new FormData();
  formData.append('image', imageInput.files[0]);
  
  try {
    const response = await fetch('/predict_disease', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.error) {
      showResult(resultDiv, `❌ Error: ${data.error}`, 'result-error');
    } else {
      const resultHTML = `
        <h3>✅ Disease Detection Results</h3>
        <p><strong>🔬 Detected Disease:</strong> ${data.disease || 'Unknown'}</p>
        <p><strong>📊 Confidence:</strong> ${data.confidence || 'N/A'}</p>
        ${data.treatment ? `<p><strong>💊 Treatment:</strong> ${data.treatment}</p>` : ''}
      `;
      showResult(resultDiv, resultHTML, 'result-success');
    }
  } catch (error) {
    showResult(resultDiv, `❌ Error: ${error.message}`, 'result-error');
  } finally {
    detectBtn.classList.remove('loading');
    detectBtn.disabled = false;
  }
}

// ============================================
// MARKET PRICE PREDICTION FUNCTIONS
// ============================================

// Predict market price
async function predictPrice() {
  const cropId = document.getElementById('cropId').value;
  const stateId = document.getElementById('stateId').value;
  const month = document.getElementById('month').value;
  const rainfall = document.getElementById('rainfall').value;
  const temperature = document.getElementById('temperature').value;
  const resultDiv = document.getElementById('priceResult');
  const predictBtn = document.getElementById('predictBtn');
  
  // Validation
  if (!cropId || !stateId || !month || !rainfall || !temperature) {
    showResult(resultDiv, '⚠️ Please fill in all fields!', 'result-warning');
    return;
  }
  
  // Show loading state
  predictBtn.classList.add('loading');
  predictBtn.disabled = true;
  resultDiv.style.display = 'none';
  
  const data = {
    crop_id: parseInt(cropId),
    state_id: parseInt(stateId),
    month: parseInt(month),
    rainfall: parseFloat(rainfall),
    temperature: parseFloat(temperature)
  };
  
  try {
    const response = await fetch('/predict_price', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (result.error) {
      showResult(resultDiv, `❌ Error: ${result.error}`, 'result-error');
    } else {
      const resultHTML = `
        <h3>💰 Price Prediction Results</h3>
        <p><strong>📈 Predicted Price:</strong> ₹${result.predicted_price || 'N/A'}/quintal</p>
        <p><strong>🌾 Crop:</strong> ${getCropName(cropId)}</p>
        <p><strong>📍 State:</strong> ${getStateName(stateId)}</p>
        <p><strong>📅 Month:</strong> ${getMonthName(month)}</p>
        ${result.market_trend ? `<p><strong>📊 Market Trend:</strong> ${result.market_trend}</p>` : ''}
      `;
      showResult(resultDiv, resultHTML, 'result-success');
    }
  } catch (error) {
    showResult(resultDiv, `❌ Error: ${error.message}`, 'result-error');
  } finally {
    predictBtn.classList.remove('loading');
    predictBtn.disabled = false;
  }
}

// Load sample price data
function loadSamplePriceData() {
  document.getElementById('cropId').value = '1';
  document.getElementById('stateId').value = '5';
  document.getElementById('month').value = '7';
  document.getElementById('rainfall').value = '250';
  document.getElementById('temperature').value = '28.5';
  
  showNotification('✅ Sample data loaded successfully!', 'success');
}

// Helper function to show results
function showResult(element, content, className) {
  element.innerHTML = content;
  element.className = `result-display-modern ${className}`;
  element.style.display = 'block';
  
  // Smooth scroll to result
  element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Helper functions for names
function getCropName(id) {
  const crops = {
    1: 'Rice', 2: 'Wheat', 3: 'Maize', 4: 'Cotton',
    5: 'Sugarcane', 6: 'Pulses', 7: 'Vegetables', 8: 'Fruits'
  };
  return crops[id] || 'Unknown';
}

function getStateName(id) {
  const states = {
    1: 'Andhra Pradesh', 2: 'Karnataka', 3: 'Kerala', 4: 'Tamil Nadu',
    5: 'Maharashtra', 6: 'Gujarat', 7: 'Rajasthan', 8: 'Madhya Pradesh',
    9: 'Uttar Pradesh', 10: 'Bihar', 11: 'West Bengal', 12: 'Punjab', 13: 'Haryana'
  };
  return states[id] || 'Unknown';
}

function getMonthName(id) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[parseInt(id) - 1] || 'Unknown';
}

// Initialize all features
document.addEventListener('DOMContentLoaded', function() {
  addScrollToTop();
});