(() => {
  const inputEl  = document.getElementById('input-text');
  const outputEl = document.getElementById('output-text');
  const convertBtn = document.getElementById('convert-btn');
  const copyBtn  = document.getElementById('copy-btn');
  const swapBtn  = document.getElementById('swap-btn');
  const clearBtn = document.getElementById('clear-btn');
  const toast    = document.getElementById('toast');
  const toggleGroup = document.querySelector('.toggle-group');
  const toggleBtns  = document.querySelectorAll('.toggle-btn');
  const btnText     = convertBtn.querySelector('.btn-text');

  let mode = 'encode';

  /* ── Mode toggle ────────────────────────────────── */
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      mode = btn.dataset.mode;
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      toggleGroup.setAttribute('data-mode', mode);
      btnText.textContent = mode === 'encode' ? 'Encode' : 'Decode';
      inputEl.placeholder = mode === 'encode'
        ? 'Type or paste your text here…'
        : 'Paste Base64 string here…';
    });
  });

  /* ── Convert ────────────────────────────────────── */
  convertBtn.addEventListener('click', async () => {
    const text = inputEl.value;
    if (!text.trim()) {
      outputEl.value = '';
      return;
    }

    try {
      const res = await fetch(`/api/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (res.ok) {
        outputEl.value = data.result;
      } else {
        outputEl.value = `Error: ${data.error}`;
      }
    } catch {
      outputEl.value = 'Error: Could not reach server';
    }
  });

  /* ── Copy ────────────────────────────────────────── */
  copyBtn.addEventListener('click', () => {
    if (!outputEl.value) return;
    navigator.clipboard.writeText(outputEl.value).then(() => showToast('Copied!'));
  });

  /* ── Swap ────────────────────────────────────────── */
  swapBtn.addEventListener('click', () => {
    const tmp = inputEl.value;
    inputEl.value = outputEl.value;
    outputEl.value = tmp;
  });

  /* ── Clear ───────────────────────────────────────── */
  clearBtn.addEventListener('click', () => {
    inputEl.value = '';
    outputEl.value = '';
    inputEl.focus();
  });

  /* ── Keyboard shortcut: Ctrl/Cmd + Enter to convert */
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      convertBtn.click();
    }
  });

  /* ── Toast helper ────────────────────────────────── */
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 1800);
  }
})();
