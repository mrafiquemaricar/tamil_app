/**
 * ==========================================================================
 * Tamil App - Sam Mascot Floating Tutor Companion Engine
 * ==========================================================================
 */

(function (window) {
  'use strict';

  // Speech Bubble Messages Map per Page/Module
  const MASCOT_MESSAGES = {
    'index.html': {
      ta: 'வணக்கம்! நான் சாம் 👦. 36 விளையாட்டுகள் மூலம் எளிதாக தமிழ் கற்கலாம் வாங்க!',
      en: 'Hello! I am Sam 👦. Let\'s learn Tamil through 36 fun games!'
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
    '31_tamil_words_with_sound.html': {
      ta: 'ஒவ்வொரு தமிழ் வார்த்தையின் மீதும் கிளிக் செய்து ஒலி கேட்கலாம்! 🔊',
      en: 'Click on any Tamil word to hear its pronunciation! 🔊'
    },
    '32_vaarthai_sakkaram.html': {
      ta: 'வார்த்தைச் சக்கரத்தைச் சுழற்றி புதிய சொற்களை உருவாக்குங்கள்! 🎡',
      en: 'Spin the word wheel to discover and form new Tamil words! 🎡'
    },
    '33_vaarthai_rayil.html': {
      ta: 'சரியான சொற்களை இணைத்து தமிழ் வார்த்தை ரயிலை இயக்குங்கள்! 🚂',
      en: 'Connect matching letters to build the Tamil Word Train! 🚂'
    },
    '34_mithakkum_baloon.html': {
      ta: 'மிதக்கும் பலூன்களில் சரியான தமிழ் எழுத்தைப் பிடியுங்கள்! 🎈',
      en: 'Pop the floating balloons containing the correct Tamil letters! 🎈'
    },
    '35_vinveli_vettai.html': {
      ta: 'விண்வெளியில் மறைந்துள்ள தமிழ் சொற்களைக் வேட்டையாடுங்கள்! 🚀',
      en: 'Embark on a space hunt to discover hidden Tamil vocabulary! 🚀'
    },
    '36_common_letter.html': {
      ta: 'கொடுக்கப்பட்டுள்ள சொற்களில் பொதுவான தமிழ் எழுத்தைக் கண்டுபிடியுங்கள்! 🔍',
      en: 'Identify the common Tamil letter across the given words! 🔍'
    }
  };

  class SamMascot {
    constructor() {
      this.isCollapsed = false;
      this.init();
    }

    init() {
      document.addEventListener('DOMContentLoaded', () => {
        this.renderWidget();
      });
    }

    getPageFilename() {
      const path = window.location.pathname;
      let filename = path.split('/').pop().split('?')[0] || 'index.html';
      if (filename === '' || filename === '/') filename = 'index.html';
      if (!filename.includes('.')) filename = filename + '.html';
      return filename;
    }

    getCurrentMessage() {
      const file = this.getPageFilename();
      const lang = window.TamilAuth ? window.TamilAuth.getLang() : 'ta';
      const msgObj = MASCOT_MESSAGES[file] || {
        ta: 'வாருங்கள்! தமிழைக் கற்று மகிழ்வோம்! 🌟',
        en: 'Welcome! Let\'s enjoy learning Tamil together! 🌟'
      };
      return msgObj[lang] || msgObj['ta'];
    }

    renderWidget() {
      if (document.getElementById('sam-mascot-root') || document.getElementById('kavin-mascot-root')) return;

      const message = this.getCurrentMessage();
      const mascotHTML = `
        <div id="sam-mascot-root">
          <div id="mascot-bubble" class="mascot-speech-bubble">
            <div class="mascot-bubble-header">
              <div class="mascot-name-badge">
                <span>👦 சாம் (Sam)</span>
              </div>
              <div class="mascot-controls">
                <button class="mascot-action-btn" title="Speak Speech" onclick="SamMascotEngine.speakMessage()">🔊</button>
                <button class="mascot-action-btn" title="Close" onclick="SamMascotEngine.toggleBubble()">&times;</button>
              </div>
            </div>
            <p class="mascot-speech-text" id="mascot-text">${message}</p>
          </div>

          <div class="mascot-avatar-wrapper" onclick="SamMascotEngine.onAvatarClick()">
            <img src="/images/sam_mascot.jpg" alt="Sam Mascot" class="mascot-avatar-img" />
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
  window.SamMascotEngine = new SamMascot();
  window.KavinMascotEngine = window.SamMascotEngine; // Backward compatibility
})(window);
