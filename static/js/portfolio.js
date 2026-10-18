/* ==========================================================================
   Aniket Deenanath Singh — Portfolio Interactive Logic & Enhancements
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Toast Notification Utility
  // --------------------------------------------------------------------------
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'info', duration = 3200) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast-msg toast-${type}`;

    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'warning') iconClass = 'fa-triangle-exclamation';
    if (type === 'error') iconClass = 'fa-circle-exclamation';

    toast.innerHTML = `
      <i class="fas ${iconClass} toast-icon"></i>
      <span class="toast-text">${message}</span>
      <button class="toast-close" type="button" aria-label="Dismiss">&times;</button>
    `;

    toastContainer.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    const dismiss = () => {
      toast.classList.add('toast-hiding');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 260);
    };

    if (closeBtn) closeBtn.addEventListener('click', dismiss);
    setTimeout(dismiss, duration);
  }

  // --------------------------------------------------------------------------
  // 2. Theme Toggle (Dark default, persisted in localStorage)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const rootEl = document.documentElement;

  const savedTheme = localStorage.getItem('aniket_portfolio_theme') || 'dark';
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      toggleTheme();
    });
  }

  function setTheme(theme) {
    rootEl.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  function toggleTheme() {
    const current = rootEl.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('aniket_portfolio_theme', next);
    showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`, 'info', 2000);
  }

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Menu Toggle
  // --------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      mobileMenuBtn.innerHTML = isOpen
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. Dynamic Role Typewriter Effect
  // --------------------------------------------------------------------------
  const roleEl = document.getElementById('dynamicRole');
  const roles = [
    'SWE @ Google (Play Store ML)',
    'Large-Scale Personalization & RecSys',
    'Scalable Distributed Systems & Applied ML',
    'Deep Learning & Computer Vision Research'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeRole() {
    if (!roleEl) return;
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
      roleEl.textContent = currentRole.substring(0, charIndex);
    } else {
      charIndex++;
      roleEl.textContent = currentRole.substring(0, charIndex);
    }

    let delay = isDeleting ? 35 : 65;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 350;
    }

    setTimeout(typeRole, delay);
  }
  typeRole();

  // --------------------------------------------------------------------------
  // 5. Developer Profile Card Multi-Tab Switching
  // --------------------------------------------------------------------------
  const terminalTabs = document.querySelectorAll('.terminal-tab');
  const terminalPanes = document.querySelectorAll('.terminal-tab-pane');
  const terminalTitle = document.getElementById('terminalTitle');

  const tabTitles = {
    profile: 'aniket@google-mtv:~/profile.json',
    cli: 'aniket@google-mtv:~/interactive.sh'
  };

  terminalTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      switchTerminalTab(target);
    });
  });

  function switchTerminalTab(target) {
    terminalTabs.forEach((t) => {
      const isActive = t.getAttribute('data-tab') === target;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    terminalPanes.forEach((pane) => {
      const isTarget = pane.id === `pane${target.charAt(0).toUpperCase() + target.slice(1)}`;
      pane.classList.toggle('active', isTarget);
      pane.style.display = isTarget ? 'block' : 'none';
    });

    if (terminalTitle && tabTitles[target]) {
      terminalTitle.textContent = tabTitles[target];
    }

    if (target === 'cli') {
      const cliInput = document.getElementById('cliInput');
      if (cliInput) setTimeout(() => cliInput.focus(), 100);
    }
  }

  // --------------------------------------------------------------------------
  // 6. Live Hero Mini CLI Terminal
  // --------------------------------------------------------------------------
  const cliForm = document.getElementById('cliForm');
  const cliInput = document.getElementById('cliInput');
  const cliLog = document.getElementById('cliLog');

  const cliCommands = {
    help: () => `
Available commands:
  • <span class="cli-cmd">whoami</span>       : View Aniket's background & current role
  • <span class="cli-cmd">skills</span>       : List core specializations and technical stack
  • <span class="cli-cmd">google</span>       : Read about Google Play ML & Workspace experience
  • <span class="cli-cmd">projects</span>     : Preview featured engineering projects
  • <span class="cli-cmd">office-hours</span> : Open the 1:1 mentorship booking modal
  • <span class="cli-cmd">resume</span>       : Download / view official PDF resume
  • <span class="cli-cmd">clear</span>        : Clear the terminal display`,

    whoami: () => `
<strong class="cli-accent">Aniket Singh</strong>
Software Engineer (AI/ML) at Google in Mountain View, CA.
Specializing in Google Play Store Apps Personalization & Recommendation Systems.
MS in Computer Engineering from Stony Brook University (GPA: 3.87/4.00).`,

    skills: () => `
<strong class="cli-accent">Core Stack &amp; Specializations:</strong>
• ML / RecSys: Two-Tower Models, Multi-Task Ranking, TensorFlow, PyTorch, Keras, scikit-learn
• Languages: Python, C++, Java, TypeScript, JavaScript, SQL, Swift
• Systems &amp; Vision: OpenCV, Distributed Pipelines, Docker, Linux, Flask, REST APIs`,

    google: () => `
<strong class="cli-accent">Google Experience:</strong>
• <strong>Full-Time (2026–Pres)</strong>: SWE (AI/ML) @ Google Play — Large-scale personalization and candidate ranking models.
• <strong>SWE Intern (Summer 2025)</strong>: Google Workspace (NYC) — Timeline infrastructure and multi-select collaboration for Google Vids, Sheets & Slides.`,

    projects: () => `
<strong class="cli-accent">Featured Projects:</strong>
1. <strong>Digital Marketing Simulator</strong>: Flask + Angular + scikit-learn funnel prediction (94% accuracy).
2. <strong>Facial Emotion Detector</strong>: Real-time CNN classifying 5 expressions (91% precision).
3. <strong>Fiduccia-Mattheyses Circuit Partitioner</strong>: VLSI O(1) gain-bucket hypergraph partitioning.
4. <strong>COVID-19 Mask Detector</strong>: TensorFlow/Keras stream classification.
5. <strong>Neural Image Captioning</strong>: End-to-end multimodal CNN + LSTM.
6. <strong>DSA & Interview Archive</strong>: Curated algorithmic patterns in Python.`,

    'office-hours': () => {
      openOfficeHoursModal();
      return 'Opening 1:1 Office Hours scheduling modal...';
    },

    resume: () => {
      window.open('static/Aniket_Singh_Resume.pdf', '_blank');
      return 'Opening Aniket_Singh_Resume.pdf in a new tab...';
    },

    clear: () => {
      if (cliLog) {
        cliLog.innerHTML = `
          <div class="cli-msg">Aniket CLI v2.4 (Mountain View, CA)</div>
          <div class="cli-msg">Type <span class="cli-highlight">'help'</span> for commands.</div>`;
      }
      return null;
    }
  };

  if (cliForm && cliInput && cliLog) {
    cliForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawInput = cliInput.value.trim();
      if (!rawInput) return;

      const userRow = document.createElement('div');
      userRow.className = 'cli-input-row';
      userRow.innerHTML = `<span class="cli-prompt">guest@aniket:~$</span> <span>${escapeHtml(rawInput)}</span>`;
      cliLog.appendChild(userRow);

      const cmd = rawInput.toLowerCase();
      if (cliCommands[cmd]) {
        const result = cliCommands[cmd]();
        if (result) {
          const resRow = document.createElement('div');
          resRow.className = 'cli-output';
          resRow.innerHTML = result;
          cliLog.appendChild(resRow);
        }
      } else {
        const errRow = document.createElement('div');
        errRow.className = 'cli-output cli-error';
        errRow.innerHTML = `command not found: <em>${escapeHtml(cmd)}</em>. Type <span class="cli-cmd">'help'</span> for a list of available commands.`;
        cliLog.appendChild(errRow);
      }

      cliInput.value = '';
      cliLog.scrollTop = cliLog.scrollHeight;
    });
  }

  // --------------------------------------------------------------------------
  // 7. Project Filtering with Accessible ARIA States
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const category = btn.getAttribute('data-filter');
      projectCards.forEach((card) => {
        const cardCats = (card.getAttribute('data-category') || '').split(' ');
        if (category === 'all' || cardCats.includes(category)) {
          card.style.display = 'flex';
          card.classList.add('visible');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 8. Scroll Reveal Animations & Active Nav Link Highlight
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 140;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navItems.forEach((item) => {
          item.classList.toggle('active', item.getAttribute('href') === `#${id}`);
        });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 9. Copy Email Button with Animated Toast
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      copyEmailAddress();
    });
  }

  function copyEmailAddress() {
    const email = 'work.aniketdsingh@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      if (copyEmailBtn) {
        const original = copyEmailBtn.textContent;
        copyEmailBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyEmailBtn.textContent = original;
        }, 2000);
      }
      showToast(`Copied to clipboard: ${email}`, 'success');
    }).catch(() => {
      showToast(`Email address: ${email}`, 'info');
    });
  }

  // --------------------------------------------------------------------------
  // 10. Interactive 1:1 Office Hours Modal
  // --------------------------------------------------------------------------
  const officeHoursModal = document.getElementById('officeHoursModal');
  const closeOfficeHoursBtn = document.getElementById('closeOfficeHoursModal');
  const topicChips = document.querySelectorAll('.topic-chip');
  const officeHoursNote = document.getElementById('officeHoursNote');
  const btnBookLinkedIn = document.getElementById('btnBookLinkedIn');
  const btnPrefillContact = document.getElementById('btnPrefillContact');

  let selectedTopic = 'Google SWE Interview & T-Shaped Prep';

  topicChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      topicChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      selectedTopic = chip.getAttribute('data-topic');
    });
  });

  function openOfficeHoursModal() {
    if (!officeHoursModal) return;
    officeHoursModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      if (officeHoursNote) officeHoursNote.focus();
    }, 120);
  }

  function closeOfficeHoursModal() {
    if (!officeHoursModal) return;
    officeHoursModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  // Trigger buttons
  document.querySelectorAll('[data-open-office-hours]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openOfficeHoursModal();
    });
  });

  if (closeOfficeHoursBtn) {
    closeOfficeHoursBtn.addEventListener('click', closeOfficeHoursModal);
  }

  if (officeHoursModal) {
    officeHoursModal.addEventListener('click', (e) => {
      if (e.target === officeHoursModal) {
        closeOfficeHoursModal();
      }
    });
  }

  if (btnPrefillContact) {
    btnPrefillContact.addEventListener('click', () => {
      const subjectInput = document.getElementById('senderSubject');
      const messageInput = document.getElementById('senderMessage');
      const note = officeHoursNote ? officeHoursNote.value.trim() : '';

      if (subjectInput) {
        subjectInput.value = `1:1 Office Hours Inquiry — ${selectedTopic}`;
      }

      if (messageInput) {
        messageInput.value = `Hi Aniket,\n\nI'd like to schedule 1:1 office hours to discuss ${selectedTopic}.\n\nContext / Questions:\n${note || 'I look forward to discussing career strategies, interview preparation, and machine learning.'}\n\nThanks!`;
      }

      closeOfficeHoursModal();

      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const senderName = document.getElementById('senderName');
          if (senderName) senderName.focus();
        }, 500);
      }

      showToast(`Prefilled message form for "${selectedTopic}"`, 'success');
    });
  }

  // --------------------------------------------------------------------------
  // 11. Command Palette (⌘K / Ctrl+K)
  // --------------------------------------------------------------------------
  const cmdPaletteModal = document.getElementById('cmdPaletteModal');
  const cmdTriggerBtn = document.getElementById('cmdTriggerBtn');
  const cmdInput = document.getElementById('cmdInput');
  const cmdList = document.getElementById('cmdList');
  const cmdItems = document.querySelectorAll('.cmd-item');

  let activeIndex = -1;

  function openCmdPalette() {
    if (!cmdPaletteModal) return;
    cmdPaletteModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (cmdInput) {
      cmdInput.value = '';
      filterCmdItems('');
      setTimeout(() => cmdInput.focus(), 80);
    }
  }

  function closeCmdPalette() {
    if (!cmdPaletteModal) return;
    cmdPaletteModal.style.display = 'none';
    document.body.style.overflow = '';
    activeIndex = -1;
  }

  if (cmdTriggerBtn) {
    cmdTriggerBtn.addEventListener('click', openCmdPalette);
  }

  if (cmdPaletteModal) {
    cmdPaletteModal.addEventListener('click', (e) => {
      if (e.target === cmdPaletteModal) {
        closeCmdPalette();
      }
    });
  }

  // Keyboard shortcut ⌘K / Ctrl+K and Esc
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdPaletteModal && cmdPaletteModal.style.display === 'flex') {
        closeCmdPalette();
      } else {
        openCmdPalette();
      }
    } else if (e.key === 'Escape') {
      if (cmdPaletteModal && cmdPaletteModal.style.display === 'flex') {
        closeCmdPalette();
      }
      if (officeHoursModal && officeHoursModal.style.display === 'flex') {
        closeOfficeHoursModal();
      }
    }
  });

  // Filter command palette items
  function filterCmdItems(query) {
    const q = query.toLowerCase().trim();
    let visibleCount = 0;

    cmdItems.forEach((item) => {
      const text = item.textContent.toLowerCase();
      const match = text.includes(q);
      item.style.display = match ? 'flex' : 'none';
      if (match) visibleCount++;
      item.classList.remove('selected');
    });

    activeIndex = visibleCount > 0 ? 0 : -1;
    highlightActiveCmdItem();
  }

  function highlightActiveCmdItem() {
    const visibleItems = Array.from(cmdItems).filter((i) => i.style.display !== 'none');
    visibleItems.forEach((item, idx) => {
      item.classList.toggle('selected', idx === activeIndex);
      if (idx === activeIndex) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => {
      filterCmdItems(e.target.value);
    });

    cmdInput.addEventListener('keydown', (e) => {
      const visibleItems = Array.from(cmdItems).filter((i) => i.style.display !== 'none');
      if (visibleItems.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % visibleItems.length;
        highlightActiveCmdItem();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + visibleItems.length) % visibleItems.length;
        highlightActiveCmdItem();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < visibleItems.length) {
          executeCmdAction(visibleItems[activeIndex].getAttribute('data-action'));
        }
      }
    });
  }

  cmdItems.forEach((item) => {
    item.addEventListener('click', () => {
      executeCmdAction(item.getAttribute('data-action'));
    });
  });

  function executeCmdAction(action) {
    closeCmdPalette();

    switch (action) {
      case 'experience':
        scrollToSection('experience');
        break;
      case 'projects':
        scrollToSection('projects');
        break;
      case 'skills':
        scrollToSection('skills');
        break;
      case 'blogs':
        scrollToSection('blogs');
        break;
      case 'office-hours':
        openOfficeHoursModal();
        break;
      case 'resume':
        window.open('static/Aniket_Singh_Resume.pdf', '_blank');
        break;
      case 'copy-email':
        copyEmailAddress();
        break;
      case 'theme':
        toggleTheme();
        break;
      case 'linkedin':
        window.open('https://www.linkedin.com/in/aniketdsingh/', '_blank');
        break;
      case 'github':
        window.open('https://github.com/Bruces1998', '_blank');
        break;
      default:
        break;
    }
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // --------------------------------------------------------------------------
  // 12. Enhanced Contact Form Submission with Toast & Mailto
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const subject = document.getElementById('senderSubject').value.trim() || 'Portfolio Inquiry / Chat';
      const message = document.getElementById('senderMessage').value.trim();

      const body = `Hi Aniket,\n\n${message}\n\nBest regards,\n${name}\nEmail: ${email}`;
      const mailtoUrl = `mailto:work.aniketdsingh@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      // Try copying email and message draft for user convenience
      navigator.clipboard.writeText(`To: work.aniketdsingh@gmail.com\nSubject: ${subject}\n\n${body}`).then(() => {
        showToast('Message draft copied to clipboard! Opening mail client...', 'success', 3500);
      }).catch(() => {
        showToast('Opening your email client...', 'info', 3000);
      });

      if (formStatus) {
        formStatus.textContent = 'Launching mail client for work.aniketdsingh@gmail.com. If your client did not launch, click to copy address.';
        formStatus.style.display = 'block';
      }

      window.location.href = mailtoUrl;
    });
  }

  // --------------------------------------------------------------------------
  // 13. Year Stamp
  // --------------------------------------------------------------------------
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // Helper function to escape HTML for CLI
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
});
