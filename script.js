/**
 * ANKUR TRIPATHI - DATA ANALYST PORTFOLIO ENGINE
 * Features: Interactive Particle Canvas, Chart.js Live BI Sandbox, Typewriter,
 * Number Counters, Modal System, Skill Filters, Copy & Form Feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypewriter();
  initCounters();
  initNavbar();
  initSkillFilters();
  initInteractiveDashboard();
  initModals();
  initContactForm();
  initCopyActions();
});

/* ==========================================================================
   1. DYNAMIC DATA PARTICLE CANVAS (Connecting Data Nodes)
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 65);

  class DataNode {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? '#06b6d4' : '#6366f1';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new DataNode());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.18 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const roles = [
    'Data Analyst & BI Specialist',
    'Power BI & DAX Modeler',
    'Python (Pandas, EDA) Practitioner',
    'SQL Query & Pipeline Optimizer',
    'ETL & Automation Engineer'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const speed = 80;
  const backSpeed = 40;
  const delay = 1800;

  function type() {
    const current = roles[roleIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let timeout = isDeleting ? backSpeed : speed;

    if (!isDeleting && charIdx === current.length) {
      timeout = delay;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      timeout = 400;
    }

    setTimeout(type, timeout);
  }

  type();
}

/* ==========================================================================
   3. NUMBER COUNTERS ANIMATION
   ========================================================================== */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          animateValue(el, 0, target, 1600, prefix, suffix);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.4 }
  );

  statNumbers.forEach((num) => observer.observe(num));

  function animateValue(obj, start, end, duration, prefix, suffix) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      
      // Format 50000 to 50,000+
      let formatted = current.toLocaleString();
      if (end >= 1000 && !suffix) formatted += '+';

      obj.innerHTML = `${prefix}${formatted}${suffix}`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
}

/* ==========================================================================
   4. NAVBAR SCROLL & MOBILE MENU
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll Spy active navigation state
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });

  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   5. SKILLS FILTERING
   ========================================================================== */
function initSkillFilters() {
  const tabs = document.querySelectorAll('.skill-tab');
  const cards = document.querySelectorAll('.skill-category-card');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');

      cards.forEach((card) => {
        const cardCat = card.getAttribute('data-cat');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'block';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. INTERACTIVE LIVE BI DASHBOARD (Chart.js Engine)
   ========================================================================== */
let activeChartInstance = null;

function initInteractiveDashboard() {
  const ctx = document.getElementById('interactiveChart');
  if (!ctx) return;

  const tabs = document.querySelectorAll('.dash-tab');
  const timeFilter = document.getElementById('time-filter');
  const snippetEl = document.getElementById('dashboard-snippet');

  // Chart datasets & configurations
  const chartConfigs = {
    sales: {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Monthly Revenue ($K)',
            data: [78, 85, 92, 105, 118, 126, 142, 155, 168, 182, 195, 210],
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.15)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#06b6d4',
            pointRadius: 5
          },
          {
            label: 'Gross Profit Margin (%)',
            data: [32, 34, 33, 36, 38, 37, 40, 42, 41, 44, 46, 48],
            borderColor: '#10b981',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            yAxisID: 'y1',
            pointBackgroundColor: '#10b981',
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: '#cbd5e1', font: { family: 'Plus Jakarta Sans' } } },
          tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.95)', titleColor: '#06b6d4' }
        },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
          y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' }, title: { display: true, text: 'Revenue ($)', color: '#94a3b8' } },
          y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#10b981' }, title: { display: true, text: 'Margin %', color: '#10b981' } }
        }
      },
      codeSnippet: `<span class="code-comment">-- DAX Measure for MoM Growth & Margin Analysis</span>
MoM_Revenue_Growth = 
VAR CurrentRevenue = SUM(Sales[TransactionAmount])
VAR PriorMonthRevenue = CALCULATE(SUM(Sales[TransactionAmount]), PREVIOUSMONTH(Calendar[Date]))
RETURN
    DIVIDE(CurrentRevenue - PriorMonthRevenue, PriorMonthRevenue, 0)`
    },

    churn: {
      type: 'bar',
      data: {
        labels: ['Month-to-Month', 'One-Year Contract', 'Two-Year Contract', 'Fiber Internet', 'DSL Internet'],
        datasets: [
          {
            label: 'Churn Rate (%)',
            data: [42.7, 11.2, 2.8, 38.4, 18.9],
            backgroundColor: ['#f43f5e', '#f59e0b', '#10b981', '#f43f5e', '#38bdf8'],
            borderRadius: 6,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.1)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.95)' }
        },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
          y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' }, title: { display: true, text: 'Churn Probability (%)', color: '#94a3b8' } }
        }
      },
      codeSnippet: `<span class="code-comment"># Python Seaborn Heatmap & Churn Analysis Snippet</span>
import seaborn as sns
import matplotlib.pyplot as plt

churn_corr = df[['MonthlyCharges', 'Tenure', 'TotalCharges', 'Churn_Binary']].corr()
sns.heatmap(churn_corr, annot=True, cmap='coolwarm', fmt='.2f')
plt.title('Feature Correlation with Customer Churn')`
    },

    pipeline: {
      type: 'bar',
      data: {
        labels: ['Data Ingestion', 'Missing-Value Imputation', 'Transaction Aggregations', 'Variance Calculations', 'Excel Report Generation'],
        datasets: [
          {
            label: 'Legacy Manual Hours / Week',
            data: [6.5, 4.0, 5.2, 3.8, 4.5],
            backgroundColor: 'rgba(244, 63, 94, 0.7)',
            borderRadius: 4
          },
          {
            label: 'Automated Python/SQL Pipeline (Hours)',
            data: [0.5, 0.3, 0.4, 0.2, 0.4],
            backgroundColor: 'rgba(16, 185, 129, 0.85)',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#cbd5e1' } },
          tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.95)' }
        },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
          y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' }, title: { display: true, text: 'Execution Hours', color: '#94a3b8' } }
        }
      },
      codeSnippet: `<span class="code-comment">-- SQL Staging & Extraction Pipeline Automation</span>
INSERT INTO reporting_layer_daily_kpis (metric_date, total_volume, gross_variance)
SELECT 
    CURDATE(),
    COUNT(t.id),
    SUM(t.amount - t.baseline_cost)
FROM raw_transactions t
WHERE t.processed_at >= NOW() - INTERVAL 1 DAY;`
    }
  };

  let currentCategory = 'sales';

  function renderChart(typeKey) {
    if (activeChartInstance) {
      activeChartInstance.destroy();
    }
    const config = chartConfigs[typeKey];
    activeChartInstance = new Chart(ctx, {
      type: config.type,
      data: JSON.parse(JSON.stringify(config.data)),
      options: config.options
    });

    if (snippetEl) {
      snippetEl.innerHTML = config.codeSnippet;
    }
  }

  // Initial load
  renderChart('sales');

  // Handle Tab Switch
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-chart');
      renderChart(currentCategory);
    });
  });

  // Handle Filter Period Change
  if (timeFilter) {
    timeFilter.addEventListener('change', () => {
      showToast(`Updated analytics view for: ${timeFilter.options[timeFilter.selectedIndex].text}`);
      // Animate chart refresh
      renderChart(currentCategory);
    });
  }
}

