/**
 * Modern Website JavaScript
 * Enhanced interactivity and animations
 */

class ModernWebsite {
  constructor() {
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupScrollAnimations();
    this.setupSmoothScrolling();
    this.setupThemeToggle();
    this.setupMobileMenu();
    this.setupParallaxEffects();
    this.setupTypingAnimation();
    this.setupCounters();
    this.setupLazyLoading();
    this.setupPerformanceMonitoring();
    this.setupAccessibility();
    this.setupErrorHandling();
    this.setupContactForm();
  }

  // Navigation functionality
  setupNavigation() {
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Sticky navigation on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }

  // Smooth scrolling for navigation links
  setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Scroll-triggered animations
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    // Observe all elements with scroll-reveal class
    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => {
      observer.observe(el);
    });
  }

  // Theme toggle functionality
  setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference, system preference, or default to 'dark'
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    body.setAttribute('data-theme', currentTheme);
    
    // Update toggle button icon on load
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.className = currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
      }
    }
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Smooth transition
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update toggle button icon
        const icon = themeToggle.querySelector('i');
        if (icon) {
          icon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
        
        // Remove transition after animation
        setTimeout(() => {
          body.style.transition = '';
        }, 300);
      });
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
      }
    });
  }

  // Mobile menu functionality
  setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
      });

      // Close menu when clicking on a link
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
        }
      });
    }
  }

  // Parallax effects
  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
  }

  // Typing animation for hero text
  setupTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const texts = typingElement.dataset.texts.split(',');
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeText() {
      const currentText = texts[textIndex];
      
      if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
      }
      
      let typeSpeed = isDeleting ? 50 : 100;
      
      if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
      }
      
      setTimeout(typeText, typeSpeed);
    }
    
    typeText();
  }

  // Animated counters
  setupCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const observerOptions = {
      threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.target);
          const duration = parseInt(counter.dataset.duration) || 2000;
          const increment = target / (duration / 16);
          let current = 0;
          
          const updateCounter = () => {
            if (current < target) {
              current += increment;
              counter.textContent = Math.floor(current);
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          };
          
          updateCounter();
          counterObserver.unobserve(counter);
        }
      });
    }, observerOptions);
    
    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  // Lazy loading for images
  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });
      
      images.forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
      });
    }
  }

  // Performance monitoring
  setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          console.log('LCP:', entry.startTime);
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          console.log('FID:', entry.processingStart - entry.startTime);
        }
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            console.log('CLS:', entry.value);
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }

  // Accessibility enhancements
  setupAccessibility() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content landmark
    const mainContent = document.querySelector('#page-wrapper');
    if (mainContent) {
      mainContent.id = 'main-content';
      mainContent.setAttribute('role', 'main');
    }

    // Enhance keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Escape key closes mobile menu
      if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
        }
      }
    });

    // Announce page changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);

    // Function to announce changes
    window.announceToScreenReader = (message) => {
      announcer.textContent = message;
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    };
  }

  // Error handling
  setupErrorHandling() {
    window.addEventListener('error', (e) => {
      console.error('JavaScript error:', e.error);
      // Could send to analytics service here
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      // Could send to analytics service here
    });
  }

  setupContactForm() {
    const contactForm = document.querySelector('.contact-form-element');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      
      // Show loading state
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitButton.disabled = true;

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Success
          submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
          submitButton.classList.remove('btn-primary');
          submitButton.classList.add('btn-success');
          contactForm.reset();
          
          // Reset after 3 seconds
          setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.classList.remove('btn-success');
            submitButton.classList.add('btn-primary');
            submitButton.disabled = false;
          }, 3000);
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        // Error state
        submitButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error - Try Again';
        submitButton.classList.remove('btn-primary');
        submitButton.classList.add('btn-danger');
        
        // Reset after 3 seconds
        setTimeout(() => {
          submitButton.innerHTML = originalText;
          submitButton.classList.remove('btn-danger');
          submitButton.classList.add('btn-primary');
          submitButton.disabled = false;
        }, 3000);
      }
    });
  }

  // Utility methods
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Project showcase functionality
class ProjectShowcase {
  constructor() {
    this.projects = [];
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    this.loadProjects();
    this.setupFilters();
    this.setupSearch();
  }

