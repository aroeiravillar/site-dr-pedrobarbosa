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
  // TRACKING DE EVENTOS — via dataLayer (GTM)
  // ============================================
  // Empurra eventos para o dataLayer do GTM. Configure os triggers no painel
  // do GTM (GTM-PTC4KX5Q) para ouvir cada evento custom listado abaixo:
  //   - whatsapp_click   → conversão Google Ads + evento GA4
  //   - instagram_click  → evento GA4
  //   - phone_click      → evento GA4 / conversão (se aplicável)
  //   - email_click      → evento GA4
  //   - service_click    → evento GA4
  //   - blog_click       → evento GA4
  //   - scroll_depth     → evento GA4 (também há gatilho nativo no GTM)
  const trackEvent = (eventName, params = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
  };

  // 0. GCLID → WhatsApp (atribuição de cliques do Google Ads)
  // Captura o gclid (Google Ads Click ID) da URL e adiciona "[ref: GCLID]" ao
  // final da mensagem pré-preenchida de CADA botão WhatsApp.
  // Preserva o número original (MV vs Numai) e o texto original de cada botão.
  // Persiste em sessionStorage para sobreviver à navegação dentro do site.
  // Só atua se houver gclid — sem GCLID, nada muda.
  let gclid = new URLSearchParams(location.search).get('gclid');
  try {
    if (gclid) sessionStorage.setItem('gclid', gclid);
    else gclid = sessionStorage.getItem('gclid');
  } catch (e) { /* sessionStorage pode estar bloqueado (privacidade) */ }

  if (gclid) {
    document.querySelectorAll(
      'a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href*="web.whatsapp.com"]'
    ).forEach((a) => {
      try {
        const url = new URL(a.href);
        const currentText = url.searchParams.get('text') || '';
        // Guard: evita duplicar [ref:] se o script rodar mais de uma vez
        if (currentText.indexOf('[ref:') === -1) {
          url.searchParams.set('text', currentText + ' [ref: ' + gclid + ']');
          a.href = url.toString();
        }
      } catch (e) { /* href malformado, ignora este link */ }
    });
  }

  // 1. Cliques em qualquer link do WhatsApp → dispara whatsapp_click no dataLayer (GTM)
  // Usa EVENT DELEGATION no document: um único listener captura cliques em TODOS
  // os links WhatsApp — inclusive em ícones/spans filhos (ex: .whatsapp-float-item)
  // e botões que venham a ser adicionados dinamicamente. Sem risco de disparo duplo.
  // Configure no GTM (GTM-PTC4KX5Q):
  //   - Trigger: Custom Event = whatsapp_click
  //   - Tag: Google Ads Conversion Tracking (Conversion ID + Label) e/ou GA4 Event
  const isWhatsappLink = (el) => {
    if (!el || el.tagName !== 'A') return false;
    const href = (el.getAttribute('href') || '').toLowerCase();
    return href.indexOf('whatsapp') !== -1 ||
           href.indexOf('wa.me') !== -1 ||
           href.indexOf('api.whatsapp') !== -1;
  };

  document.addEventListener('click', (e) => {
    // e.target pode ser um <span>/<svg> dentro do <a> — sobe no DOM até o link
    const link = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!isWhatsappLink(link)) return;
    // NÃO chamamos preventDefault — o link abre o WhatsApp normalmente
    trackEvent('whatsapp_click', {
      event_category: 'contato',
      event_label: link.getAttribute('aria-label') || link.textContent.trim() || 'WhatsApp',
      click_url: link.getAttribute('href'),
      click_text: link.textContent.trim(),
      click_classes: link.className,
      page_path: window.location.pathname,
      page_url: window.location.href,
      page_title: document.title,
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
