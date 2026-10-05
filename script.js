const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

toggle.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!isOpen));
  toggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  nav.classList.toggle('open', !isOpen);
});

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
  });
});

// Add enough identical ticker groups to keep the moving strip covered on wide screens.
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack) {
  const tickerSeed = tickerTrack.querySelector('.ticker-group');
  const fillTicker = () => {
    tickerTrack.querySelectorAll('[data-ticker-clone]').forEach(clone => clone.remove());
    const groupWidth = tickerSeed.getBoundingClientRect().width;
    const viewportWidth = tickerTrack.parentElement.getBoundingClientRect().width;
    if (!groupWidth) return;
    tickerTrack.style.setProperty('--ticker-distance', `${groupWidth}px`);
    const groupCount = Math.ceil(viewportWidth / groupWidth) + 1;
    for (let index = 1; index < groupCount; index += 1) {
      const clone = tickerSeed.cloneNode(true);
      clone.dataset.tickerClone = '';
      clone.setAttribute('aria-hidden', 'true');
      tickerTrack.appendChild(clone);
    }
  };
  fillTicker();
  let tickerResizeFrame;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(tickerResizeFrame);
    tickerResizeFrame = requestAnimationFrame(fillTicker);
  });
}

document.querySelector('#year').textContent = new Date().getFullYear();

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const message = [
      `Hello Moolaris,`,
      ``,
      `My name is ${data.get('name')}.`,
      `I am reaching out as a ${data.get('audience')}.`,
      ``,
      `${data.get('message')}`,
      ``,
      `You can reply to me at ${data.get('email')}.`
    ].join('\n');
    const status = form.querySelector('.form-status');
    try {
      await navigator.clipboard.writeText(message);
      status.textContent = 'Your message is ready and copied. Paste it into your preferred contact channel.';
    } catch {
      status.textContent = message;
    }
  });
}

  document.querySelectorAll('a[href]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    // Keep in-page anchors such as Home's Explore link out of the page-exit transition.
    if (link.getAttribute('href').startsWith('#')) return;
    const destination = new URL(link.href, window.location.href);
    // The Home navigation is a deliberate reset point for the guide conversation.
    if (destination.origin === window.location.origin && destination.pathname.split('/').pop() === 'index.html') {
      try { sessionStorage.removeItem('moolaris-guide-context-v1'); } catch { /* Continue if browser storage is unavailable. */ }
      window.dispatchEvent(new Event('moolaris-guide-home-reset'));
    }
    if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname || !/\.html$/.test(destination.pathname)) return;
    event.preventDefault();
    document.body.classList.add('is-leaving');
    window.setTimeout(() => { window.location.href = destination.href; }, 170);
  });
});

