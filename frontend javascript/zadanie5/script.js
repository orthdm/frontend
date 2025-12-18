(function () {
  'use strict';

  // REGEX / KONFIG
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?\d{9,15}$/;
  const nameRegex = /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s'-]{2,}$/;
  const urlRequireHttp = /^(https?:\/\/).+/i;

  // SELEkTORY
  const form = document.querySelector('form');
  if (!form) return;

  // Wyłącz natywną walidację HTML5 (używamy JS)
  form.setAttribute('novalidate', '');

  const submitBtn = form.querySelector('button[type="submit"]');
  const resetBtn = form.querySelector('button[type="reset"]');
  const agreeEl = form.querySelector('#agree');

  // Usuń required z ukrytego checkboxa (unikamy błędu "not focusable")
  if (agreeEl && agreeEl.hasAttribute('required')) agreeEl.removeAttribute('required');

  // POMOCNICZE: wstawianie / pobieranie nodu komunikatu błędu
  function getMessageNode(input) {
    // jeśli istnieje span.status bezpośrednio po polu -> wstaw tam
    let after = input.nextElementSibling;
    if (after && after.classList && after.classList.contains('status')) {
      if (after.nextElementSibling && after.nextElementSibling.classList && after.nextElementSibling.classList.contains('error-message')) {
        return after.nextElementSibling;
      }
      const em = document.createElement('div');
      em.className = 'error-message';
      em.style.color = 'var(--danger, #c92a2a)';
      em.style.fontSize = '0.9rem';
      em.style.marginTop = '6px';
      after.insertAdjacentElement('afterend', em);
      return em;
    }
    // jeśli po polu jest error-message - zwróć
    if (after && after.classList && after.classList.contains('error-message')) return after;
    // wstaw po polu
    const em = document.createElement('div');
    em.className = 'error-message';
    em.style.color = 'var(--danger, #c92a2a)';
    em.style.fontSize = '0.9rem';
    em.style.marginTop = '6px';
    input.insertAdjacentElement('afterend', em);
    return em;
  }

  // POMOCNICZE: visual mark
  function markValid(el) {
    el.style.borderColor = 'var(--success, #2b8a3e)';
    el.style.boxShadow = '0 0 0 3px rgba(43,138,62,0.12)';
    const m = getMessageNode(el); if (m) m.textContent = '';
  }
  function markInvalid(el, msg) {
    el.style.borderColor = 'var(--danger, #c92a2a)';
    el.style.boxShadow = '0 0 0 3px rgba(201,42,42,0.08)';
    const m = getMessageNode(el); if (m) m.textContent = msg;
  }
  function clearMark(el) {
    el.style.borderColor = '';
    el.style.boxShadow = '';
    const m = getMessageNode(el); if (m) m.textContent = '';
  }

  // WALIDATORY
  function validateName() {
    const el = form.querySelector('#name');
    const v = (el.value || '').trim();
    if (v.length < 2) { markInvalid(el, 'Imię musi mieć minimum 2 znaki.'); return false; }
    if (!nameRegex.test(v)) { markInvalid(el, 'Imię może zawierać tylko litery, spacje, myślnik lub apostrof.'); return false; }
    markValid(el); return true;
  }

  function validateEmail() {
    const el = form.querySelector('#email');
    const v = (el.value || '').trim();
    if (!emailRegex.test(v)) { markInvalid(el, 'Podaj poprawny adres email.'); return false; }
    markValid(el); return true;
  }

  function validateTel() {
    const el = form.querySelector('#tel');
    if (!el) return true;
    const v = (el.value || '').trim();
    if (v === '') { clearMark(el); return true; } // opcjonalny
    if (!phoneRegex.test(v)) { markInvalid(el, 'Numer telefonu nieprawidłowy. Dozwolone cyfry, opcjonalnie +, 9–15 cyfr.'); return false; }
    markValid(el); return true;
  }

  function validateDOB() {
    const el = form.querySelector('#dob');
    if (!el) return true;
    const v = el.value;
    if (!v) { markInvalid(el, 'Podaj datę urodzenia.'); return false; }
    const d = new Date(v + 'T00:00:00');
    const today = new Date();
    d.setHours(0,0,0,0); today.setHours(0,0,0,0);
    if (isNaN(d.getTime())) { markInvalid(el, 'Niepoprawna data.'); return false; }
    if (d > today) { markInvalid(el, 'Data nie może być w przyszłości.'); return false; }
    markValid(el); return true;
  }

  function validatePassword() {
    const pw = form.querySelector('#password'), cf = form.querySelector('#confirm');
    if (!pw || !cf) return true;
    const a = pw.value || '', b = cf.value || '';
    if (a.length < 8) { markInvalid(pw, 'Hasło musi mieć minimum 8 znaków.'); return false; }
    markValid(pw);
    if (b.length < 8) { markInvalid(cf, 'Potwierdź hasło (min. 8 znaków).'); return false; }
    if (a !== b) { markInvalid(cf, 'Hasła nie są identyczne.'); return false; }
    markValid(cf); return true;
  }

  function validateCountry() {
    const el = form.querySelector('#country');
    if (!el) return true;
    if (!el.value) { markInvalid(el, 'Wybierz kraj z listy.'); return false; }
    markValid(el); return true;
  }

  function validateWebsite() {
    const el = form.querySelector('#website');
    if (!el) return true;
    const v = (el.value || '').trim();
    if (!v) { clearMark(el); return true; }
    if (!urlRequireHttp.test(v)) { markInvalid(el, 'Podaj pełny adres URL zaczynając od http:// lub https://'); return false; }
    markValid(el); return true;
  }

  function validateBio() {
    const el = form.querySelector('#bio');
    if (!el) return true;
    const v = (el.value || '').trim();
    if (v.length > 0 && v.length < 10) { markInvalid(el, 'Wiadomość musi mieć minimum 10 znaków.'); return false; }
    markValid(el); return true;
  }

  function validateAgree() {
    const cb = form.querySelector('#agree');
    const label = form.querySelector('label[for="agree"]');
    // usuń stary komunikat
    if (label && label.nextElementSibling && label.nextElementSibling.classList && label.nextElementSibling.classList.contains('error-message')) {
      label.nextElementSibling.remove();
    }
    if (!cb.checked) {
      if (label) {
        const em = document.createElement('div');
        em.className = 'error-message';
        em.textContent = 'Musisz zaakceptować regulamin.';
        em.style.color = 'var(--danger, #c92a2a)';
        em.style.fontSize = '0.9rem';
        em.style.marginTop = '6px';
        label.insertAdjacentElement('afterend', em);
      }
      cb.style.outline = '2px solid rgba(201,42,42,0.2)';
      return false;
    }
    cb.style.outline = '';
    return true;
  }

  function validateFile() {
    const el = form.querySelector('#cv');
    if (!el) return true;
    const file = el.files && el.files[0];
    if (!file) { clearMark(el); return true; }
    const allowed = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) { markInvalid(el, 'CV musi być w formacie PDF lub DOC/DOCX.'); return false; }
    markValid(el); return true;
  }

  // WALIDACJA
  function validateAll() {
    const results = [
      validateName(),
      validateEmail(),
      validateTel(),
      validateDOB(),
      validatePassword(),
      validateCountry(),
      validateWebsite(),
      validateBio(),
      validateAgree(),
      validateFile()
    ];
    return results.every(Boolean);
  }

  const realtime = [
    { sel:'#name', fn: validateName },
    { sel:'#email', fn: validateEmail },
    { sel:'#tel', fn: validateTel },
    { sel:'#dob', fn: validateDOB },
    { sel:'#password', fn: validatePassword },
    { sel:'#confirm', fn: validatePassword },
    { sel:'#country', fn: validateCountry },
    { sel:'#website', fn: validateWebsite },
    { sel:'#bio', fn: validateBio },
    { sel:'#cv', fn: validateFile },
    { sel:'#agree', fn: validateAgree }
  ];
  realtime.forEach(item => {
    const el = form.querySelector(item.sel);
    if (!el) return;
    if (el.type === 'file') el.addEventListener('change', item.fn);
    else if (el.type === 'checkbox') el.addEventListener('change', item.fn);
    else {
      el.addEventListener('input', item.fn);
      el.addEventListener('blur', item.fn);
    }
  });

  // FormData -> obiekt (grupowanie powtórzeń)
  function formDataToObject(fd) {
    const obj = {};
    for (const [k, v] of fd.entries()) {
      if (obj.hasOwnProperty(k)) {
        if (!Array.isArray(obj[k])) obj[k] = [obj[k]];
        obj[k].push(v);
      } else {
        obj[k] = v;
      }
    }
    return obj;
  }

  // pomocnicze sprawdzenie czy element jest focusowalny/widoczny
  function isFocusable(el) {
    if (!el) return false;
    if (el.disabled) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    // offsetWidth/Height dla widoczności
    if (el.offsetWidth === 0 && el.offsetHeight === 0) return false;
    try {
      return typeof el.focus === 'function';
    } catch {
      return false;
    }
  }

  // SUBMIT
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // usuń poprzedni komunikat sukcesu
    const prevSuccess = document.querySelector('.form-success-message'); if (prevSuccess) prevSuccess.remove();

    if (!validateAll()) {
      // focusuj pierwsze widoczne pole z error-message
      const firstErrMsg = form.querySelector('.error-message');
      if (firstErrMsg) {
        // poprzednik error-message to zwykle span.status lub pole - rozsądek: spróbuj znaleźć powiązane pole
        let candidate = firstErrMsg.previousElementSibling;
        if (candidate && candidate.classList && candidate.classList.contains('status')) {
          candidate = candidate.previousElementSibling || candidate;
        }
        // jeśli candidate nie focusowalny, szukamy pierwszego focusowalnego pola w formie
        if (!isFocusable(candidate)) {
          const vis = form.querySelector('input:not([type=hidden]):not([disabled]), textarea:not([disabled]), select:not([disabled])');
          if (isFocusable(vis)) candidate = vis;
          else candidate = null;
        }
        if (candidate && isFocusable(candidate)) {
          try { candidate.focus(); } catch {}
        }
      }
      return;
    }

    // Zbieramy FormData
    const fd = new FormData(form);
    const obj = formDataToObject(fd);

    // obsługa pliku CV -> meta info
    const cvEl = form.querySelector('#cv');
    if (cvEl && cvEl.files && cvEl.files[0]) {
      const f = cvEl.files[0];
      obj.cv = { name: f.name, size: f.size, type: f.type };
    }

    // upewnij się, że interest jest tablicą
    if (!Array.isArray(obj.interest) && obj.interest !== undefined) obj.interest = [obj.interest];
    if (obj.interest === undefined) obj.interest = [];

    // radio gender -> null gdy brak
    obj.gender = obj.gender || null;

    // pokaż dane w konsoli jako obiekt
    console.log('Zebrane dane (obiekt):', obj);

    // blokada przycisku i informacja
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset._orig = submitBtn.textContent;
      submitBtn.textContent = 'Wysyłanie...';
    }

    // symulacja wysyłki
    setTimeout(() => {
      // komunikat sukcesu
      const success = document.createElement('div');
      success.className = 'form-success-message';
      success.textContent = 'Formularz został wysłany pomyślnie. Dziękujemy!';
      success.style.background = 'linear-gradient(90deg, rgba(43,138,62,0.12), rgba(43,138,62,0.06))';
      success.style.border = '1px solid rgba(43,138,62,0.2)';
      success.style.color = 'var(--success, #2b8a3e)';
      success.style.padding = '12px 14px';
      success.style.borderRadius = '8px';
      success.style.marginBottom = '12px';
      success.style.fontWeight = '600';
      form.parentNode.insertBefore(success, form);

      // reset formularza i wyczyszczenie stylów
      form.reset();
      const fields = form.querySelectorAll('input, textarea, select');
      fields.forEach(f => {
        f.style.borderColor = '';
        f.style.boxShadow = '';
        const m = getMessageNode(f); if (m) m.textContent = '';
      });
      // usuń error przy agree jeśli był
      const labelAgree = form.querySelector('label[for="agree"]');
      if (labelAgree && labelAgree.nextElementSibling && labelAgree.nextElementSibling.classList && labelAgree.nextElementSibling.classList.contains('error-message')) {
        labelAgree.nextElementSibling.remove();
      }

      // przywróć przycisk
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset._orig || 'Wyślij';
        delete submitBtn.dataset._orig;
      }

      // usuń success po 6s
      setTimeout(() => success.remove(), 6000);
    }, 1400);
  });

  // RESET HANDLER
  resetBtn && resetBtn.addEventListener('click', () => {
    setTimeout(() => {
      const fields = form.querySelectorAll('input, textarea, select');
      fields.forEach(f => {
        f.style.borderColor = '';
        f.style.boxShadow = '';
        const m = getMessageNode(f); if (m) m.textContent = '';
      });
      const labelAgree = form.querySelector('label[for="agree"]');
      if (labelAgree && labelAgree.nextElementSibling && labelAgree.nextElementSibling.classList && labelAgree.nextElementSibling.classList.contains('error-message')) {
        labelAgree.nextElementSibling.remove();
      }
      const prev = document.querySelector('.form-success-message'); if (prev) prev.remove();
    }, 50);
  });

  // opcjonalny helper do debugowania: zwraca obiekt z FormData
  window.collectFormDataObject = function () {
    const fd = new FormData(form);
    const obj = formDataToObject(fd);
    const f = form.querySelector('#cv') && form.querySelector('#cv').files[0];
    if (f) obj.cv = { name: f.name, size: f.size, type: f.type };
    if (!Array.isArray(obj.interest) && obj.interest !== undefined) obj.interest = [obj.interest];
    console.log('FormData -> obiekt:', obj);
    return obj;
  };

  function formDataToObject(fd) {
    const obj = {};
    for (const [k, v] of fd.entries()) {
      if (obj.hasOwnProperty(k)) {
        if (!Array.isArray(obj[k])) obj[k] = [obj[k]];
        obj[k].push(v);
      } else {
        obj[k] = v;
      }
    }
    return obj;
  }

})();
