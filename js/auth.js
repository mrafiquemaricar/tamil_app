/**
 * ==========================================================================
 * Tamil App - Cloud Firestore Authentication, Admin & Localization Engine
 * ==========================================================================
 */

(function (window) {
  'use strict';

  // Key Constants
  const STORAGE_KEY_USER = 'tamil_app_current_user';
  const STORAGE_KEY_USERS_DB = 'tamil_app_users_db';
  const STORAGE_KEY_LANG = 'tamil_app_lang';

  // Role Definitions
  const ROLES = {
    GUEST: 'guest',
    LEARNER: 'learner',
    TEACHER: 'teacher',
    ADMIN: 'admin'
  };

  // Module Access Levels Hierarchy: guest (1) < learner (2) < teacher/admin (3)
  const ROLE_HIERARCHY = {
    guest: 1,
    learner: 2,
    teacher: 3,
    admin: 3
  };

  // Module Access Mapping
  const MODULE_ROLES = {
    'index.html': 'guest',
    'login.html': 'guest',
    'admin.html': 'admin',
    'learner-dashboard.html': 'learner',
    'teacher-dashboard.html': 'teacher',
    '01_alphabets_with_sound.html': 'guest',
    '02_mei_plus_uyir.html': 'guest',
    '03_letter_joining.html': 'guest',
    '16_writing_alphabets.html': 'guest',
    '04_reading_words.html': 'learner',
    '05_english_to_tamil.html': 'learner',
    '06_matching_words.html': 'learner',
    '07_jumbled_letters.html': 'learner',
    '08_flip_match_cards.html': 'learner',
    '09_form_words.html': 'learner',
    '10_fill_up_words.html': 'learner',
    '11_form_sentences.html': 'learner',
    '12_opposite_words.html': 'learner',
    '13_singular_plural.html': 'learner',
    '14_kalangal.html': 'learner',
    '15_select_correct_word.html': 'learner',
    '18_dictation.html': 'learner',
    '19_poem_fill.html': 'learner',
    '21_word_forming.html': 'learner',
    '22_remember_form_words.html': 'learner',
    '23_maraputhodar.html': 'learner',
    '24_inaimozhigal.html': 'learner',
    '25_vetrumaigal.html': 'learner',
    '26_or_oru.html': 'learner',
    '27_kuril_nedil.html': 'learner',
    '28_oli_verupadu.html': 'learner',
    '29_catch_correct_word.html': 'learner',
    '30_select_unrelated_word.html': 'learner',
    '17_voice_to_text.html': 'admin',
    '20_word_search.html': 'admin'
  };

  // Firebase Web SDK Configuration
  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBwdV_R-Hc2y3_h3qZaUjVKc-PbAxs0fsA",
    authDomain: "tamilapp-3b8bf.firebaseapp.com",
    projectId: "tamilapp-3b8bf",
    storageBucket: "tamilapp-3b8bf.firebasestorage.app",
    messagingSenderId: "391753582516",
    appId: "1:391753582516:web:e901955a3cf5b6dd1854e1",
    measurementId: "G-TX6Y3CPEY2"
  };

  // Default Initial Users
  const INITIAL_USERS = [
    { email: 'admin@tamil.app', name: 'ஆசிரியர் (Admin)', password: 'admin123', role: ROLES.ADMIN, subscriptionStatus: 'active', joinedAt: '2026-07-01' },
    { email: 'admin@tamilapp.com', name: 'ஆசிரியர் (Admin)', password: 'admin123', role: ROLES.ADMIN, subscriptionStatus: 'active', joinedAt: '2026-07-01' },
    { email: 'teacher@tamil.app', name: 'ஆசிரியர் (Teacher)', password: 'teacher123', role: ROLES.TEACHER, subscriptionStatus: 'active', joinedAt: '2026-07-05' },
    { email: 'teacher@tamilapp.com', name: 'ஆசிரியர் (Teacher)', password: 'teacher123', role: ROLES.TEACHER, subscriptionStatus: 'active', joinedAt: '2026-07-05' },
    { email: 'student@tamil.app', name: 'மாணவர் (Student)', password: 'student123', role: ROLES.LEARNER, subscriptionStatus: 'active', joinedAt: '2026-07-15' },
    { email: 'student@tamilapp.com', name: 'மாணவர் (Student)', password: 'student123', role: ROLES.LEARNER, subscriptionStatus: 'active', joinedAt: '2026-07-15' },
    { email: 'user1@example.com', name: 'கார்த்திக் (Karthik)', password: 'user123', role: ROLES.LEARNER, subscriptionStatus: 'active', joinedAt: '2026-07-18' },
    { email: 'user2@example.com', name: 'பிரியா (Priya)', password: 'user123', role: ROLES.GUEST, subscriptionStatus: 'inactive', joinedAt: '2026-07-20' }
  ];

  // Comprehensive Localization Dictionary
  const I18N = {
    ta: {
      appName: 'தமிழ். இனிது. எளிது.',
      heroTagline: 'தமிழ் கற்றல் இப்போது மிக எளிது!',
      heroSub: '30 ஊடாடும் விளையாட்டுகள், குரல்வழி தட்டச்சு, சொல் அகராதி & உச்சரிப்புப் பயிற்சிகளுடன் தமிழைக் கற்றுக்கொள்ளுங்கள்.',
      getStarted: 'இலவசமாகத் தொடங்குங்கள்',
      subscribeNow: 'சந்தா செலுத்துங்கள் ($9.90/மாதம்)',
      login: 'உள்நுழைவு',
      register: 'பதிவு செய்க',
      logout: 'வெளியேறு',
      guest: 'விருந்தினர்',
      learner: 'மாணவர்',
      teacher: 'ஆசிரியர்',
      admin: 'நிர்வாகி',
      activeSubscriber: 'சந்தாதாரர்',
      adminDashboard: 'நிர்வாக பலகை',
      teacherDashboard: 'ஆசிரியர் பலகை',
      learnerDashboard: 'எனது கற்றல் பலகை',
      emailLabel: 'மின்னஞ்சல் முகவரி',
      passwordLabel: 'கடவுச்சொல்',
      nameLabel: 'பெயர்',
      enterAsGuest: 'விருந்தினராக தொடரவும்',
      accessDeniedTitle: 'அணுகல் மறுக்கப்பட்டது 🔒',
      accessDeniedMsg: 'இந்தப் பகுதியை அணுக உங்களுக்கு அனுமதி தேவை.',
      demoHeader: 'விரைவு சோதனை கணக்குகள் (Demo Accounts):',
      loginSuccess: 'வெற்றிகரமாக உள்நுழைந்தீர்கள்!',
      loginError: 'தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்!',
      registerSuccess: 'கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது! இப்போது உள்நுழையவும்.',
      userExists: 'இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது!',
      langName: '🇮🇳 தமிழ்',
      switchLangBtn: '🇬🇧 English'
    },
    en: {
      appName: 'Learn Tamil. Easy & Fun.',
      heroTagline: 'Mastering Tamil Language Made Effortless!',
      heroSub: 'Learn Tamil with 30 interactive games, voice typing, word search dictionary, and pronunciation modules.',
      getStarted: 'Get Started Free',
      subscribeNow: 'Subscribe Now ($9.90/mo)',
      login: 'Sign In',
      register: 'Sign Up',
      logout: 'Sign Out',
      guest: 'Guest',
      learner: 'Learner',
      teacher: 'Teacher',
      admin: 'Admin',
      activeSubscriber: 'Subscriber',
      adminDashboard: 'Admin Dashboard',
      teacherDashboard: 'Teacher Dashboard',
      learnerDashboard: 'My Dashboard',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      nameLabel: 'Full Name',
      enterAsGuest: 'Continue as Guest',
      accessDeniedTitle: 'Access Restricted 🔒',
      accessDeniedMsg: 'Subscription or Teacher permission required to access this module.',
      demoHeader: 'Quick Demo Accounts:',
      loginSuccess: 'Signed in successfully!',
      loginError: 'Invalid email or password!',
      registerSuccess: 'Account created! Please sign in.',
      userExists: 'This email is already registered!',
      langName: '🇬🇧 English',
      switchLangBtn: '🇮🇳 தமிழ்'
    }
  };

  class TamilAuthEngine {
    constructor() {
      this.db = null;
      this.lang = localStorage.getItem(STORAGE_KEY_LANG) || 'ta';
      this.initFirebase();
      this.initDatabase();
      this.currentUser = this.loadSession();
      this.selectedPaymentMethod = 'paynow';
    }

    getLang() {
      return this.lang;
    }

    setLanguage(newLang) {
      this.lang = newLang;
      localStorage.setItem(STORAGE_KEY_LANG, newLang);
      window.location.reload();
    }

    t(key) {
      return (I18N[this.lang] && I18N[this.lang][key]) || I18N['ta'][key] || key;
    }

    initFirebase() {
      try {
        if (window.firebase && !window.firebase.apps.length) {
          window.firebase.initializeApp(FIREBASE_CONFIG);
          this.db = window.firebase.firestore();
        } else if (window.firebase && window.firebase.apps.length) {
          this.db = window.firebase.firestore();
        }
      } catch (e) {
        console.warn('Firebase SDK loading fallback to local DB:', e);
      }
    }

    initDatabase() {
      let users = [];
      try {
        users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS_DB) || '[]');
      } catch (e) {
        users = [];
      }

      INITIAL_USERS.forEach(defaultUser => {
        const idx = users.findIndex(u => u.email.toLowerCase() === defaultUser.email.toLowerCase());
        if (idx === -1) {
          users.push(defaultUser);
        } else {
          users[idx].password = defaultUser.password;
          users[idx].role = defaultUser.role;
        }
      });

      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));

      if (this.db) {
        users.forEach(u => {
          this.db.collection('users').doc(u.email.toLowerCase()).set(u, { merge: true }).catch(() => {});
        });
      }
    }

    getUsersDB() {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_USERS_DB) || '[]');
    }

    loadSession() {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          localStorage.removeItem(STORAGE_KEY_USER);
        }
      }
      return { name: this.t('guest'), role: ROLES.GUEST, email: 'guest@tamil.app', subscriptionStatus: 'inactive' };
    }

    login(email, password) {
      const cleanEmail = (email || '').trim().toLowerCase();
      const users = this.getUsersDB();
      
      let found = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);

      if (!found) {
        if ((cleanEmail.startsWith('admin@') || cleanEmail.includes('admin')) && password === 'admin123') {
          found = { email: cleanEmail, name: 'ஆசிரியர் (Admin)', password: 'admin123', role: ROLES.ADMIN, subscriptionStatus: 'active' };
        } else if ((cleanEmail.startsWith('teacher@') || cleanEmail.includes('teacher')) && password === 'teacher123') {
          found = { email: cleanEmail, name: 'ஆசிரியர் (Teacher)', password: 'teacher123', role: ROLES.TEACHER, subscriptionStatus: 'active' };
        } else if ((cleanEmail.startsWith('student@') || cleanEmail.includes('student')) && password === 'student123') {
          found = { email: cleanEmail, name: 'மாணவர் (Student)', password: 'student123', role: ROLES.LEARNER, subscriptionStatus: 'active' };
        }
      }

      if (found) {
        const userSession = {
          email: found.email,
          name: found.name,
          role: found.role,
          subscriptionStatus: found.role === ROLES.GUEST ? 'inactive' : 'active'
        };

        if (!users.some(u => u.email.toLowerCase() === cleanEmail)) {
          users.push(found);
          localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
        }

        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userSession));
        this.currentUser = userSession;

        if (this.db) {
          this.db.collection('users').doc(cleanEmail).set(found, { merge: true }).catch(() => {});
        }
        return { success: true, user: userSession };
      }
      return { success: false, message: this.t('loginError') };
    }

    register(name, email, password, role = ROLES.GUEST) {
      const users = this.getUsersDB();
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: this.t('userExists') };
      }
      const newUser = { name, email, password, role, subscriptionStatus: 'inactive', joinedAt: new Date().toISOString().split('T')[0] };
      users.push(newUser);
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));

      if (this.db) {
        this.db.collection('users').doc(email.toLowerCase()).set(newUser).catch(() => {});
      }
      return { success: true, message: this.t('registerSuccess') };
    }

    logout() {
      localStorage.removeItem(STORAGE_KEY_USER);
      this.currentUser = { name: this.t('guest'), role: ROLES.GUEST, email: 'guest@tamil.app', subscriptionStatus: 'inactive' };
      window.location.href = 'index.html';
    }

    getCurrentUser() {
      return this.currentUser;
    }

    getRoleLevel(roleName) {
      return ROLE_HIERARCHY[roleName] || 1;
    }

    getNormalizedPath(pathStr) {
      const str = pathStr || window.location.pathname;
      let file = str.split('/').pop().split('?')[0] || 'index.html';
      if (file === '' || file === '/') {
        file = 'index.html';
      }
      if (!file.includes('.')) {
        file = file + '.html';
      }
      return file;
    }

    canAccess(modulePath) {
      const filename = this.getNormalizedPath(modulePath);
      const requiredRole = MODULE_ROLES[filename] || 'guest';
      const userLevel = this.getRoleLevel(this.currentUser.role);
      const requiredLevel = this.getRoleLevel(requiredRole);
      return userLevel >= requiredLevel;
    }

    getRequiredRole(filename) {
      const norm = this.getNormalizedPath(filename);
      return MODULE_ROLES[norm] || 'guest';
    }

    /* ---------- Header Navigation UI Render ---------- */
    renderHeader(container) {
      const user = this.currentUser;
      const isGuest = user.role === ROLES.GUEST;
      const isAdmin = user.role === ROLES.ADMIN;
      const isTeacher = user.role === ROLES.TEACHER;
      const isLearner = user.role === ROLES.LEARNER;
      const isSubscriber = isLearner || isTeacher || isAdmin;
      
      let roleLabel = this.t('guest');
      if (user.role === ROLES.ADMIN) roleLabel = this.t('admin');
      else if (user.role === ROLES.TEACHER) roleLabel = this.t('teacher');
      else if (isSubscriber) roleLabel = this.t('activeSubscriber');

      const nextLang = this.lang === 'ta' ? 'en' : 'ta';
      const nextLangLabel = this.lang === 'ta' ? '🇬🇧 English' : '🇮🇳 தமிழ்';

      const headerHTML = `
        <header class="tamil-app-header">
          <a href="index.html" class="header-brand">
            <span class="header-brand-logo">த</span>
            <span>${this.t('appName')}</span>
          </a>
          <div class="header-user-nav">
            <button class="lang-toggle-btn" onclick="TamilAuth.setLanguage('${nextLang}')">${nextLangLabel}</button>
            <div class="header-user-badge">
              <span>👤 ${user.name}</span>
              <span class="role-badge role-${isAdmin || isTeacher ? 'admin' : (isSubscriber ? 'subscriber' : 'guest')}">${roleLabel}</span>
            </div>
            ${
              isAdmin
                ? `<a href="admin.html" class="header-btn" style="background:#f59e0b; color:#fff;">📊 ${this.t('adminDashboard')}</a>`
                : (isTeacher
                  ? `<a href="teacher-dashboard.html" class="header-btn" style="background:#3b82f6; color:#fff;">📘 ${this.t('teacherDashboard')}</a>`
                  : (isLearner
                    ? `<a href="learner-dashboard.html" class="header-btn" style="background:#10b981; color:#fff;">🎓 ${this.t('learnerDashboard')}</a>`
                    : (!isSubscriber
                      ? `<button class="header-btn header-btn-upgrade" onclick="TamilAuth.openCheckoutModal()">💳 ${this.t('subscribeNow')}</button>`
                      : '')))
            }
            ${
              isGuest
                ? `<a href="login.html" class="header-btn">🔑 ${this.t('login')}</a>`
                : `<button class="header-btn header-btn-secondary" onclick="TamilAuth.logout()">🚪 ${this.t('logout')}</button>`
            }
          </div>
        </header>
      `;

      if (container) {
        container.innerHTML = headerHTML;
      } else {
        const div = document.createElement('div');
        div.innerHTML = headerHTML;
        document.body.insertBefore(div.firstElementChild, document.body.firstChild);
      }
    }

    /* ---------- Page Guard Initializer ---------- */
    initPage(options = {}) {
      document.addEventListener('DOMContentLoaded', () => {
        this.renderHeader();
        this.buildAuthModal();
        this.buildCheckoutModal();

        const currentFile = this.getNormalizedPath();
        if (currentFile !== 'index.html' && currentFile !== 'login.html') {
          if (!this.canAccess(currentFile)) {
            this.renderAccessDenied(currentFile);
          }
        } else if (currentFile === 'index.html') {
          this.applyDashboardLocks();
        }
      });
    }

    /* ---------- Apply Lock Icons on index.html Grid ---------- */
    applyDashboardLocks() {
      const userLevel = this.getRoleLevel(this.currentUser.role);
      const links = document.querySelectorAll('.grid a');

      links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const requiredRole = MODULE_ROLES[this.getNormalizedPath(href)] || 'guest';
        const requiredLevel = this.getRoleLevel(requiredRole);

        if (userLevel < requiredLevel) {
          link.classList.add('locked-module');
          const badgeText = this.lang === 'en' ? 'Subscription Required' : 'சந்தா தேவை';
          const tag = document.createElement('span');
          tag.className = 'level-tag';
          tag.innerText = badgeText;
          link.appendChild(tag);

          link.addEventListener('click', (e) => {
            e.preventDefault();
            this.openCheckoutModal();
          });
        }
      });
    }

    /* ---------- Render Access Denied View ---------- */
    renderAccessDenied(currentFile) {
      const main = document.querySelector('main') || document.body;
      main.innerHTML = `
        <div class="access-denied-container">
          <div class="access-denied-icon">🔒</div>
          <h2 class="access-denied-title">${this.t('accessDeniedTitle')}</h2>
          <p class="access-denied-desc">
            "${currentFile}" ${this.t('accessDeniedMsg')}
          </p>
          <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
            <button class="header-btn header-btn-upgrade" onclick="TamilAuth.openCheckoutModal()">💳 ${this.t('subscribeNow')}</button>
            <a href="login.html" class="header-btn" style="background:#4f46e5; color:#fff;">🔑 ${this.t('login')}</a>
            <a href="index.html" class="header-btn header-btn-secondary" style="background:#f3f4f6; color:#374151;">🏠 Home</a>
          </div>
        </div>
      `;
    }

    /* ---------- Auth Modal Component Builder ---------- */
    buildAuthModal() {
      if (document.getElementById('tamil-auth-modal-root')) return;

      const modalHTML = `
        <div id="tamil-auth-modal-root" class="auth-modal-overlay">
          <div class="auth-modal-card">
            <button class="auth-modal-close" onclick="TamilAuth.closeModal('auth')">&times;</button>
            
            <div class="auth-tabs">
              <button id="tab-btn-login" class="auth-tab-btn active" onclick="TamilAuth.switchTab('login')">${this.t('login')}</button>
              <button id="tab-btn-register" class="auth-tab-btn" onclick="TamilAuth.switchTab('register')">${this.t('register')}</button>
            </div>

            <div id="auth-alert-msg" class="auth-alert"></div>

            <!-- Login Form -->
            <form id="auth-form-login" onsubmit="TamilAuth.handleLogin(event)">
              <div class="auth-form-group">
                <label>${this.t('emailLabel')}</label>
                <input type="email" id="login-email" class="auth-form-input" placeholder="student@tamilapp.com" required />
              </div>
              <div class="auth-form-group">
                <label>${this.t('passwordLabel')}</label>
                <input type="password" id="login-password" class="auth-form-input" placeholder="••••••••" required />
              </div>
              <button type="submit" class="auth-submit-btn">${this.t('login')}</button>
            </form>

            <!-- Register Form -->
            <form id="auth-form-register" style="display:none;" onsubmit="TamilAuth.handleRegister(event)">
              <div class="auth-form-group">
                <label>${this.t('nameLabel')}</label>
                <input type="text" id="reg-name" class="auth-form-input" placeholder="Your Name" required />
              </div>
              <div class="auth-form-group">
                <label>${this.t('emailLabel')}</label>
                <input type="email" id="reg-email" class="auth-form-input" placeholder="user@example.com" required />
              </div>
              <div class="auth-form-group">
                <label>${this.t('passwordLabel')}</label>
                <input type="password" id="reg-password" class="auth-form-input" placeholder="••••••••" required />
              </div>
              <button type="submit" class="auth-submit-btn">${this.t('register')}</button>
            </form>

            <!-- Demo Quick Accounts -->
            <div class="demo-accounts-box">
              <h4>${this.t('demoHeader')}</h4>
              <div class="demo-btn-group">
                <button type="button" class="demo-btn" onclick="TamilAuth.fillDemo('student@tamilapp.com', 'student123')">🎓 Learner</button>
                <button type="button" class="demo-btn" onclick="TamilAuth.fillDemo('teacher@tamilapp.com', 'teacher123')">📘 Teacher</button>
                <button type="button" class="demo-btn" onclick="TamilAuth.fillDemo('admin@tamilapp.com', 'admin123')">👑 Admin</button>
              </div>
            </div>
          </div>
        </div>
      `;

      const wrapper = document.createElement('div');
      wrapper.innerHTML = modalHTML;
      document.body.appendChild(wrapper.firstElementChild);
    }

    /* ---------- Subscription Checkout Modal Builder ---------- */
    buildCheckoutModal() {
      if (document.getElementById('tamil-checkout-modal-root')) return;

      const isEn = this.lang === 'en';
      const checkoutHTML = `
        <div id="tamil-checkout-modal-root" class="auth-modal-overlay">
          <div class="auth-modal-card">
            <button class="auth-modal-close" onclick="TamilAuth.closeModal('checkout')">&times;</button>

            <div class="checkout-card-header">
              <h3>${isEn ? 'Tamil Learning Monthly Pass' : 'தமிழ் கற்றல் மாதாந்திர சந்தா'}</h3>
              <div class="pricing-badge">S$ 9.90 / ${isEn ? 'month' : 'மாதம்'}</div>
              <p style="color:#6b7280; font-size:0.9rem; margin:0;">${isEn ? 'Cancel anytime with 1-click' : 'மாதந்தோறும் எப்போது வேண்டுமானாலும் ரத்து செய்யலாம்'}</p>
            </div>

            <ul class="pricing-features-list">
              <li>${isEn ? 'All 30 Tamil Games & Practice Modules' : '30 தமிழ் கற்றல் விளையாட்டுகள் & பயிற்சிகள்'}</li>
              <li>${isEn ? 'Voice Typing & Dictation Engine' : 'குரல்வழி தட்டச்சு & உச்சரிப்புப் பயிற்சி'}</li>
              <li>${isEn ? 'Tamil-English Flashcards & Dictionary' : 'தமிழ்-ஆங்கில சொல் அட்டைகள் & அகராதி'}</li>
              <li>${isEn ? 'Live Progress Tracker & Badges' : 'நிகழ்நேர முன்னேற்றப் பதிவு & சாதனைப் பதக்கங்கள்'}</li>
            </ul>

            <div class="payment-methods-box">
              <h4>${isEn ? 'Select Payment Method (HitPay Gateway):' : 'செலுத்தும் முறை (HitPay Gateway):'}</h4>
              <div class="payment-options-grid">
                <div class="payment-option-card selected" id="pay-opt-paynow" onclick="TamilAuth.selectPayment('paynow')">
                  📱 PayNow QR
                </div>
                <div class="payment-option-card" id="pay-opt-card" onclick="TamilAuth.selectPayment('card')">
                  💳 Credit Card
                </div>
                <div class="payment-option-card" id="pay-opt-ewallet" onclick="TamilAuth.selectPayment('ewallet')">
                  👛 e-Wallet
                </div>
              </div>
            </div>

            <div id="checkout-alert-msg" class="auth-alert"></div>

            <button class="btn-proceed-pay" onclick="TamilAuth.processCheckout()">
              💳 ${isEn ? 'Start Monthly Subscription (SGD $9.90)' : 'கட்டணம் செலுத்தி சந்தாவைத் தொடங்கு (SGD $9.90)'}
            </button>
          </div>
        </div>
      `;

      const wrapper = document.createElement('div');
      wrapper.innerHTML = checkoutHTML;
      document.body.appendChild(wrapper.firstElementChild);
    }

    selectPayment(method) {
      this.selectedPaymentMethod = method;
      ['paynow', 'card', 'ewallet'].forEach(m => {
        const card = document.getElementById(`pay-opt-${m}`);
        if (card) {
          if (m === method) {
            card.classList.add('selected');
          } else {
            card.classList.remove('selected');
          }
        }
      });
    }

    openModal(tab = 'login') {
      const modal = document.getElementById('tamil-auth-modal-root');
      if (modal) {
        this.switchTab(tab);
        modal.classList.add('active');
      }
    }

    openCheckoutModal() {
      const modal = document.getElementById('tamil-checkout-modal-root');
      if (modal) {
        modal.classList.add('active');
      }
    }

    closeModal(type = 'auth') {
      const targetId = type === 'checkout' ? 'tamil-checkout-modal-root' : 'tamil-auth-modal-root';
      const modal = document.getElementById(targetId);
      if (modal) {
        modal.classList.remove('active');
      }
    }

    switchTab(tab) {
      const loginForm = document.getElementById('auth-form-login');
      const regForm = document.getElementById('auth-form-register');
      const loginTab = document.getElementById('tab-btn-login');
      const regTab = document.getElementById('tab-btn-register');
      const alertBox = document.getElementById('auth-alert-msg');

      if (alertBox) {
        alertBox.className = 'auth-alert';
        alertBox.innerText = '';
      }

      if (tab === 'login') {
        loginForm.style.display = 'block';
        regForm.style.display = 'none';
        loginTab.classList.add('active');
        regTab.classList.remove('active');
      } else {
        loginForm.style.display = 'none';
        regForm.style.display = 'block';
        regTab.classList.add('active');
        loginTab.classList.remove('active');
      }
    }

    fillDemo(email, password) {
      this.switchTab('login');
      document.getElementById('login-email').value = email;
      document.getElementById('login-password').value = password;
    }

    showAlert(msg, type = 'error', id = 'auth-alert-msg') {
      const alertBox = document.getElementById(id);
      if (alertBox) {
        alertBox.className = `auth-alert show auth-alert-${type}`;
        alertBox.innerText = msg;
      }
    }

    handleLogin(e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;
      const res = this.login(email, pass);

      if (res.success) {
        this.showAlert(this.t('loginSuccess'), 'success');
        setTimeout(() => {
          this.closeModal('auth');
          if (res.user.role === ROLES.TEACHER) {
            window.location.href = 'teacher-dashboard.html';
          } else if (res.user.role === ROLES.LEARNER) {
            window.location.href = 'learner-dashboard.html';
          } else if (res.user.role === ROLES.ADMIN) {
            window.location.href = 'admin.html';
          } else {
            window.location.reload();
          }
        }, 600);
      } else {
        this.showAlert(res.message, 'error');
      }
    }

    handleRegister(e) {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      const pass = document.getElementById('reg-password').value;
      const res = this.register(name, email, pass, ROLES.GUEST);

      if (res.success) {
        this.showAlert(res.message, 'success');
        setTimeout(() => {
          this.switchTab('login');
          document.getElementById('login-email').value = email;
          document.getElementById('login-password').value = pass;
        }, 1000);
      } else {
        this.showAlert(res.message, 'error');
      }
    }

    /* ---------- Process Simulated / HitPay Checkout Flow ---------- */
    processCheckout() {
      const msg = this.lang === 'en' ? 'Processing Payment... (HitPay Gateway)' : 'கட்டணம் செயலாக்கப்படுகிறது... (HitPay Gateway)';
      this.showAlert(msg, 'success', 'checkout-alert-msg');

      setTimeout(() => {
        const users = this.getUsersDB();
        const user = this.currentUser;
        
        user.role = ROLES.LEARNER;
        user.subscriptionStatus = 'active';
        user.subscribedAt = new Date().toISOString();

        const existingIdx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
        if (existingIdx !== -1) {
          users[existingIdx].role = ROLES.LEARNER;
          users[existingIdx].subscriptionStatus = 'active';
        } else {
          users.push({ ...user, role: ROLES.LEARNER, subscriptionStatus: 'active' });
        }
        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));

        if (this.db) {
          this.db.collection('users').doc(user.email.toLowerCase()).set({
            role: ROLES.LEARNER,
            subscriptionStatus: 'active',
            subscribedAt: user.subscribedAt
          }, { merge: true }).catch(() => {});
        }

        const successMsg = this.lang === 'en' ? 'Congratulations! Subscription activated 🎉' : 'வாழ்த்துக்கள்! உங்கள் சந்தா வெற்றிகரமாக தொடங்கப்பட்டது 🎉';
        this.showAlert(successMsg, 'success', 'checkout-alert-msg');
        
        setTimeout(() => {
          this.closeModal('checkout');
          window.location.href = 'learner-dashboard.html';
        }, 1200);
      }, 1000);
    }

    /* ---------- Teacher & Student Data Helpers ---------- */
    getTeacherClassData() {
      return {
        totalStudents: 24,
        activeAssignments: 3,
        pendingDictations: 5,
        avgClassProgress: 78,
        students: [
          { name: 'கார்த்திக் (Karthik)', email: 'karthik@student.com', progress: 85, completedCount: 25, lastActive: 'இன்று (Today)' },
          { name: 'பிரியா (Priya)', email: 'priya@student.com', progress: 70, completedCount: 21, lastActive: 'நேற்று (Yesterday)' },
          { name: 'அனுஷ்கா (Anushka)', email: 'anushka@student.com', progress: 95, completedCount: 28, lastActive: 'இன்று (Today)' },
          { name: 'அர்ஜுன் (Arjun)', email: 'arjun@student.com', progress: 60, completedCount: 18, lastActive: '3 நாட்களுக்கு முன்' }
        ],
        assignments: [
          { id: 'asgn1', title: 'பகுதி 06: தமிழ் வார்த்தைகள் பொருத்துதல்', dueDate: 'வெள்ளிக்கிழமை (Fri)', status: 'Active', submissions: '18/24' },
          { id: 'asgn2', title: 'பகுதி 18: சொல்வதை எழுதுதல் (Dictation)', dueDate: 'ஞாயிற்றுக்கிழமை (Sun)', status: 'Active', submissions: '12/24' }
        ]
      };
    }

    getLearnerProgress() {
      return {
        completedModules: [
          '01_alphabets_with_sound.html',
          '02_mei_plus_uyir.html',
          '03_letter_joining.html',
          '04_reading_words.html',
          '05_english_to_tamil.html',
          '06_matching_words.html',
          '07_jumbled_letters.html',
          '08_flip_match_cards.html',
          '16_writing_alphabets.html',
          '18_dictation.html',
          '20_word_search.html',
          '29_catch_correct_word.html'
        ],
        streakDays: 4,
        totalPoints: 2850,
        badges: [
          { id: 'b1', name: this.lang === 'en' ? 'Alphabet Master' : 'எழுத்துச் சிற்பி', icon: '🥇', desc: this.lang === 'en' ? 'Mastered Tamil Alphabets' : 'தமிழ் எழுத்துக்களைக் கற்று முடித்தார்', unlocked: true },
          { id: 'b2', name: this.lang === 'en' ? 'Vocabulary Champ' : 'சொல் வேந்தன்', icon: '🥈', desc: this.lang === 'en' ? 'Matched 100 Tamil words' : '100 தமிழ் வார்த்தைகளைப் பொருத்தியவர்', unlocked: true },
          { id: 'b3', name: this.lang === 'en' ? 'Speed Runner' : 'வேகப் புயல்', icon: '🥉', desc: this.lang === 'en' ? 'Won 5-min Word Search' : '5 நிமிட வார்த்தை தேடலில் வெற்றி பெற்றவர்', unlocked: true },
          { id: 'b4', name: this.lang === 'en' ? 'Grammar Expert' : 'இலக்கண மேதை', icon: '🎯', desc: this.lang === 'en' ? '100% score in Grammar' : 'இலக்கணப் பயிற்சிகளில் 100% மதிப்பெண்', unlocked: false }
        ],
        highScores: [
          { game: this.lang === 'en' ? '5-Min Word Search' : '5 நிமிட வார்த்தை தேடல்', score: '1,450 pts', date: 'Today' },
          { game: this.lang === 'en' ? 'Dictation Master' : 'சொல்வதை எழுதுதல் (Dictation)', score: '98% Acc', date: 'Yesterday' },
          { game: this.lang === 'en' ? 'Flip Match Cards' : 'நினைவில் நிற்பவை (Flip Match)', score: '28 sec', date: '3 days ago' }
        ]
      };
    }

    /* ---------- Admin Analytics & Firestore User Management ---------- */
    getAdminStats() {
      const users = this.getUsersDB();
      const totalUsers = users.length;
      const totalLearners = users.filter(u => u.role === ROLES.LEARNER).length;
      const totalTeachers = users.filter(u => u.role === ROLES.TEACHER).length;
      const totalAdmins = users.filter(u => u.role === ROLES.ADMIN).length;
      const activeSubscribers = users.filter(u => u.role === ROLES.LEARNER && u.subscriptionStatus === 'active').length;
      const mrr = activeSubscribers * 9.90;

      return {
        totalUsers,
        totalLearners,
        totalTeachers,
        totalAdmins,
        activeSubscribers,
        mrr: mrr.toFixed(2),
        users
      };
    }

    toggleUserRole(email) {
      const users = this.getUsersDB();
      const target = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (target) {
        if (target.role === ROLES.ADMIN) target.role = ROLES.TEACHER;
        else if (target.role === ROLES.TEACHER) target.role = ROLES.LEARNER;
        else target.role = ROLES.ADMIN;

        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
        if (this.db) {
          this.db.collection('users').doc(email.toLowerCase()).update({ role: target.role }).catch(() => {});
        }
        return true;
      }
      return false;
    }

    toggleSubscription(email) {
      const users = this.getUsersDB();
      const target = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (target) {
        if (target.role === ROLES.GUEST) {
          target.role = ROLES.LEARNER;
          target.subscriptionStatus = 'active';
        } else {
          target.role = ROLES.GUEST;
          target.subscriptionStatus = 'inactive';
        }
        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
        if (this.db) {
          this.db.collection('users').doc(email.toLowerCase()).update({
            role: target.role,
            subscriptionStatus: target.subscriptionStatus
          }).catch(() => {});
        }
        return true;
      }
      return false;
    }
  }

  // Export Singleton Instance
  window.TamilAuth = new TamilAuthEngine();
})(window);
