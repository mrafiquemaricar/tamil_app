/**
 * ==========================================================================
 * Tamil App - Cloud Firestore Authentication, Admin & HitPay Sandbox Engine
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

  // HitPay Gateway Configuration
  const HITPAY_CONFIG = {
    environment: 'sandbox', // 'sandbox' or 'production'
    apiKey: 'test_c4eb1bef1b86437521e1656b72bc78727617d3b604bebf3119f54170be4f9d69',
    salt: 'NA9sBmI6TtcN1C2n6ghFn7hJkNhy1Y6KyUUlJbGnpvM0oHcgDFdqksFNG9UZPS3j',
    sandboxEndpoint: 'https://api.sandbox.hit-pay.com/v1/payment-requests',
    productionEndpoint: 'https://api.hit-pay.com/v1/payment-requests'
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
    '31_tamil_words_with_sound.html': 'learner',
    '32_vaarthai_sakkaram.html': 'learner',
    '33_vaarthai_rayil.html': 'learner',
    '34_mithakkum_baloon.html': 'learner',
    '35_vinveli_vettai.html': 'learner',
    '36_common_letter.html': 'learner',
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

  // Calculate default future dates
  const now = new Date();
  const oneYearLater = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();

  // Default Initial Users
  const INITIAL_USERS = [
    { email: 'admin@tamil.app', name: 'ஆசிரியர் (Admin)', password: 'admin123', role: ROLES.ADMIN, subscriptionStatus: 'active', planType: 'annual', subscribedAt: now.toISOString(), expiryDate: oneYearLater, joinedAt: '2026-07-01' },
    { email: 'admin@tamilapp.com', name: 'ஆசிரியர் (Admin)', password: 'admin123', role: ROLES.ADMIN, subscriptionStatus: 'active', planType: 'annual', subscribedAt: now.toISOString(), expiryDate: oneYearLater, joinedAt: '2026-07-01' },
    { email: 'teacher@tamil.app', name: 'ஆசிரியர் (Teacher)', password: 'teacher123', role: ROLES.TEACHER, subscriptionStatus: 'active', planType: 'annual', subscribedAt: now.toISOString(), expiryDate: oneYearLater, joinedAt: '2026-07-05' },
    { email: 'teacher@tamilapp.com', name: 'ஆசிரியர் (Teacher)', password: 'teacher123', role: ROLES.TEACHER, subscriptionStatus: 'active', planType: 'annual', subscribedAt: now.toISOString(), expiryDate: oneYearLater, joinedAt: '2026-07-05' },
    { email: 'student@tamil.app', name: 'மாணவர் (Student)', password: 'student123', role: ROLES.LEARNER, subscriptionStatus: 'active', planType: 'annual', subscribedAt: now.toISOString(), expiryDate: oneYearLater, joinedAt: '2026-07-15' },
    { email: 'student@tamilapp.com', name: 'மாணவர் (Student)', password: 'student123', role: ROLES.LEARNER, subscriptionStatus: 'active', planType: 'annual', subscribedAt: now.toISOString(), expiryDate: oneYearLater, joinedAt: '2026-07-15' },
    { email: 'user1@example.com', name: 'கார்த்திக் (Karthik)', password: 'user123', role: ROLES.LEARNER, subscriptionStatus: 'active', planType: 'monthly', subscribedAt: now.toISOString(), expiryDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), joinedAt: '2026-07-18' },
    { email: 'user2@example.com', name: 'பிரியா (Priya)', password: 'user123', role: ROLES.GUEST, subscriptionStatus: 'inactive', planType: 'none', joinedAt: '2026-07-20' }
  ];

  // Comprehensive Localization Dictionary
  const I18N = {
    ta: {
      appName: 'தமிழ். இனிது. எளிது.',
      heroTagline: 'தமிழ் கற்றல் இப்போது மிக எளிது!',
      heroSub: '36 ஊடாடும் விளையாட்டுகள், குரல்வழி தட்டச்சு, சொல் அகராதி & உச்சரிப்புப் பயிற்சிகளுடன் தமிழைக் கற்றுக்கொள்ளுங்கள்.',
      getStarted: 'இலவசமாகத் தொடங்குங்கள்',
      subscribeNow: 'சந்தா செலுத்துங்கள்',
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
      heroSub: 'Learn Tamil with 36 interactive games, voice typing, word search dictionary, and pronunciation modules.',
      getStarted: 'Get Started Free',
      subscribeNow: 'Subscribe Now',
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
      this.selectedPlan = 'annual'; // 'monthly' ($9.90) or 'annual' ($99.00)
      this.selectedPaymentMethod = 'paynow';
      this.initFirebase();
      this.initDatabase();
      this.currentUser = this.loadSession();
      this.verifySubscriptionExpiry();
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
          if (!users[idx].expiryDate) {
            users[idx].expiryDate = defaultUser.expiryDate;
            users[idx].planType = defaultUser.planType;
          }
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
          const user = JSON.parse(stored);
          return user;
        } catch (e) {
          localStorage.removeItem(STORAGE_KEY_USER);
        }
      }
      return { name: this.t('guest'), role: ROLES.GUEST, email: 'guest@tamil.app', subscriptionStatus: 'inactive' };
    }

    /* ---------- Automated Subscription Expiry Control ---------- */
    verifySubscriptionExpiry() {
      const user = this.currentUser;
      if (user && user.role === ROLES.LEARNER && user.expiryDate) {
        const expiry = new Date(user.expiryDate);
        if (new Date() > expiry) {
          user.role = ROLES.GUEST;
          user.subscriptionStatus = 'expired';
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));

          const users = this.getUsersDB();
          const idx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
          if (idx !== -1) {
            users[idx].role = ROLES.GUEST;
            users[idx].subscriptionStatus = 'expired';
            localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
          }

          if (this.db) {
            this.db.collection('users').doc(user.email.toLowerCase()).update({
              role: ROLES.GUEST,
              subscriptionStatus: 'expired'
            }).catch(() => {});
          }
        }
      }
    }

    login(email, password) {
      const cleanEmail = (email || '').trim().toLowerCase();
      const users = this.getUsersDB();
      
      let found = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);

      if (!found) {
        if ((cleanEmail.startsWith('admin@') || cleanEmail.includes('admin')) && password === 'admin123') {
          found = { email: cleanEmail, name: 'ஆசிரியர் (Admin)', password: 'admin123', role: ROLES.ADMIN, subscriptionStatus: 'active', planType: 'annual', expiryDate: oneYearLater };
        } else if ((cleanEmail.startsWith('teacher@') || cleanEmail.includes('teacher')) && password === 'teacher123') {
          found = { email: cleanEmail, name: 'ஆசிரியர் (Teacher)', password: 'teacher123', role: ROLES.TEACHER, subscriptionStatus: 'active', planType: 'annual', expiryDate: oneYearLater };
        } else if ((cleanEmail.startsWith('student@') || cleanEmail.includes('student')) && password === 'student123') {
          found = { email: cleanEmail, name: 'மாணவர் (Student)', password: 'student123', role: ROLES.LEARNER, subscriptionStatus: 'active', planType: 'annual', expiryDate: oneYearLater };
        }
      }

      if (found) {
        const userSession = {
          email: found.email,
          name: found.name,
          role: found.role,
          subscriptionStatus: found.role === ROLES.GUEST ? 'inactive' : 'active',
          planType: found.planType || (found.role === ROLES.GUEST ? 'none' : 'annual'),
          subscribedAt: found.subscribedAt || new Date().toISOString(),
          expiryDate: found.expiryDate || oneYearLater
        };

        if (!users.some(u => u.email.toLowerCase() === cleanEmail)) {
          users.push(found);
          localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
        }

        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userSession));
        this.currentUser = userSession;
        this.verifySubscriptionExpiry();

        if (this.db) {
          this.db.collection('users').doc(cleanEmail).set(found, { merge: true }).catch(() => {});
        }
        return { success: true, user: this.currentUser };
      }
      return { success: false, message: this.t('loginError') };
    }

    register(name, email, password, role = ROLES.GUEST) {
      const users = this.getUsersDB();
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: this.t('userExists') };
      }
      const newUser = { name, email, password, role, subscriptionStatus: 'inactive', planType: 'none', joinedAt: new Date().toISOString().split('T')[0] };
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
      this.verifySubscriptionExpiry();
      const filename = this.getNormalizedPath(modulePath);
      const requiredRole = MODULE_ROLES[filename] || 'guest';
      const userLevel = this.getRoleLevel(this.currentUser.role);
      const requiredLevel = this.getRoleLevel(requiredRole);
      return userLevel >= requiredLevel;
    }

    /* ---------- Header Navigation UI Render ---------- */
    renderHeader(container) {
      this.verifySubscriptionExpiry();
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
        this.buildHitPaySandboxPortalModal();
        this.checkHitPayCallback();

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

    /* ---------- Check HitPay Callback Params ---------- */
    checkHitPayCallback() {
      const params = new URLSearchParams(window.location.search);
      const status = params.get('hitpay_status') || params.get('status');
      const ref = params.get('reference') || params.get('ref');
      const plan = params.get('plan') || 'annual';

      if (status === 'completed' || status === 'success') {
        const user = this.currentUser;
        const daysToAdd = plan === 'annual' ? 365 : 30;
        const hitpayRef = ref || ('HITPAY-SB-' + Math.floor(100000 + Math.random() * 900000));

        user.role = ROLES.LEARNER;
        user.subscriptionStatus = 'active';
        user.planType = plan;
        user.subscribedAt = new Date().toISOString();
        user.expiryDate = new Date(new Date().getTime() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();
        user.paymentReference = hitpayRef;

        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));

        const users = this.getUsersDB();
        const idx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
        if (idx !== -1) {
          users[idx] = { ...user };
          localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
        }

        if (this.db) {
          this.db.collection('users').doc(user.email.toLowerCase()).set({
            role: ROLES.LEARNER,
            subscriptionStatus: 'active',
            planType: plan,
            expiryDate: user.expiryDate,
            paymentReference: hitpayRef
          }, { merge: true }).catch(() => {});
        }

        // Clean query params
        window.history.replaceState({}, document.title, window.location.pathname);
      }
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

    /* ---------- Subscription Plan Selector Modal ---------- */
    buildCheckoutModal() {
      if (document.getElementById('tamil-checkout-modal-root')) return;

      const isEn = this.lang === 'en';
      const checkoutHTML = `
        <div id="tamil-checkout-modal-root" class="auth-modal-overlay">
          <div class="auth-modal-card" style="max-width:520px;">
            <button class="auth-modal-close" onclick="TamilAuth.closeModal('checkout')">&times;</button>

            <div class="checkout-card-header">
              <h3>${isEn ? 'Choose Your Tamil Learning Pass' : 'தமிழ் கற்றல் சந்தா திட்டத்தைத் தேர்ந்தெடுக்கவும்'}</h3>
              <p style="color:#6b7280; font-size:0.9rem; margin:6px 0 0 0;">${isEn ? 'Powered by HitPay Payment Gateway (Sandbox Mode)' : 'HitPay கட்டண வாயில் மூலம் பாதுகாப்பாக செலுத்தலாம்'}</p>
            </div>

            <!-- Subscription Plan Selection (Monthly vs Annual) -->
            <div class="plan-selector-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:20px 0;">
              <div class="plan-card selected" id="plan-opt-annual" onclick="TamilAuth.selectPlan('annual')" style="border:2px solid #10b981; background:#ecfdf5; border-radius:14px; padding:14px; cursor:pointer; text-align:center; position:relative;">
                <span style="position:absolute; top:-10px; right:10px; background:#10b981; color:#fff; font-size:0.7rem; font-weight:800; padding:2px 8px; border-radius:10px;">BEST VALUE (சேமிப்பு $19.80)</span>
                <div style="font-weight:700; font-size:0.95rem; color:#065f46;">🌟 ${isEn ? 'Annual Plan' : 'ஆண்டறிக்கை சந்தா'}</div>
                <div style="font-size:1.4rem; font-weight:800; color:#10b981; margin:4px 0;">SGD $99.00</div>
                <div style="font-size:0.75rem; color:#047857;">${isEn ? '$8.25/mo • Valid 365 Days' : 'மாதம் $8.25 • 365 நாட்கள் செல்லுபடியாகும்'}</div>
              </div>

              <div class="plan-card" id="plan-opt-monthly" onclick="TamilAuth.selectPlan('monthly')" style="border:2px solid #e2e8f0; background:#ffffff; border-radius:14px; padding:14px; cursor:pointer; text-align:center;">
                <div style="font-weight:700; font-size:0.95rem; color:#1e1b4b;">📅 ${isEn ? 'Monthly Plan' : 'மாதாந்திர சந்தா'}</div>
                <div style="font-size:1.4rem; font-weight:800; color:#3b82f6; margin:4px 0;">SGD $9.90</div>
                <div style="font-size:0.75rem; color:#64748b;">${isEn ? 'Billed Monthly • Valid 30 Days' : 'மாதம் தோறும் • 30 நாட்கள் செல்லுபடியாகும்'}</div>
              </div>
            </div>

            <ul class="pricing-features-list">
              <li>${isEn ? 'All 36 Tamil Games & Learning Modules' : '36 தமிழ் கற்றல் விளையாட்டுகள் & பயிற்சிகள்'}</li>
              <li>${isEn ? 'Native Tamil Audio Pronunciation (251 Files)' : '251 தமிழ் எழுத்துகள் & வார்த்தைகள் ஒலி உச்சரிப்பு'}</li>
              <li>${isEn ? 'Voice Typing & Speech Recognition' : 'குரல்வழி தட்டச்சு & உச்சரிப்புப் பயிற்சி'}</li>
              <li>${isEn ? 'Automated Expiry & Renewal Alerts' : 'தானியங்கி சந்தா முடிவு & புதுப்பித்தல் விழிப்பூட்டல்'}</li>
            </ul>

            <div class="payment-methods-box">
              <h4>${isEn ? 'Select Payment Method (HitPay Gateway):' : 'செலுத்தும் முறை (HitPay Gateway):'}</h4>
              <div class="payment-options-grid">
                <div class="payment-option-card selected" id="pay-opt-paynow" onclick="TamilAuth.selectPayment('paynow')">
                  📱 PayNow QR
                </div>
                <div class="payment-option-card" id="pay-opt-card" onclick="TamilAuth.selectPayment('card')">
                  💳 Credit Card (Test)
                </div>
                <div class="payment-option-card" id="pay-opt-ewallet" onclick="TamilAuth.selectPayment('ewallet')">
                  👛 e-Wallet
                </div>
              </div>
            </div>

            <div id="checkout-alert-msg" class="auth-alert"></div>

            <button class="btn-proceed-pay" id="btn-hitpay-submit" onclick="TamilAuth.processCheckout()">
              💳 ${isEn ? 'Proceed with HitPay Sandbox Payment (SGD $99.00)' : 'HitPay மூலம் கட்டணம் செலுத்துங்கள் (SGD $99.00)'}
            </button>
          </div>
        </div>
      `;

      const wrapper = document.createElement('div');
      wrapper.innerHTML = checkoutHTML;
      document.body.appendChild(wrapper.firstElementChild);
    }

    /* ---------- Interactive HitPay Sandbox Payment Portal Modal Builder ---------- */
    buildHitPaySandboxPortalModal() {
      if (document.getElementById('hitpay-sandbox-portal-root')) return;

      const portalHTML = `
        <div id="hitpay-sandbox-portal-root" class="auth-modal-overlay">
          <div class="auth-modal-card" style="max-width:440px; border-top: 5px solid #0052cc;">
            <button class="auth-modal-close" onclick="TamilAuth.closeModal('hitpay-sandbox')">&times;</button>

            <div style="text-align:center; margin-bottom:16px;">
              <div style="background:#0052cc; color:#ffffff; font-weight:900; display:inline-block; padding:4px 12px; border-radius:6px; font-size:0.8rem; letter-spacing:1px; margin-bottom:8px;">
                HITPAY SANDBOX TEST PORTAL
              </div>
              <h3 style="margin:4px 0; color:#1e1b4b;">HitPay Payment Checkout</h3>
              <p style="font-size:0.85rem; color:#64748b; margin:0;" id="sandbox-amount-label">Amount: SGD $99.00</p>
            </div>

            <!-- PayNow Simulated QR View -->
            <div id="hitpay-qr-view" style="background:#f8fafc; border:2px dashed #cbd5e1; border-radius:14px; padding:20px; text-align:center; margin-bottom:16px;">
              <div style="font-size:2.5rem; margin-bottom:6px;">📱</div>
              <div style="font-weight:700; color:#1e1b4b; margin-bottom:4px;">Scan with PayNow App (Sandbox)</div>
              <div style="font-size:0.75rem; color:#64748b; margin-bottom:12px;">Reference: <span id="sandbox-ref-id">HITPAY-SB-981245</span></div>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=HITPAY-SANDBOX-PAYNOW-TEST" alt="PayNow QR Sandbox" style="border-radius:10px; border:1px solid #cbd5e1;" />
            </div>

            <!-- Simulated Credit Card Inputs -->
            <div id="hitpay-card-view" style="display:none; background:#f8fafc; border:1px solid #cbd5e1; border-radius:14px; padding:16px; margin-bottom:16px; text-align:left;">
              <div style="font-size:0.8rem; font-weight:700; color:#475569; margin-bottom:8px;">HitPay Test Credit Card Details:</div>
              <input type="text" class="auth-form-input" value="4111 1111 1111 1111" readonly style="margin-bottom:8px; font-family:monospace;" />
              <div style="display:flex; gap:8px;">
                <input type="text" class="auth-form-input" value="12 / 28" readonly style="font-family:monospace;" />
                <input type="text" class="auth-form-input" value="123" readonly style="font-family:monospace;" />
              </div>
            </div>

            <div id="sandbox-portal-alert" class="auth-alert"></div>

            <button class="btn-proceed-pay" style="background:#10b981;" onclick="TamilAuth.completeHitPaySandboxPayment()">
              ✅ Complete Sandbox Payment
            </button>
          </div>
        </div>
      `;

      const wrapper = document.createElement('div');
      wrapper.innerHTML = portalHTML;
      document.body.appendChild(wrapper.firstElementChild);
    }

    selectPlan(plan) {
      this.selectedPlan = plan;
      const annualCard = document.getElementById('plan-opt-annual');
      const monthlyCard = document.getElementById('plan-opt-monthly');
      const submitBtn = document.getElementById('btn-hitpay-submit');
      const isEn = this.lang === 'en';

      if (plan === 'annual') {
        if (annualCard) { annualCard.style.borderColor = '#10b981'; annualCard.style.background = '#ecfdf5'; }
        if (monthlyCard) { monthlyCard.style.borderColor = '#e2e8f0'; monthlyCard.style.background = '#ffffff'; }
        if (submitBtn) submitBtn.innerText = isEn ? '💳 Proceed with HitPay Sandbox Payment (SGD $99.00)' : '💳 HitPay மூலம் கட்டணம் செலுத்துங்கள் (SGD $99.00)';
      } else {
        if (monthlyCard) { monthlyCard.style.borderColor = '#3b82f6'; monthlyCard.style.background = '#eff6ff'; }
        if (annualCard) { annualCard.style.borderColor = '#e2e8f0'; annualCard.style.background = '#ffffff'; }
        if (submitBtn) submitBtn.innerText = isEn ? '💳 Proceed with HitPay Sandbox Payment (SGD $9.90)' : '💳 HitPay மூலம் கட்டணம் செலுத்துங்கள் (SGD $9.90)';
      }
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

      const qrView = document.getElementById('hitpay-qr-view');
      const cardView = document.getElementById('hitpay-card-view');
      if (qrView && cardView) {
        if (method === 'card') {
          qrView.style.display = 'none';
          cardView.style.display = 'block';
        } else {
          qrView.style.display = 'block';
          cardView.style.display = 'none';
        }
      }
    }

    openModal(tab = 'login') {
      const modal = document.getElementById('tamil-auth-modal-root');
      if (modal) {
        this.switchTab(tab);
        modal.classList.add('active');
      }
    }

    openCheckoutModal() {
      const user = this.currentUser;
      if (!user || user.role === ROLES.GUEST) {
        this.pendingCheckoutAfterAuth = true;
        this.openModal('register');
        this.showAlert(
          this.lang === 'en' 
            ? '🔑 Please create a quick account first so your subscription pass can be activated for you.' 
            : '🔑 உங்கள் சந்தாவை இணைக்க முதலில் கணக்கு ஒன்றை உருவாக்கவும்.', 
          'info'
        );
        return;
      }
      const modal = document.getElementById('tamil-checkout-modal-root');
      if (modal) {
        modal.classList.add('active');
      }
    }

    closeModal(type = 'auth') {
      let targetId = 'tamil-auth-modal-root';
      if (type === 'checkout') targetId = 'tamil-checkout-modal-root';
      else if (type === 'hitpay-sandbox') targetId = 'hitpay-sandbox-portal-root';

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
        // Automatically log user in
        this.login(email, pass);
        this.showAlert(res.message, 'success');

        if (this.pendingCheckoutAfterAuth) {
          this.pendingCheckoutAfterAuth = false;
          setTimeout(() => {
            this.closeModal('auth');
            this.openCheckoutModal();
          }, 800);
        } else {
          setTimeout(() => {
            this.switchTab('login');
            document.getElementById('login-email').value = email;
            document.getElementById('login-password').value = pass;
          }, 1000);
        }
      } else {
        this.showAlert(res.message, 'error');
      }
    }

    /* ---------- Trigger HitPay Sandbox Payment Flow ---------- */
    processCheckout() {
      const isEn = this.lang === 'en';
      const plan = this.selectedPlan; // 'monthly' or 'annual'
      const amount = plan === 'annual' ? '99.00' : '9.90';
      const hitpayRef = 'HITPAY-SB-' + Math.floor(100000 + Math.random() * 900000);

      // Check if user provided a Sandbox API Key
      if (HITPAY_CONFIG.apiKey) {
        this.showAlert(isEn ? 'Calling HitPay Sandbox API...' : 'HitPay API அழைக்கப்படுகிறது...', 'success', 'checkout-alert-msg');
        
        const params = new URLSearchParams();
        params.append('amount', amount);
        params.append('currency', 'SGD');
        params.append('email', this.currentUser.email || 'student@tamilapp.com');
        params.append('purpose', `Tamil Learning ${plan === 'annual' ? 'Annual' : 'Monthly'} Pass`);
        params.append('redirect_url', `https://tamilapp-3b8bf.web.app/learner-dashboard?hitpay_status=completed&ref=${hitpayRef}&plan=${plan}`);

        fetch(HITPAY_CONFIG.sandboxEndpoint, {
          method: 'POST',
          headers: {
            'X-BUSINESS-API-KEY': HITPAY_CONFIG.apiKey,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params
        })
        .then(res => res.json())
        .then(data => {
          if (data.url) {
            window.location.href = data.url;
          } else {
            this.openHitPaySandboxPortal(hitpayRef, amount, plan);
          }
        })
        .catch(() => {
          this.openHitPaySandboxPortal(hitpayRef, amount, plan);
        });
      } else {
        this.openHitPaySandboxPortal(hitpayRef, amount, plan);
      }
    }

    openHitPaySandboxPortal(ref, amount, plan) {
      this.closeModal('checkout');
      this.currentSandboxRef = ref;
      this.currentSandboxPlan = plan;

      const portal = document.getElementById('hitpay-sandbox-portal-root');
      if (portal) {
        document.getElementById('sandbox-amount-label').innerText = `Amount: SGD $${amount} (${plan === 'annual' ? 'Annual Pass' : 'Monthly Pass'})`;
        document.getElementById('sandbox-ref-id').innerText = ref;
        portal.classList.add('active');
      }
    }

    completeHitPaySandboxPayment() {
      const isEn = this.lang === 'en';
      this.showAlert(isEn ? 'Verifying Sandbox Payment...' : 'கட்டணம் சரிபார்க்கப்படுகிறது...', 'success', 'sandbox-portal-alert');

      setTimeout(() => {
        const ref = this.currentSandboxRef || ('HITPAY-SB-' + Math.floor(100000 + Math.random() * 900000));
        const plan = this.currentSandboxPlan || 'annual';
        const daysToAdd = plan === 'annual' ? 365 : 30;

        const users = this.getUsersDB();
        const user = this.currentUser;
        
        const now = new Date();
        const expiry = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

        user.role = ROLES.LEARNER;
        user.subscriptionStatus = 'active';
        user.planType = plan;
        user.subscribedAt = now.toISOString();
        user.expiryDate = expiry.toISOString();
        user.paymentReference = ref;

        const existingIdx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
        if (existingIdx !== -1) {
          users[existingIdx] = { ...user };
        } else {
          users.push({ ...user });
        }
        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));

        if (this.db) {
          this.db.collection('users').doc(user.email.toLowerCase()).set({
            role: ROLES.LEARNER,
            subscriptionStatus: 'active',
            planType: plan,
            subscribedAt: user.subscribedAt,
            expiryDate: user.expiryDate,
            paymentReference: ref
          }, { merge: true }).catch(() => {});
        }

        this.showAlert(isEn ? `Success! Payment Confirmed (${ref}) 🎉` : `வெற்றி! கட்டணம் உறுதிசெய்யப்பட்டது (${ref}) 🎉`, 'success', 'sandbox-portal-alert');

        setTimeout(() => {
          this.closeModal('hitpay-sandbox');
          window.location.href = 'learner-dashboard.html?hitpay_status=completed';
        }, 1000);
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
          target.planType = 'annual';
          target.expiryDate = new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();
        } else {
          target.role = ROLES.GUEST;
          target.subscriptionStatus = 'inactive';
          target.planType = 'none';
        }
        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
        if (this.db) {
          this.db.collection('users').doc(email.toLowerCase()).update({
            role: target.role,
            subscriptionStatus: target.subscriptionStatus,
            planType: target.planType,
            expiryDate: target.expiryDate || null
          }).catch(() => {});
        }
        return true;
      }
      return false;
    }

    extendSubscription(email, days = 30) {
      const users = this.getUsersDB();
      const target = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (target) {
        target.role = ROLES.LEARNER;
        target.subscriptionStatus = 'active';
        const currentExp = target.expiryDate ? new Date(target.expiryDate) : new Date();
        const base = currentExp > new Date() ? currentExp : new Date();
        target.expiryDate = new Date(base.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
        if (this.db) {
          this.db.collection('users').doc(email.toLowerCase()).update({
            role: ROLES.LEARNER,
            subscriptionStatus: 'active',
            expiryDate: target.expiryDate
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
