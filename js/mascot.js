/**
 * ==========================================================================
 * Tamil App - Kavin Mascot Floating Tutor Companion Engine
 * ==========================================================================
 */

(function (window) {
  'use strict';

  // Speech Bubble Messages Map per Page/Module
  const MASCOT_MESSAGES = {
    'index.html': {
      ta: 'வணக்கம்! நான் கவின் 👦. 30 விளையாட்டுகள் மூலம் எளிதாக தமிழ் கற்கலாம் வாங்க!',
      en: 'Hello! I am Kavin 👦. Let\'s learn Tamil through 30 fun games!'
    },
    'learner-dashboard.html': {
      ta: 'அற்புதம்! 🌟 உங்கள் 4-நாள் தொடர் பயிற்சியைப் பார்த்து மகிழ்ச்சி!',
      en: 'Awesome! 🌟 Great job on keeping your 4-day practice streak going!'
    },
    'teacher-dashboard.html': {
      ta: 'வணக்கம் ஆசிரியர்! 📘 மாணவர்களின் முன்னேற்றத்தை இங்கு காணலாம்.',
      en: 'Welcome Teacher! 📘 You can monitor class progress and homework here.'
    },
    'admin.html': {
      ta: 'நிர்வாக பலகைக்கு நல்வரவு! 📊 சந்தாதாரர் விபரங்கள் தயார்.',
      en: 'Welcome Admin! 📊 Analytics & Subscriber metrics are ready.'
    },
    'login.html': {
      ta: 'வணக்கம்! உங்கள் கணக்கில் உள்நுழைந்து கற்றலைத் தொடருங்கள் 🔑',
      en: 'Welcome! Sign in to continue your Tamil learning journey 🔑'
    },
    '01_alphabets_with_sound.html': {
      ta: 'ஒவ்வொரு தமிழ் எழுத்தின் மீதும் கிளிக் செய்து ஒலி கேட்கவும்! 🔊',
      en: 'Click on any Tamil alphabet to hear its correct pronunciation! 🔊'
    },
    '18_dictation.html': {
      ta: 'கவனமாகக் கேட்டு சரியான தமிழ் வார்த்தையை தட்டச்சு செய்யவும் ✍️',
      en: 'Listen carefully to the audio and type the correct Tamil word! ✍️'
    },
    '20_word_search.html': {
      ta: '5 நிமிடங்களில் எத்தனை தமிழ் வார்த்தைகளைக் கண்டுபிடிக்க முடியும்? 🚀',
      en: 'How many Tamil words can you find within 5 minutes? 🚀'
    },
    '17_voice_to_text.html': {
      ta: 'மைக் பட்டனை அழுத்தி தமிழில் பேசுங்கள், கணினி தட்டச்சு செய்யும்! 🎤',
      en: 'Tap the mic button and speak in Tamil - AI will type for you! 🎤'
    },
    'default': {
      ta: 'வாருங்கள்! இந்தப் பயிற்சியை மகிழ்ச்சியாக செய்து முடிப்போம் 🎯',
      en: 'Come on! Let\'s complete this fun exercise together 🎯'
    }
  };

  class KavinMascot {
    constructor() {
      this.isCollapsed = false;
      this.currentFile = this.getNormalizedFilename();
      this.init();
    }

    getNormalizedFilename() {
      const file = window.location.pathname.split('/').pop().split('?')[0] || 'index.html';
      if (file === '' || file === '/') return 'index.html';
      return file.includes('.') ? file : file + '.html';
    }

    init() {
      document.addEventListener('DOMContentLoaded', () => {
        this.renderWidget();
      });
    }

    getCurrentMessage() {
      const lang = window.TamilAuth ? window.TamilAuth.getLang() : 'ta';
      const msgObj = MASCOT_MESSAGES[this.currentFile] || MASCOT_MESSAGES['default'];
      return msgObj[lang] || msgObj['ta'];
    }

    renderWidget() {
      if (document.getElementById('kavin-mascot-root')) return;

      const message = this.getCurrentMessage();
      const mascotHTML = `
        <div id="kavin-mascot-root">
          <div id="mascot-bubble" class="mascot-speech-bubble">
            <div class="mascot-bubble-header">
              <div class="mascot-name-badge">
                <span>👦 கவின் (Kavin)</span>
              </div>
              <div class="mascot-controls">
                <button class="mascot-action-btn" title="Speak Speech" onclick="KavinMascotEngine.speakMessage()">🔊</button>
                <button class="mascot-action-btn" title="Close" onclick="KavinMascotEngine.toggleBubble()">&times;</button>
              </div>
            </div>
            <p class="mascot-speech-text" id="mascot-text">${message}</p>
          </div>

          <div class="mascot-avatar-wrapper" onclick="KavinMascotEngine.onAvatarClick()">
            <img src="/images/kavin_mascot.jpg" alt="Kavin Mascot" class="mascot-avatar-img" />
            <div class="mascot-pulse-ring"></div>
          </div>
        </div>
      `;

      const wrapper = document.createElement('div');
      wrapper.innerHTML = mascotHTML;
      document.body.appendChild(wrapper.firstElementChild);
    }

    toggleBubble() {
      const bubble = document.getElementById('mascot-bubble');
      if (bubble) {
        if (bubble.style.display === 'none') {
          bubble.style.display = 'block';
          this.isCollapsed = false;
        } else {
          bubble.style.display = 'none';
          this.isCollapsed = true;
        }
      }
    }

    onAvatarClick() {
      const bubble = document.getElementById('mascot-bubble');
      if (bubble && bubble.style.display === 'none') {
        bubble.style.display = 'block';
        this.isCollapsed = false;
      } else {
        this.speakMessage();
      }
    }

    speakMessage() {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const text = document.getElementById('mascot-text').innerText;
        const utterance = new SpeechSynthesisUtterance(text);
        const lang = window.TamilAuth ? window.TamilAuth.getLang() : 'ta';
        utterance.lang = lang === 'en' ? 'en-US' : 'ta-IN';
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    }

    updateSpeech(newMsgText) {
      const textElem = document.getElementById('mascot-text');
      const bubble = document.getElementById('mascot-bubble');
      if (textElem) {
        textElem.innerText = newMsgText;
      }
      if (bubble && bubble.style.display === 'none') {
        bubble.style.display = 'block';
      }
    }
  }

  // Export Singleton
  window.KavinMascotEngine = new KavinMascot();
})(window);