/* ==========================================================================
   7. MODAL ENGINE (Project Deep Dives & Resume View)
   ========================================================================== */
function initModals() {
  const modalTriggers = document.querySelectorAll('.view-project-btn, #resume-download-btn');
  const closeButtons = document.querySelectorAll('.modal-close, .modal-backdrop');

  modalTriggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target') || (btn.id === 'resume-download-btn' ? 'modal-resume' : null);
      if (targetId) {
        const modal = document.getElementById(targetId);
        if (modal) {
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      }
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop') || e.target.closest('.modal-close')) {
        document.querySelectorAll('.modal-backdrop').forEach((m) => m.classList.remove('active'));
        document.body.style.overflow = '';
      }
    });
  });

  // Print resume
  const printBtn = document.getElementById('print-resume-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Quick code buttons
  document.querySelectorAll('.run-eda-demo-btn, .run-pipeline-demo-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const isPipeline = btn.classList.contains('run-pipeline-demo-btn');
      const targetModal = document.getElementById(isPipeline ? 'modal-financial' : 'modal-telecom');
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
}

/* ==========================================================================
   8. INTERACTIVE CONTACT FORM & TOAST NOTIFICATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('sender-name').value.trim();
    const email = document.getElementById('sender-email').value.trim();
    const subject = document.getElementById('sender-subject').value;
    const message = document.getElementById('sender-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    // Save lead inquiry to local storage
    const inquiries = JSON.parse(localStorage.getItem('ankur_portfolio_inquiries') || '[]');
    inquiries.push({ name, email, subject, message, timestamp: new Date().toISOString() });
    localStorage.setItem('ankur_portfolio_inquiries', JSON.stringify(inquiries));

    form.reset();
    showToast(`Thank you, ${name}! Your message regarding "${subject}" has been sent successfully. Ankur will reach out shortly.`);
  });
}

/* ==========================================================================
   9. COPY ACTIONS & TOAST MESSAGES
   ========================================================================== */
function initCopyActions() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        });
      }
    });
  });

  const copySummaryBtn = document.getElementById('copy-summary-btn');
  if (copySummaryBtn) {
    copySummaryBtn.addEventListener('click', () => {
      const summaryText = `ANKUR TRIPATHI - Data Analyst | Power BI, Python, SQL, Tableau | Contact: +91-6394739442, at7774883@gmail.com | Portfolio Projects: E-Commerce Sales (50K+ transactions, $45K+ revenue unlocked), Telecom Churn EDA (+18% retention), Financial Analytics Pipeline (35% time reduction).`;
      navigator.clipboard.writeText(summaryText).then(() => {
        showToast('Resume summary copied to clipboard!');
      });
    });
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-info text-cyan"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 4200);
}
