/* Indonesia demonstration-template adapter.
 * It keeps the existing country -> university architecture while reusing one
 * clearly watermarked demo template. No institutional logos, seals, signatures,
 * or official layouts are supplied.
 */
(() => {
  const originalFetch = window.fetch.bind(window);
  const base = '/templates/indonesia/_demo/';

  function isIndonesiaPath(url) {
    return /\/templates\/indonesia\/[^/]+\/(config\.json|style\.css|student_card\.html|admission_letter\.html|enrollment_cert\.html)$/.test(url);
  }

  function selectedUniversityName() {
    const option = document.querySelector('#university-selector option:checked');
    return option?.textContent?.trim() || 'Indonesia University Demonstration';
  }

  function makeConfig() {
    const displayName = selectedUniversityName();
    const english = displayName.split('·').pop()?.trim() || displayName;
    return {
      name: `${displayName} — Demonstration Template`,
      demo: true,
      watermark: 'SAMPLE · DEMONSTRATION ONLY · NOT AN OFFICIAL DOCUMENT',
      universityInfo: {
        universityName: displayName,
        universityNameEn: english
      },
      studentInfoDefaults: {
        studentName: 'Demo Student',
        passportNumber: 'DEMO-PASSPORT',
        studentId: 'DEMO-0001',
        faculty: 'Demonstration Faculty',
        specialty: 'Demonstration Program',
        enrollmentDate: '2026-09-01',
        studyPeriod: '4'
      },
      documents: {
        student_card: { name: '学生证（演示）', available: true, defaults: { demoNumber: 'DEMO-001' } },
        admission_letter: { name: '录取通知书（演示）', available: true, defaults: { demoNumber: 'DEMO-001', demoDate: '2026-08-21' } },
        enrollment_cert: { name: '在读证明（演示）', available: true, defaults: { demoNumber: 'DEMO-001', demoDate: '2026-08-21' } }
      }
    };
  }

  window.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input?.url || '';
    if (!isIndonesiaPath(url)) return originalFetch(input, init);

    const filename = url.split('/').pop();
    if (filename === 'config.json') {
      return new Response(JSON.stringify(makeConfig()), {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }
    return originalFetch(`${base}${filename}`, init);
  };

  document.addEventListener('DOMContentLoaded', () => {
    const country = document.getElementById('country-selector');
    const university = document.getElementById('university-selector');
    const ensureDemoCss = () => {
      if (country?.value !== 'indonesia') return;
      if (document.querySelector('link[data-indonesia-demo-css]')) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `${base}style.css`;
      link.dataset.indonesiaDemoCss = 'true';
      document.head.appendChild(link);
    };
    country?.addEventListener('change', ensureDemoCss);
    university?.addEventListener('change', ensureDemoCss);
  });
})();
