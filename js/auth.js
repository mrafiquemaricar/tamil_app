/**
 * ==========================================================================
 * Tamil App - Authentication & Access Control Core Engine (TamilAuth)
 * ==========================================================================
 */

(function (window) {
  'use strict';

  // Key Constants
  const STORAGE_KEY_USER = 'tamil_app_current_user';
  const STORAGE_KEY_USERS_DB = 'tamil_app_users_db';

  // Role Definitions
  const ROLES = {
    GUEST: 'guest',
    LEARNER: 'learner',
    ADMIN: 'admin'
  };

  // Module Access Levels Hierarchy: guest (level 1) < learner (level 2) < admin (level 3)
  const ROLE_HIERARCHY = {
    guest: 1,
    learner: 2,
    admin: 3
  };

  // Module Access Mapping
  const MODULE_ROLES = {
    'index.html': 'guest',
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

  // Default Initial Mock Users
  const INITIAL_USERS = [
    { email: 'admin@tamil.app', name: 'ஆசிரியர் (Teacher)', password: 'admin123', role: ROLES.ADMIN },
    { email: 'student@tamil.app', name: 'மாணவர் (Student)', password: 'student123', role: ROLES.LEARNER }
  ];

  // Localization Dictionary
  const I18N = {
    ta: {
      appName: 'தமிழ். இனிது. எளிது.',
      login: 'உள்நுழைவு',
      register: 'பதிவு செய்க',
      logout: 'வெளியேறு',
      guest: 'விருந்தினர்',
      learner: 'மாணவர்',
      admin: 'ஆசிரியர்',
      emailLabel: 'மின்னஞ்சல் முகவரி',
      passwordLabel: 'கடவுச்சொல்',
      nameLabel: 'பெயர்',
      enterAsGuest: 'விருந்தினராக தொடரவும்',
      accessDeniedTitle: 'அணுகல் மறுக்கப்பட்டது 🔒',
      accessDeniedMsg: 'இந்தப் பகுதியை அணுக நீங்கள் உள்நுழைய அல்லது கணக்கை உயர்த்த வேண்டும்.',
      demoHeader: 'விரைவு சோதனை கணக்குகள் (Demo Accounts):',
      loginSuccess: 'வெற்றிகரமாக உள்நுழைந்தீர்கள்!',
      loginError: 'தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்!',
      registerSuccess: 'கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது! இப்போது உள்நுழையவும்.',
      userExists: 'இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது!'
    },
    en: {
      appName: 'Tamil Learning App',
      login: 'Sign In',
      register: 'Sign Up',
      logout: 'Sign Out',
      guest: 'Guest',
      learner: 'Learner',
      admin: 'Teacher/Admin',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      nameLabel: 'Full Name',
      enterAsGuest: 'Continue as Guest',
      accessDeniedTitle: 'Access Restricted 🔒',
      accessDeniedMsg: 'You need to sign in or upgrade your access level to view this module.',
      demoHeader: 'Quick Demo Login:',
      loginSuccess: 'Signed in successfully!',
      loginError: 'Invalid email or password!',
      registerSuccess: 'Account created! Please sign in.',
      userExists: 'An account with this email already exists!'
    }
  };

  class TamilAuthEngine {
    constructor() {
      this.initDatabase();
      this.currentUser = this.loadSession();
    }

    initDatabase() {
      if (!localStorage.getItem(STORAGE_KEY_USERS_DB)) {
        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(INITIAL_USERS));
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
      return { name: I18N.ta.guest, role: ROLES.GUEST, email: 'guest@tamil.app' };
    }

    login(email, password) {
      const users = this.getUsersDB();
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (found) {
        const userSession = { email: found.email, name: found.name, role: found.role };
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userSession));
        this.currentUser = userSession;
        return { success: true, user: userSession };
      }
      return { success: false, message: I18N.ta.loginError };
    }

    register(name, email, password, role = ROLES.LEARNER) {
      const users = this.getUsersDB();
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: I18N.ta.userExists };
      }
      const newUser = { name, email, password, role };
      users.push(newUser);
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
      return { success: true, message: I18N.ta.registerSuccess };
    }

    logout() {
      localStorage.removeItem(STORAGE_KEY_USER);
      this.currentUser = { name: I18N.ta.guest, role: ROLES.GUEST, email: 'guest@tamil.app' };
      window.location.reload();
    }

    getCurrentUser() {
      return this.currentUser;
    }

    getRoleLevel(roleName) {
      return ROLE_HIERARCHY[roleName] || 1;
    }

    canAccess(modulePath) {
      const filename = modulePath.split('/').pop().split('?')[0] || 'index.html';
      const requiredRole = MODULE_ROLES[filename] || 'guest';
      const userLevel = this.getRoleLevel(this.currentUser.role);
      const requiredLevel = this.getRoleLevel(requiredRole);
      return userLevel >= requiredLevel;
    }

    getRequiredRole(filename) {
      return MODULE_ROLES[filename] || 'guest';
    }

    /* ---------- Header Navigation UI Render ---------- */
    renderHeader(container) {
      const user = this.currentUser;
      const isGuest = user.role === ROLES.GUEST;
      const roleLabel = I18N.ta[user.role] || user.role;

      const headerHTML = `
        <header class="tamil-app-header">
          <a href="index.html" class="header-brand">
            <span class="header-brand-logo">த</span>
            <span>தமிழ். இனிது. எளிது.</span>
          </a>
          <div class="header-user-nav">
            <div class="header-user-badge">
              <span>👤 ${user.name}</span>
              <span class="role-badge role-${user.role}">${roleLabel}</span>
            </div>
            ${
              isGuest
                ? `<button class="header-btn" onclick="TamilAuth.openModal('login')">🔑 ${I18N.ta.login}</button>`
                : `<button class="header-btn header-btn-secondary" onclick="TamilAuth.logout()">🚪 ${I18N.ta.logout}</button>`
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

        const currentFile = window.location.pathname.split('/').pop() || 'index.html';
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
        const requiredRole = MODULE_ROLES[href] || 'guest';
        const requiredLevel = this.getRoleLevel(requiredRole);

        if (userLevel < requiredLevel) {
          link.classList.add('locked-module');
          const badgeText = requiredRole === 'admin' ? 'ஆசிரியர்' : 'மாணவர்';
          const tag = document.createElement('span');
          tag.className = 'level-tag';
          tag.innerText = badgeText;
          link.appendChild(tag);

          link.addEventListener('click', (e) => {
            e.preventDefault();
            this.openModal('login');
          });
        }
      });
    }

    /* ---------- Render Access Denied View ---------- */
    renderAccessDenied(currentFile) {
      const requiredRole = this.getRequiredRole(currentFile);
      const roleLabel = I18N.ta[requiredRole] || requiredRole;
      
      const main = document.querySelector('main') || document.body;
      main.innerHTML = `
        <div class="access-denied-container">
          <div class="access-denied-icon">🔒</div>
          <h2 class="access-denied-title">${I18N.ta.accessDeniedTitle}</h2>
          <p class="access-denied-desc">
            "${currentFile}" பகுதிக்குச் செல்ல <strong>${roleLabel}</strong> அனுமதி தேவை.<br>
            தயவுசெய்து உள்நுழையவும் அல்லது புதிய கணக்கை உருவாக்கவும்.
          </p>
          <div style="display:flex; gap:12px; justify-content:center;">
            <button class="header-btn" style="background:#4f46e5; color:#fff;" onclick="TamilAuth.openModal('login')">🔑 ${I18N.ta.login}</button>
            <a href="index.html" class="header-btn header-btn-secondary" style="background:#f3f4f6; color:#374151;">🏠 முகப்பு</a>
          </div>
        </div>
      `;
    }

    /* ---------- Modal Component Builder & Handlers ---------- */
    buildAuthModal() {
      if (document.getElementById('tamil-auth-modal-root')) return;

      const modalHTML = `
        <div id="tamil-auth-modal-root" class="auth-modal-overlay">
          <div class="auth-modal-card">
            <button class="auth-modal-close" onclick="TamilAuth.closeModal()">&times;</button>
            
            <div class="auth-tabs">
              <button id="tab-btn-login" class="auth-tab-btn active" onclick="TamilAuth.switchTab('login')">${I18N.ta.login}</button>
              <button id="tab-btn-register" class="auth-tab-btn" onclick="TamilAuth.switchTab('register')">${I18N.ta.register}</button>
            </div>

            <div id="auth-alert-msg" class="auth-alert"></div>

            <!-- Login Form -->
            <form id="auth-form-login" onsubmit="TamilAuth.handleLogin(event)">
              <div class="auth-form-group">
                <label>${I18N.ta.emailLabel}</label>
                <input type="email" id="login-email" class="auth-form-input" placeholder="student@tamil.app" required />
              </div>
              <div class="auth-form-group">
                <label>${I18N.ta.passwordLabel}</label>
                <input type="password" id="login-password" class="auth-form-input" placeholder="••••••••" required />
              </div>
              <button type="submit" class="auth-submit-btn">${I18N.ta.login}</button>
            </form>

            <!-- Register Form -->
            <form id="auth-form-register" style="display:none;" onsubmit="TamilAuth.handleRegister(event)">
              <div class="auth-form-group">
                <label>${I18N.ta.nameLabel}</label>
                <input type="text" id="reg-name" class="auth-form-input" placeholder="உங்கள் பெயர்" required />
              </div>
              <div class="auth-form-group">
                <label>${I18N.ta.emailLabel}</label>
                <input type="email" id="reg-email" class="auth-form-input" placeholder="user@example.com" required />
              </div>
              <div class="auth-form-group">
                <label>${I18N.ta.passwordLabel}</label>
                <input type="password" id="reg-password" class="auth-form-input" placeholder="••••••••" required />
              </div>
              <button type="submit" class="auth-submit-btn">${I18N.ta.register}</button>
            </form>

            <!-- Demo Quick Accounts -->
            <div class="demo-accounts-box">
              <h4>${I18N.ta.demoHeader}</h4>
              <div class="demo-btn-group">
                <button type="button" class="demo-btn" onclick="TamilAuth.fillDemo('student@tamil.app', 'student123')">🎓 மாணவர் (Learner)</button>
                <button type="button" class="demo-btn" onclick="TamilAuth.fillDemo('admin@tamil.app', 'admin123')">👑 ஆசிரியர் (Admin)</button>
              </div>
            </div>
          </div>
        </div>
      `;

      const wrapper = document.createElement('div');
      wrapper.innerHTML = modalHTML;
      document.body.appendChild(wrapper.firstElementChild);
    }

    openModal(tab = 'login') {
      const modal = document.getElementById('tamil-auth-modal-root');
      if (modal) {
        this.switchTab(tab);
        modal.classList.add('active');
      }
    }

    closeModal() {
      const modal = document.getElementById('tamil-auth-modal-root');
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

    showAlert(msg, type = 'error') {
      const alertBox = document.getElementById('auth-alert-msg');
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
        this.showAlert(I18N.ta.loginSuccess, 'success');
        setTimeout(() => {
          this.closeModal();
          window.location.reload();
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
      const res = this.register(name, email, pass, ROLES.LEARNER);

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
  }

  // Export Singleton Instance
  window.TamilAuth = new TamilAuthEngine();
})(window);
