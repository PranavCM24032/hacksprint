    // Give every text-only element the same imperfect printed-ink texture,
    // while leaving logo and collage artwork crisp.
    (function applyPaperInk() {
      if (window.matchMedia('(max-width: 768px)').matches) return;
      const excludedTags = new Set(['SCRIPT', 'STYLE', 'SVG', 'PATH', 'DEFS', 'FILTER']);
      document.querySelectorAll('body *').forEach((element) => {
        if (excludedTags.has(element.tagName) || element.children.length > 0) return;
        if (element.textContent.trim()) element.classList.add('paper-ink');
      });
    })();

    (function countdown() {
      const target = new Date('2026-08-29T00:00:00').getTime();
      const daysEl = document.getElementById('days');
      const hoursEl = document.getElementById('hours');
      const minutesEl = document.getElementById('minutes');
      const secondsEl = document.getElementById('seconds');

      function update() {
        const now = Date.now();
        let diff = target - now;
        if (diff < 0) diff = 0;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
      }
      update();
      setInterval(update, 1000);
    })();

    // Stamp Spot Effect
    function stampSpot() {
      const badge = document.getElementById('stampedBadge');
      if (!badge) return;
      badge.classList.add('active');
      setTimeout(() => {
        badge.classList.remove('active');
        window.open('https://forms.gle/HHmVQ9zk1NMbo6pX9', '_blank');
      }, 1400);
    }

    // Rocket Launch Preloader Animation Sequence
    function dismissPreloader() {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.classList.add('dismissed');
        document.body.classList.remove('loading');
      }
    }

    (function runPreloaderSequence() {
      const rocketWrapper = document.getElementById('rocketWrapper');
      const logoReveal = document.getElementById('logoReveal');

      // 1. Launch Rocket from bottom to top + sound
      setTimeout(() => {
        if (rocketWrapper) rocketWrapper.classList.add('launching');
        if (typeof SoundEngine !== 'undefined') SoundEngine.rocketLaunch();
      }, 0);

      // 2. Reveal Logo as rocket blasts into top dark sky + swoosh
      setTimeout(() => {
        if (logoReveal) logoReveal.classList.add('active');
        if (typeof SoundEngine !== 'undefined') SoundEngine.swoosh();
      }, 4000);

      // 3. Dismiss preloader overlay and reveal main website
      setTimeout(() => {
        dismissPreloader();
      }, 6000);
    })();

    // Click sounds on all buttons and links
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.btn-clean, .nav-register, .stamp-seal-btn, .scan-qr-btn');
      if (!target || typeof SoundEngine === 'undefined') return;
      if (target.classList.contains('stamp-seal-btn')) {
        SoundEngine.stamp();
      } else {
        SoundEngine.click();
      }
    });

    // Success chime after stamp registers
    (function hookStampSound() {
      const orig = window.stampSpot;
      window.stampSpot = function () {
        if (typeof SoundEngine !== 'undefined') SoundEngine.gling();
        if (orig) orig();
      };
    })();