// Shared, browser-only guided helper. No AI service is configured for this static site.
(() => {
  const storageKey = 'moolaris-guide-context-v1';
  const pageName = location.pathname.split('/').pop() || 'index.html';
  const pageContext = {
    'index.html': 'You’re on Home. I can help you find the right Moolaris page.',
    'about.html': 'You’re on About. I can explain what Moolaris does today and its future direction.',
    'training.html': 'You’re on Training. I can guide you to current training areas and project support.',
    'solutions.html': 'You’re on Solutions. I can help with company training, college workshops, or student support.',
    'research.html': 'You’re on R&D. Moolaris’s own-product development and manufacturing are long-term goals.',
    'products.html': 'You’re on Products. This page describes a future product direction; no products are currently for sale.',
    'projects.html': 'You’re on Projects & Internships. I can help with project support and internship enquiries.',
    'contact.html': 'You’re on Contact. I can point you to the enquiry form.'
  }[pageName] || 'I can help you find the right Moolaris page.';
  const pageTitle = {
    'index.html': 'Home', 'about.html': 'About Moolaris', 'training.html': 'Training',
    'solutions.html': 'Solutions', 'research.html': 'R&D', 'products.html': 'Products',
    'projects.html': 'Projects & Internships', 'contact.html': 'Contact'
  }[pageName] || 'Moolaris';

  const topicInfo = {
    training: {
      title: 'Technical training', audience: 'Student', page: 'training.html', link: 'Explore Training',
      text: 'Moolaris currently offers technical training in Embedded Systems, IoT, AIoT, and PCB design. Ask through an enquiry for current schedules, program details, and capacity.',
      options: ['Final-year project support', 'Internships']
    },
    company: {
      title: 'Company training', audience: 'Company', page: 'solutions.html', link: 'Company Training',
      text: 'Moolaris currently provides training for companies. Share your team’s topics or learning needs; format, schedule, and capacity are confirmed through an enquiry.',
      options: ['Training topics', 'Contact Moolaris']
    },
    topics: {
      title: 'Training topics', audience: 'Company', page: 'training.html', link: 'See Training Areas',
      text: 'Current technical training areas are Embedded Systems, IoT, AIoT, and PCB design. Ask about the right topic, schedule, and capacity for your team.',
      options: ['Company training', 'Contact Moolaris']
    },
    projects: {
      title: 'Final-year project support', audience: 'Student', page: 'projects.html', link: 'Projects & Internships',
      text: 'Moolaris supports final-year college projects and helps students explore prototype development. Project scope, guidance, schedules, and available capacity are confirmed by enquiry; a specific outcome isn’t guaranteed.',
      options: ['Internships', 'Technical training']
    },
    internships: {
      title: 'Internships', audience: 'Student', page: 'projects.html', link: 'Ask About Internships',
      text: 'Moolaris offers internship opportunities related to Embedded Systems, IoT, AIoT, and PCB design. Current availability, schedules, and project fit must be confirmed; an enquiry does not guarantee selection, a certificate, or a job.',
      options: ['Technical training', 'Final-year project support']
    },
    workshops: {
      title: 'College workshops', audience: 'College', page: 'solutions.html', link: 'College Support',
      text: 'Moolaris currently conducts college workshops and supports final-year projects. Ask about suitable topics, format, schedule, and capacity.',
      options: ['Faculty training enquiry', 'Final-year project support']
    },
    faculty: {
      title: 'Faculty training enquiry', audience: 'College', page: 'contact.html#contact', link: 'Ask Moolaris',
      text: 'I don’t have confirmed details about faculty training. You can ask Moolaris whether a faculty-focused session fits its current scope when discussing a college workshop.',
      options: ['College workshops', 'Contact Moolaris']
    },
    products: {
      title: 'Future product direction', audience: 'Visitor', page: 'products.html', link: 'Product Pipeline',
      text: 'Developing and manufacturing Moolaris’s own products is a long-term future goal. No Moolaris products are currently offered for sale, and no operating manufacturing unit is claimed.',
      options: ['R&D direction', 'Share a problem']
    },
    research: {
      title: 'R&D direction', audience: 'Visitor', page: 'research.html', link: 'Explore R&D',
      text: 'Moolaris’s own-product research, development, and manufacturing are long-term goals. The R&D page explains this intended future direction; it isn’t a claim of current product development or manufacturing capacity.',
      options: ['Future product direction', 'Share a problem']
    },
    collaboration: {
      title: 'Potential collaboration', audience: 'Potential collaborator', page: 'contact.html#contact', link: 'Contact Moolaris',
      text: 'Use the Contact page to describe the collaboration you have in mind. Moolaris can confirm whether it fits current activities and capacity.',
      options: ['About Moolaris', 'Contact Moolaris']
    },
    about: {
      title: 'About Moolaris', audience: 'Visitor', page: 'about.html', link: 'About Moolaris',
      text: 'Moolaris currently focuses on technical training, college project support, workshops, prototype exploration, internships, and company training. Its own-product development and manufacturing are future goals.',
      options: ['Technical training', 'Future product direction']
    },
    solutions: {
      title: 'Solutions and support', audience: 'Visitor', page: 'solutions.html', link: 'Solutions',
      text: 'The Solutions page guides companies to training, colleges to workshops and project support, and students to learning and internship enquiries.',
      options: ['Company training', 'College workshops']
    },
    contact: {
      title: 'Contact Moolaris', audience: 'Visitor', page: 'contact.html#contact', link: 'Open Contact',
      text: 'On the Contact page, choose email or WhatsApp to open a message draft addressed to Moolaris. Review and send it in that app.',
      options: []
    }
  };

  const choicesByAudience = {
    Student: ['Technical training', 'Final-year project support', 'Internships'],
    College: ['College workshops', 'Final-year project support', 'Internships', 'Faculty training enquiry'],
    Company: ['Company training', 'Training topics'],
    'Potential collaborator': ['Potential collaboration'],
    'Future products': ['Future product direction', 'R&D direction', 'Share a problem']
  };
  const labelsToTopics = {
    'Technical training': 'training', 'Final-year project support': 'projects', Internships: 'internships',
    'College workshops': 'workshops', 'Faculty training enquiry': 'faculty', 'Company training': 'company',
    'Training topics': 'topics', 'Potential collaboration': 'collaboration', 'Future product direction': 'products',
    'R&D direction': 'research', 'Share a problem': 'research', 'About Moolaris': 'about',
    'Solutions and support': 'solutions', 'Contact Moolaris': 'contact'
  };

  let state = { audience: '', topic: '', openAfterNavigation: false };
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey) || '{}');
    if (saved && typeof saved === 'object') {
      state.audience = typeof saved.audience === 'string' ? saved.audience : '';
      state.topic = typeof saved.topic === 'string' && topicInfo[saved.topic] ? saved.topic : '';
      state.openAfterNavigation = saved.openAfterNavigation === true;
    }
  } catch { /* Continue without cross-page context when browser storage is unavailable. */ }

  const persist = () => {
    try {
      if (state.audience || state.topic || state.openAfterNavigation) sessionStorage.setItem(storageKey, JSON.stringify(state));
      else sessionStorage.removeItem(storageKey);
    } catch { /* The helper remains usable when storage is unavailable. */ }
  };

  const guideMascot = '<svg viewBox="0 0 48 48" role="img" aria-label="Moolaris robot guide"><path d="M24 8V4" stroke="#293630" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="4" r="3.5" fill="#a8c85d"/><path d="M9 20H5m38 0h-4" stroke="#718957" stroke-width="2.5" stroke-linecap="round"/><rect x="9" y="12" width="30" height="27" rx="10" fill="#f7f5ed" stroke="#293630" stroke-width="2.5"/><circle cx="17" cy="23" r="2.4" fill="#293630"/><circle cx="31" cy="23" r="2.4" fill="#293630"/><path d="M19 31h10" stroke="#718957" stroke-width="2.5" stroke-linecap="round"/><path d="M17 39v3m14-3v3" stroke="#293630" stroke-width="2.5" stroke-linecap="round"/><path d="m35 9 1.3-2.5L39 5l-2.7-1.5L35 1l-1.3 2.5L31 5l2.7 1.5L35 9Z" fill="#a8c85d"/></svg>';
  const guideFigure = '<svg viewBox="0 0 128 160" aria-hidden="true" focusable="false"><ellipse cx="64" cy="151" rx="30" ry="5" fill="#293630" opacity=".13"/><g class="moolaris-guide-figure"><path d="M51 111v24m26-24v24" fill="none" stroke="#293630" stroke-width="9" stroke-linecap="round"/><path d="M51 135h-8m34 0h8" fill="none" stroke="#293630" stroke-width="8" stroke-linecap="round"/><path d="M39 86 27 103" fill="none" stroke="#293630" stroke-width="9" stroke-linecap="round"/><circle cx="25" cy="106" r="6" fill="#a8c85d" stroke="#293630" stroke-width="2"/><g class="moolaris-guide-wave-arm"><path d="M88 86 105 68" fill="none" stroke="#293630" stroke-width="9" stroke-linecap="round"/><circle cx="108" cy="64" r="7" fill="#a8c85d" stroke="#293630" stroke-width="2"/><path d="M106 57v-5m7 9 4-3m-14-2-3-4" fill="none" stroke="#293630" stroke-width="2" stroke-linecap="round"/></g><rect x="39" y="75" width="50" height="43" rx="14" fill="#c6d3a8" stroke="#293630" stroke-width="3"/><rect x="52" y="87" width="24" height="18" rx="5" fill="#f7f5ed" stroke="#718957" stroke-width="2"/><path d="m64 89-5 8h5l-1 6 6-9h-5l2-5Z" fill="#718957"/><path d="M64 19v-7" stroke="#293630" stroke-width="3" stroke-linecap="round"/><circle class="moolaris-guide-antenna" cx="64" cy="10" r="5" fill="#a8c85d" stroke="#293630" stroke-width="2"/><path d="M32 37h-5v14h5m64-14h5v14h-5" fill="#c6d3a8" stroke="#293630" stroke-width="3" stroke-linejoin="round"/><rect x="32" y="20" width="64" height="56" rx="19" fill="#293630" stroke="#1d2924" stroke-width="3"/><rect x="39" y="28" width="50" height="39" rx="13" fill="#f7f5ed"/><circle cx="53" cy="45" r="3.5" fill="#293630"/><circle cx="75" cy="45" r="3.5" fill="#293630"/><path d="M54 56q10 8 20 0" fill="none" stroke="#718957" stroke-width="2.5" stroke-linecap="round"/><path d="M43 72h42" stroke="#a8c85d" stroke-width="2" stroke-linecap="round" opacity=".85"/></g></svg>';

  document.body.insertAdjacentHTML('beforeend', `
    <div class="moolaris-chat-widget">
      <button class="moolaris-chat-launcher" type="button" aria-label="Open Moolaris guided helper" aria-expanded="false" aria-controls="moolaris-chat-panel"><span class="moolaris-chat-speech" id="moolaris-chat-speech" aria-hidden="true">Hi, I’m your guide to Moolaris. <i>✳</i></span><span class="moolaris-chat-standing-bot" aria-hidden="true">${guideFigure}</span><span class="moolaris-chat-launcher-cta"><span class="moolaris-chat-mascot" aria-hidden="true">${guideMascot}</span><span class="moolaris-chat-launcher-copy"><b>Ask Moolaris</b><small>Quick Moolaris guidance</small></span><span class="moolaris-chat-launcher-mark" aria-hidden="true">↗</span></span></button>
      <section class="moolaris-chat-panel" id="moolaris-chat-panel" role="dialog" aria-labelledby="moolaris-chat-title" aria-modal="false" hidden>
        <header class="moolaris-chat-header"><div class="moolaris-chat-identity"><span class="moolaris-chat-avatar" aria-hidden="true">${guideMascot}</span><div><span class="moolaris-chat-kicker">MOOLARIS / GUIDE</span><h2 id="moolaris-chat-title">Moolaris Guide</h2><span class="moolaris-chat-mode">Guided support</span></div></div><div class="moolaris-chat-controls"><button type="button" data-chat-action="clear" aria-label="Clear conversation">Clear</button><button type="button" data-chat-action="new" aria-label="Start a new conversation">New</button><button type="button" data-chat-action="minimize" aria-label="Minimize chat">−</button></div></header>
        <div class="moolaris-chat-context" id="moolaris-chat-context"></div>
        <div class="moolaris-chat-log" id="moolaris-chat-log" role="log" aria-live="polite" aria-relevant="additions text"></div>
        <form class="moolaris-chat-form" id="moolaris-chat-form"><label class="moolaris-chat-sr-only" for="moolaris-chat-input">Type a question or topic</label><textarea id="moolaris-chat-input" rows="1" maxlength="400" placeholder="Type a topic or question…"></textarea><button type="submit" aria-label="Check question">Go</button></form>
        <p class="moolaris-chat-note">This guided helper doesn’t use AI. Only your visitor type and selected topic are saved in this browser tab to keep context as you browse. Typed messages aren’t sent or saved. Please don’t share confidential designs, passwords, or sensitive technical details.</p>
      </section>
    </div>`);

  const launcher = document.querySelector('.moolaris-chat-launcher');
  const chatWidget = launcher.closest('.moolaris-chat-widget');
  const launcherSpeech = document.querySelector('#moolaris-chat-speech');
  const panel = document.querySelector('#moolaris-chat-panel');
  const log = document.querySelector('#moolaris-chat-log');
  const contextNote = document.querySelector('#moolaris-chat-context');
  const form = document.querySelector('#moolaris-chat-form');
  const input = document.querySelector('#moolaris-chat-input');

  const compactMobileLauncher = () => {
    if (window.matchMedia('(max-width: 540px)').matches) chatWidget.classList.add('is-compact');
  };
  window.setTimeout(() => {
    chatWidget.classList.add('is-visible');
    if (window.scrollY > 80) compactMobileLauncher();
    window.setTimeout(compactMobileLauncher, 7000);
  }, 1000);
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) compactMobileLauncher();
  }, { passive: true });

  const addMessage = (speaker, text, extra = {}) => {
    const item = document.createElement('article');
    item.className = `moolaris-chat-message is-${speaker}`;
    const bubble = document.createElement('div');
    bubble.className = 'moolaris-chat-bubble';
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    bubble.appendChild(paragraph);
    if (extra.link) {
      const link = document.createElement('a');
      link.className = 'moolaris-chat-link';
      link.href = extra.link.href;
      link.textContent = `${extra.link.label} ↗`;
      link.addEventListener('click', () => {
        const destination = new URL(link.href, location.href);
        if (destination.origin === location.origin && destination.pathname !== location.pathname && /\.html$/i.test(destination.pathname)) {
          state.openAfterNavigation = true;
          persist();
        }
      });
      bubble.appendChild(link);
    }
    if (extra.options && extra.options.length) {
      const group = document.createElement('div');
      group.className = 'moolaris-chat-quick-replies';
      extra.options.forEach(label => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = label;
        button.addEventListener('click', () => {
          if (Object.prototype.hasOwnProperty.call(choicesByAudience, label)) selectAudience(label);
          else selectTopic(label);
        });
        group.appendChild(button);
      });
      bubble.appendChild(group);
    }
    item.appendChild(bubble);
    log.appendChild(item);
    item.scrollIntoView({ block: 'nearest' });
  };

  const currentPageLink = () => {
    const pageLinks = {
      'index.html': ['index.html', 'Home'], 'about.html': ['about.html', 'About Moolaris'],
      'training.html': ['training.html', 'Training'], 'solutions.html': ['solutions.html', 'Solutions'],
      'research.html': ['research.html', 'R&D'], 'products.html': ['products.html', 'Products'],
      'projects.html': ['projects.html', 'Projects & Internships'], 'contact.html': ['contact.html#contact', 'Contact']
    };
    const [href, label] = pageLinks[pageName] || pageLinks['index.html'];
    return { href, label };
  };

  const dayGreeting = () => {
    const hour = new Date().getHours();
    return hour < 12 ? 'good morning' : hour < 17 ? 'good afternoon' : 'good evening';
  };

  const setLauncherSpeech = message => {
    const sparkle = document.createElement('i');
    sparkle.textContent = '✳';
    launcherSpeech.replaceChildren(document.createTextNode(`${message} `), sparkle);
    launcher.setAttribute('aria-label', `Open Moolaris Guide. ${message}`);
  };

  const renderWelcome = (returning = false, arrivedFromGuide = false) => {
    contextNote.textContent = pageContext;
    if (arrivedFromGuide && (state.topic || state.audience)) {
      const interest = state.topic && topicInfo[state.topic]
        ? topicInfo[state.topic].title.toLowerCase()
        : `${state.audience.toLowerCase()} support`;
      addMessage('assistant', `Hi again, ${dayGreeting()}! I hope you’re on the right page for ${interest}. What else would you like to find?`, {
        options: state.audience && choicesByAudience[state.audience]
          ? [...choicesByAudience[state.audience], 'Finish conversation']
          : ['Technical training', 'Final-year project support', 'Internships', 'Company training', 'Finish conversation']
      });
      return;
    }
    if (returning && state.topic && topicInfo[state.topic]) {
      const info = topicInfo[state.topic];
      addMessage('assistant', `Hi again, ${dayGreeting()}! I’ve kept your ${info.audience.toLowerCase()} interest in ${info.title.toLowerCase()} for this browser tab. What else would you like to find?`, {
        link: { href: info.page, label: info.link }, options: [...(info.options.length ? info.options : ['About Moolaris', 'Contact Moolaris']), 'Finish conversation']
      });
      return;
    }
    if (returning && state.audience) {
      addMessage('assistant', `Hi again, ${dayGreeting()}! I’ve kept that you’re here as a ${state.audience.toLowerCase()}. What would you like to explore?`, {
        options: [...(choicesByAudience[state.audience] || ['About Moolaris', 'Contact Moolaris']), 'Finish conversation']
      });
      return;
    }
    addMessage('assistant', `Hi, ${dayGreeting()}! What brings you to Moolaris today?`, {
      options: ['Student', 'College', 'Company', 'Potential collaborator', 'Future products']
    });
  };

  const selectTopic = (label, showVisitorChoice = true) => {
    if (label === 'Start over' || label === 'Start a new conversation') { startNew(); return; }
    if (label === 'Finish conversation') { finishConversation(); return; }
    const key = labelsToTopics[label];
    const info = topicInfo[key];
    if (!info) {
      addMessage('assistant', 'I don’t have a confirmed answer for that. Contact Moolaris to ask about your specific need.', {
        link: { href: 'contact.html#contact', label: 'Contact Moolaris' }, options: ['Finish conversation']
      });
      return;
    }
    state.topic = key;
    state.audience = info.audience;
    persist();
    if (showVisitorChoice) addMessage('visitor', label);
    addMessage('assistant', info.text, {
      link: { href: info.page, label: info.link },
      options: [...(info.options.length ? info.options : ['About Moolaris', 'Contact Moolaris']), 'Finish conversation']
    });
    input.focus({ preventScroll: true });
  };

  const selectAudience = audience => {
    state.audience = audience;
    state.topic = '';
    persist();
    const options = choicesByAudience[audience] || ['About Moolaris', 'Contact Moolaris'];
    addMessage('visitor', audience);
    addMessage('assistant', `Thanks. What would you like to know about ${audience === 'Future products' ? 'Moolaris’s future product direction' : audience.toLowerCase() + ' support'}?`, { options: [...options, 'Finish conversation'] });
  };

  const startNew = () => {
    state = { audience: '', topic: '', openAfterNavigation: false };
    persist();
    log.replaceChildren();
    renderWelcome(false);
  };

  const finishConversation = () => {
    state = { audience: '', topic: '', openAfterNavigation: false };
    persist();
    addMessage('assistant', 'I hope this helped you find the right Moolaris page. Have a nice day!', {
      options: ['Start a new conversation']
    });
  };

  window.addEventListener('moolaris-guide-home-reset', () => {
    startNew();
    setLauncherSpeech('Hi, I’m your guide to Moolaris.');
  });

  document.querySelectorAll('[data-chat-action]').forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.chatAction === 'minimize') closePanel();
      if (button.dataset.chatAction === 'clear') {
        state = { audience: '', topic: '', openAfterNavigation: false };
        persist();
        log.replaceChildren();
        contextNote.textContent = 'Conversation cleared. Nothing typed into the chat is saved.';
        addMessage('assistant', 'Your conversation context has been cleared. Choose a path to start again.', {
          options: ['Student', 'College', 'Company', 'Potential collaborator', 'Future products', 'Finish conversation']
        });
      }
      if (button.dataset.chatAction === 'new') startNew();
    });
  });

  launcher.addEventListener('click', () => {
    const opening = panel.hidden;
    panel.hidden = !opening;
    launcher.setAttribute('aria-expanded', String(opening));
    if (opening) {
      if (!log.childElementCount) renderWelcome(Boolean(state.audience || state.topic));
      input.focus({ preventScroll: true });
    }
  });

  function closePanel() {
    panel.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus({ preventScroll: true });
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) closePanel();
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    addMessage('visitor', query);
    input.value = '';
    const lower = query.toLowerCase().replace(/[’‘]/g, "'").replace(/[^\p{L}\p{N}\s&+-]/gu, ' ').replace(/\s+/g, ' ').trim();
    let topic = '';
    if (/faculty/.test(lower)) topic = 'Faculty training enquiry';
    else if (/intern(?:ship)?s?|placement|job/.test(lower)) topic = 'Internships';
    else if (/workshop|college|university/.test(lower)) topic = 'College workshops';
    else if (/final\s*[- ]?\s*year|capstone|project|prototype|project idea|what can i (make|build|develop)/.test(lower)) topic = 'Final-year project support';
    else if (/company|corporate|team|employee|staff training/.test(lower)) topic = 'Company training';
    else if (/embedded|\biot\b|aiot|iiot|pcb|plc|automation|training|course|learn/.test(lower)) topic = 'Technical training';
    else if (/\br&d\b|\bresearch\b|\bproducts?\b|manufactur|buy|sale/.test(lower)) topic = 'Future product direction';
    else if (/collaborat|partner/.test(lower)) topic = 'Potential collaboration';
    else if (/about|moolaris/.test(lower)) topic = 'About Moolaris';
    if (topic) {
      selectTopic(topic, false);
      return;
    }
    addMessage('assistant', 'I may not recognize every way a question is phrased in this guided helper. I can guide you on training, final-year projects, internships, college workshops, company training, or Moolaris’s future product direction. Choose a topic below, or use the Contact page to open an email or WhatsApp draft.', {
      link: { href: 'contact.html#contact', label: 'Contact Moolaris' },
      options: ['Technical training', 'Final-year project support', 'Internships', 'Company training', 'Future product direction', 'Finish conversation']
    });
  });

  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  if (state.openAfterNavigation) {
    state.openAfterNavigation = false;
    persist();
    const interest = state.topic && topicInfo[state.topic]
      ? topicInfo[state.topic].title.toLowerCase()
      : state.audience ? `${state.audience.toLowerCase()} support` : 'your Moolaris enquiry';
    setLauncherSpeech(`You’re on ${pageTitle}. I hope you’re on the right page for ${interest}. Have a nice day!`);
  }
})();
