// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.header-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        nav.classList.remove('open');
      });
    });
  }

  // Reveal on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // Testimonials carousel
  const carousel = document.querySelector('.testimonials-track');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    let current = 0;
    let timer;

    const goTo = (i) => {
      current = (i + slides.length) % slides.length;
      carousel.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
    };

    dots.forEach((dot, idx) => dot.addEventListener('click', () => { goTo(idx); reset(); }));

    const reset = () => {
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), 6000);
    };
    reset();
  }

  // ============================================
  // GOOGLE ADS / ANALYTICS — TRACKING DE EVENTOS
  // ============================================
  // Helper para garantir que o gtag está disponível
  const trackEvent = (eventName, params = {}) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  };

  // 1. Cliques em qualquer link do WhatsApp (apenas evento GA4 para análise)
  // OBS: A conversão Google Ads é disparada via gtag_report_conversion (onclick nos links HTML)
  document.querySelectorAll('a[href*="whatsapp.com"], a[href*="wa.me"]').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('whatsapp_click', {
        event_category: 'contato',
        event_label: link.getAttribute('aria-label') || 'WhatsApp',
        page_path: window.location.pathname,
      });
    });
  });

  // 2. Cliques no Instagram
  document.querySelectorAll('a[href*="instagram.com"]').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('instagram_click', {
        event_category: 'social',
        event_label: 'Instagram',
        page_path: window.location.pathname,
      });
    });
  });

  // 3. Cliques em links de telefone (tel:)
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('phone_click', {
        event_category: 'contato',
        event_label: link.getAttribute('href'),
      });
    });
  });

  // 4. Cliques em links de e-mail (mailto:)
  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('email_click', {
        event_category: 'contato',
        event_label: link.getAttribute('href'),
      });
    });
  });

  // 5. Cliques nos cards de serviço da home
  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.querySelector('h3')?.textContent || 'Serviço';
      trackEvent('service_click', {
        event_category: 'navegacao',
        event_label: title,
      });
    });
  });

  // 6. Cliques nos cards do blog
  document.querySelectorAll('.blog-card').forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.querySelector('h3, .blog-card-title')?.textContent || 'Artigo';
      trackEvent('blog_click', {
        event_category: 'navegacao',
        event_label: title,
      });
    });
  });

  // 7. Tracking de scroll (engajamento)
  const scrollMarks = { 25: false, 50: false, 75: false, 100: false };
  window.addEventListener('scroll', () => {
    const pct = Math.round(((window.scrollY + window.innerHeight) / document.body.scrollHeight) * 100);
    [25, 50, 75, 100].forEach((mark) => {
      if (!scrollMarks[mark] && pct >= mark) {
        scrollMarks[mark] = true;
        trackEvent('scroll_depth', {
          event_category: 'engagement',
          event_label: `${mark}%`,
          value: mark,
        });
      }
    });
  }, { passive: true });
});