  loadProjects() {
    // This would typically load from a JSON file or API
    this.projects = [
      {
        id: 1,
        title: 'STRAWHAT Catalog',
        description: 'Public data catalog of SPT-3G AGN light curves — multi-frequency millimeter-wavelength monitoring released for the broader astronomy community.',
        technologies: ['Data Catalog', 'SPT-3G', 'AGN', 'Light Curves'],
        image: 'images/strawhat_logo.png',
        link: 'https://spt3g.ncsa.illinois.edu/datasets/spt_agn_lightcurves/',
        github: null,
        demo: null,
        category: 'research',
        imageFit: 'contain'
      },
      {
        id: 2,
        title: 'sci-runner',
        description: 'Lightweight workflow runner for scientific computing tasks — orchestrating reproducible analysis pipelines.',
        technologies: ['Python', 'Workflow', 'Open Source', 'Reproducibility'],
        image: 'images/sci-runner-logo.jpeg',
        link: 'https://johnchood2.github.io/sci-runner/',
        github: null,
        demo: null,
        category: 'research',
        imageFit: 'contain'
      },
      {
        id: 3,
        title: 'SPT-Pol AGN Monitoring',
        description: 'Millimeter wavelength monitoring of Active Galactic Nuclei using South Pole Telescope data.',
        technologies: ['Python', 'Astronomy', 'Data Analysis', 'Machine Learning'],
        image: 'images/PKS_2326_502.png',
        github: 'https://github.com/JohnChood2/spt-agn-monitoring',
        demo: null,
        category: 'research'
      },
      {
        id: 4,
        title: 'MKID Detector Development',
        description: 'Low loss microstrip materials with MKIDs for microwave applications.',
        technologies: ['Hardware', 'Physics', 'Instrumentation'],
        image: 'images/FullWafer.jpg',
        github: 'https://github.com/JohnChood2/mkid-detectors',
        demo: null,
        category: 'instrumentation'
      },
      {
        id: 5,
        title: 'Blazar Analysis Pipeline',
        description: 'Multi-wavelength analysis of Fermi bright blazars for orphan flare detection.',
        technologies: ['Python', 'Astronomy', 'Data Visualization'],
        image: 'images/aas1954-388.jpg',
        github: 'https://github.com/JohnChood2/blazar-analysis',
        demo: null,
        category: 'research'
      }
    ];
  }

  setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        // Get filter value
        this.currentFilter = button.dataset.filter;
        this.renderProjects();
      });
    });
  }

  setupSearch() {
    const searchInput = document.querySelector('.project-search');
    
    if (searchInput) {
      searchInput.addEventListener('input', ModernWebsite.debounce((e) => {
        this.searchProjects(e.target.value);
      }, 300));
    }
  }

  searchProjects(query) {
    const filteredProjects = this.projects.filter(project => {
      const matchesFilter = this.currentFilter === 'all' || project.category === this.currentFilter;
      const matchesSearch = project.title.toLowerCase().includes(query.toLowerCase()) ||
                           project.description.toLowerCase().includes(query.toLowerCase()) ||
                           project.technologies.some(tech => tech.toLowerCase().includes(query.toLowerCase()));
      
      return matchesFilter && matchesSearch;
    });
    
    this.renderProjects(filteredProjects);
  }

  renderProjects(projects = null) {
    const container = document.querySelector('.projects-grid');
    if (!container) return;
    
    const projectsToRender = projects || this.getFilteredProjects();
    
    container.innerHTML = projectsToRender.map(project => {
      const imgClass = project.imageFit === 'contain' ? 'project-img img-contain' : 'project-img';
      const imageMarkup = `<img src="${project.image}" alt="${project.title}" loading="lazy" class="${imgClass}">`;
      const imageWrapped = project.link
        ? `<a href="${project.link}" target="_blank" rel="noopener" class="project-image-link" aria-label="${project.title}">${imageMarkup}</a>`
        : imageMarkup;
      const titleWrapped = project.link
        ? `<a href="${project.link}" target="_blank" rel="noopener" class="project-title-link"><h3 class="project-title">${project.title}</h3></a>`
        : `<h3 class="project-title">${project.title}</h3>`;
      return `
      <div class="project-card card scroll-reveal">
        <div class="project-image">
          ${imageWrapped}
          <div class="project-overlay">
            <div class="project-links">
              ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                <i class="fas fa-external-link-alt"></i> Visit Site
              </a>` : ''}
              ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">
                <i class="fab fa-github"></i> Code
              </a>` : ''}
              ${project.demo ? `<a href="${project.demo}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                <i class="fas fa-external-link-alt"></i> Demo
              </a>` : ''}
            </div>
          </div>
        </div>
        <div class="project-content">
          ${titleWrapped}
          <p class="project-description">${project.description}</p>
          <div class="project-technologies">
            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
        </div>
      </div>
    `;}).join('');
  }

  getFilteredProjects() {
    if (this.currentFilter === 'all') {
      return this.projects;
    }
    return this.projects.filter(project => project.category === this.currentFilter);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ModernWebsite();
  
  // Initialize project showcase only if the grid exists AND is empty
  // (allows index.html to ship static, hand-curated project cards
  // without the showcase overwriting them via innerHTML).
  const projectsGrid = document.querySelector('.projects-grid');
  if (projectsGrid && projectsGrid.children.length === 0) {
    new ProjectShowcase();
  }
});

// Export for use in other modules
window.ModernWebsite = ModernWebsite;
window.ProjectShowcase = ProjectShowcase;
