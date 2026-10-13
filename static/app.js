/* ==========================================================================
   TranslucentTabs Studio - Client Application Controller
   ========================================================================== */

(function () {
  'use strict';

  // State
  let appState = {
    status: null,
    config: {
      config: {
        effect: '2',
        clearAddress: 'true',
        clearBarBg: 'true',
        clearWinUIBg: 'true',
        showLine: 'true'
      },
      light: { r: '255', g: '255', b: '255', a: '200' },
      dark: { r: '0', g: '0', b: '0', a: '120' }
    },
    activeColorTab: 'dark', // 'dark' | 'light'
    links: {
      github_url: 'https://github.com',
      github_label: 'My GitHub',
      website_url: 'https://mywebsite.com',
      website_label: 'My Website',
      repo_url: 'https://github.com/Maplespe/ExplorerBlurMica'
    }
  };

  let saveConfigTimeout = null;

  // DOM Elements
  const statusBadge = document.getElementById('statusBadge');
  const statusText = document.getElementById('statusText');
  const adminBadge = document.getElementById('adminBadge');
  const adminText = document.getElementById('adminText');
  const themeToggleBtn = document.getElementById('themeToggleBtn');

  // Hero Tags & Buttons
  const systemVersionTag = document.getElementById('systemVersionTag');
  const activeEffectTag = document.getElementById('activeEffectTag');
  const activeDllTag = document.getElementById('activeDllTag');
  const applyBtn = document.getElementById('applyBtn');
  const undoBtn = document.getElementById('undoBtn');
  const restartExplorerBtn = document.getElementById('restartExplorerBtn');

  // Toggles
  const toggleAddress = document.getElementById('toggleAddress');
  const toggleBarBg = document.getElementById('toggleBarBg');
  const toggleWinUIBg = document.getElementById('toggleWinUIBg');
  const toggleShowLine = document.getElementById('toggleShowLine');

  // Color Tab Buttons
  const colorModeDarkBtn = document.getElementById('colorModeDarkBtn');
  const colorModeLightBtn = document.getElementById('colorModeLightBtn');

  // Color Sliders & Display
  const rangeR = document.getElementById('rangeR');
  const rangeG = document.getElementById('rangeG');
  const rangeB = document.getElementById('rangeB');
  const rangeA = document.getElementById('rangeA');
  const valR = document.getElementById('valR');
  const valG = document.getElementById('valG');
  const valB = document.getElementById('valB');
  const valA = document.getElementById('valA');
  const rgbaDisplay = document.getElementById('rgbaDisplay');
  const alphaPercentDisplay = document.getElementById('alphaPercentDisplay');
  const simPreviewSurface = document.getElementById('simPreviewSurface');
  const simTabHeader = document.getElementById('simTabHeader');

  // Footer Links & Modal Elements
  const userGithubBtn = document.getElementById('userGithubBtn');
  const userGithubLabel = document.getElementById('userGithubLabel');
  const userWebsiteBtn = document.getElementById('userWebsiteBtn');
  const userWebsiteLabel = document.getElementById('userWebsiteLabel');
  const sourceRepoBtn = document.getElementById('sourceRepoBtn');
  const editLinksBtn = document.getElementById('editLinksBtn');
  const openLinksModalBtn = document.getElementById('openLinksModalBtn');

  const linksModal = document.getElementById('linksModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const saveLinksBtn = document.getElementById('saveLinksBtn');
  const inputGithubLabel = document.getElementById('inputGithubLabel');
  const inputGithubUrl = document.getElementById('inputGithubUrl');
  const inputWebsiteLabel = document.getElementById('inputWebsiteLabel');
  const inputWebsiteUrl = document.getElementById('inputWebsiteUrl');

  const toastContainer = document.getElementById('toastContainer');

  // Presets Definition
  const PRESETS = {
    'win11-default': {
      effect: '2',
      clearAddress: 'true',
      clearBarBg: 'true',
      clearWinUIBg: 'true',
      showLine: 'true',
      light: { r: '255', g: '255', b: '255', a: '200' },
      dark: { r: '0', g: '0', b: '0', a: '120' }
    },
    'crystal-glass': {
      effect: '3',
      clearAddress: 'true',
      clearBarBg: 'true',
      clearWinUIBg: 'true',
      showLine: 'false',
      light: { r: '255', g: '255', b: '255', a: '110' },
      dark: { r: '15', g: '23', b: '42', a: '80' }
    },
    'acrylic-frosted': {
      effect: '1',
      clearAddress: 'true',
      clearBarBg: 'true',
      clearWinUIBg: 'true',
      showLine: 'true',
      light: { r: '240', g: '240', b: '245', a: '220' },
      dark: { r: '20', g: '25', b: '35', a: '160' }
    },
    'midnight-stealth': {
      effect: '4',
      clearAddress: 'true',
      clearBarBg: 'true',
      clearWinUIBg: 'true',
      showLine: 'false',
      light: { r: '230', g: '235', b: '245', a: '210' },
      dark: { r: '8', g: '10', b: '18', a: '180' }
    }
  };

  // Toast Helper
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // SVGs for toast types
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px) scale(0.95)';
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  }

  // Effect Name Map
  const EFFECT_NAMES = {
    '0': 'Blur',
    '1': 'Acrylic',
    '2': 'Mica',
    '3': 'Blur (Clear)',
    '4': 'MicaAlt'
  };

  // API Call Wrapper
  async function api(path, method = 'GET', data = null) {
    const opts = { method, headers: {} };
    if (data) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(data);
    }
    const res = await fetch(path, opts);
    return res.json();
  }

  // Update Status in UI
  function renderStatus() {
    const s = appState.status;
    if (!s) return;

    // Status Badge
    statusBadge.classList.remove('status-loading', 'status-active', 'status-inactive');
    if (s.is_registered) {
      statusBadge.classList.add('status-active');
      statusText.textContent = 'Active & Blurring';
      statusBadge.title = `ExplorerBlurMica registered: ${s.registered_path || 'active'}`;
    } else {
      statusBadge.classList.add('status-inactive');
      statusText.textContent = 'Default Stock Look';
      statusBadge.title = 'ExplorerBlurMica is currently unregistered/disabled.';
    }

    // Admin Badge
    if (s.is_admin) {
      adminBadge.classList.add('admin-elevated');
      adminText.textContent = 'Administrator';
      adminBadge.title = 'Running with elevated Windows Administrator privileges';
    } else {
      adminBadge.classList.remove('admin-elevated');
      adminText.textContent = 'Standard User';
      adminBadge.title = 'Standard privileges (UAC prompt will appear when applying/undoing)';
    }

    // Hero Tags
    if (s.os_release) {
      systemVersionTag.textContent = `Windows ${s.os_release}`;
    }
    const currentEffect = appState.config.config.effect;
    activeEffectTag.textContent = `Effect: ${EFFECT_NAMES[currentEffect] || 'Mica'}`;

    if (s.bin_dll_exists) {
      activeDllTag.textContent = 'DLL: Ready (x64)';
      activeDllTag.style.color = 'var(--text-secondary)';
    } else {
      activeDllTag.textContent = 'DLL: Not Found in bin!';
      activeDllTag.style.color = '#ef4444';
    }
  }

  // Update Config Form
  function renderConfig() {
    const cfg = appState.config;
    if (!cfg) return;

    // Effect Radio Cards
    const effectVal = cfg.config.effect || '2';
    const radio = document.querySelector(`input[name="effectChoice"][value="${effectVal}"]`);
    if (radio) {
      radio.checked = true;
      document.querySelectorAll('.effect-card').forEach(c => c.classList.remove('active'));
      const parentCard = radio.closest('.effect-card');
      if (parentCard) parentCard.classList.add('active');
    }

    // Toggles
    toggleAddress.checked = (cfg.config.clearAddress === 'true');
    toggleBarBg.checked = (cfg.config.clearBarBg === 'true');
    toggleWinUIBg.checked = (cfg.config.clearWinUIBg === 'true');
    toggleShowLine.checked = (cfg.config.showLine === 'true');

    // Color Sliders
    renderColorStudio();
  }

  // Update Color Sliders & Swatch for Active Tab
  function renderColorStudio() {
    const mode = appState.activeColorTab; // 'dark' or 'light'
    const color = appState.config[mode] || { r: '0', g: '0', b: '0', a: '120' };

    const r = parseInt(color.r || 0, 10);
    const g = parseInt(color.g || 0, 10);
    const b = parseInt(color.b || 0, 10);
    const a = parseInt(color.a || 120, 10);

    rangeR.value = r;
    rangeG.value = g;
    rangeB.value = b;
    rangeA.value = a;

    valR.textContent = r;
    valG.textContent = g;
    valB.textContent = b;
    valA.textContent = a;

    const alphaFloat = (a / 255).toFixed(2);
    const alphaPercent = Math.round((a / 255) * 100);
    const rgbaStr = `rgba(${r}, ${g}, ${b}, ${alphaFloat})`;

    rgbaDisplay.textContent = rgbaStr;
    alphaPercentDisplay.textContent = `${alphaPercent}% Opacity`;

    // Apply color to simulated explorer surface
    simPreviewSurface.style.backgroundColor = rgbaStr;
    simTabHeader.textContent = `Explorer (${mode === 'dark' ? 'Dark' : 'Light'} Mode)`;
  }

  // Sync Color Sliders into State
  function onSliderChange() {
    const mode = appState.activeColorTab;
    const r = rangeR.value;
    const g = rangeG.value;
    const b = rangeB.value;
    const a = rangeA.value;

    valR.textContent = r;
    valG.textContent = g;
    valB.textContent = b;
    valA.textContent = a;

    appState.config[mode] = { r: String(r), g: String(g), b: String(b), a: String(a) };

    const alphaFloat = (a / 255).toFixed(2);
    const alphaPercent = Math.round((a / 255) * 100);
    const rgbaStr = `rgba(${r}, ${g}, ${b}, ${alphaFloat})`;

    rgbaDisplay.textContent = rgbaStr;
    alphaPercentDisplay.textContent = `${alphaPercent}% Opacity`;
    simPreviewSurface.style.backgroundColor = rgbaStr;

    triggerDebouncedSave();
  }

  // Debounced Config Auto-Save
  function triggerDebouncedSave() {
    clearTimeout(saveConfigTimeout);
    saveConfigTimeout = setTimeout(async () => {
      try {
        await api('/api/config', 'POST', appState.config);
      } catch (e) {
        console.error('Failed to auto-save config:', e);
      }
    }, 400);
  }

  // Render Links in Footer & Modal
  function renderLinks() {
    const l = appState.links;
    if (!l) return;

    userGithubLabel.textContent = l.github_label || 'My GitHub';
    userWebsiteLabel.textContent = l.website_label || 'My Website';

    inputGithubLabel.value = l.github_label || '';
    inputGithubUrl.value = l.github_url || '';
    inputWebsiteLabel.value = l.website_label || '';
    inputWebsiteUrl.value = l.website_url || '';
  }

  // Fetch initial data
  async function init() {
    try {
      const [status, cfg, links] = await Promise.all([
        api('/api/status'),
        api('/api/config'),
        api('/api/links')
      ]);

      appState.status = status;
      appState.config = cfg;
      appState.links = links;

      renderStatus();
      renderConfig();
      renderLinks();
    } catch (e) {
      console.error('Initial data fetch failed:', e);
      showToast('Could not connect to local TranslucentTabs API server', 'error');
    }
  }

  // Event Listeners: Effect Radios
  document.querySelectorAll('input[name="effectChoice"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      document.querySelectorAll('.effect-card').forEach(c => c.classList.remove('active'));
      const parent = e.target.closest('.effect-card');
      if (parent) parent.classList.add('active');

      appState.config.config.effect = e.target.value;
      activeEffectTag.textContent = `Effect: ${EFFECT_NAMES[e.target.value] || 'Mica'}`;
      triggerDebouncedSave();
    });
  });

  // Event Listeners: Toggles
  toggleAddress.addEventListener('change', (e) => {
    appState.config.config.clearAddress = e.target.checked ? 'true' : 'false';
    triggerDebouncedSave();
  });
  toggleBarBg.addEventListener('change', (e) => {
    appState.config.config.clearBarBg = e.target.checked ? 'true' : 'false';
    triggerDebouncedSave();
  });
  toggleWinUIBg.addEventListener('change', (e) => {
    appState.config.config.clearWinUIBg = e.target.checked ? 'true' : 'false';
    triggerDebouncedSave();
  });
  toggleShowLine.addEventListener('change', (e) => {
    appState.config.config.showLine = e.target.checked ? 'true' : 'false';
    triggerDebouncedSave();
  });

  // Color Mode Tabs
  colorModeDarkBtn.addEventListener('click', () => {
    appState.activeColorTab = 'dark';
    colorModeDarkBtn.classList.add('active');
    colorModeLightBtn.classList.remove('active');
    renderColorStudio();
  });
  colorModeLightBtn.addEventListener('click', () => {
    appState.activeColorTab = 'light';
    colorModeLightBtn.classList.add('active');
    colorModeDarkBtn.classList.remove('active');
    renderColorStudio();
  });

  // Slider events
  [rangeR, rangeG, rangeB, rangeA].forEach(input => {
    input.addEventListener('input', onSliderChange);
  });

  // Presets
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.getAttribute('data-preset');
      const preset = PRESETS[presetKey];
      if (!preset) return;

      appState.config.config.effect = preset.effect;
      appState.config.config.clearAddress = preset.clearAddress;
      appState.config.config.clearBarBg = preset.clearBarBg;
      appState.config.config.clearWinUIBg = preset.clearWinUIBg;
      appState.config.config.showLine = preset.showLine;
      appState.config.light = { ...preset.light };
      appState.config.dark = { ...preset.dark };

      renderConfig();
      triggerDebouncedSave();
      showToast(`Loaded preset: ${btn.querySelector('.preset-name').textContent}`, 'info');
    });
  });

  // Apply (Do) Button Handler
  applyBtn.addEventListener('click', async () => {
    applyBtn.disabled = true;
    const originalText = applyBtn.innerHTML;
    applyBtn.innerHTML = '<span class="status-dot"></span><span>Applying Effect...</span>';

    try {
      showToast('Registering ExplorerBlurMica & restarting File Explorer...', 'info');
      const res = await api('/api/apply', 'POST', { config: appState.config });
      
      // Refresh status
      appState.status = await api('/api/status');
      renderStatus();

      if (res.is_registered) {
        showToast('Translucent Blur effect applied successfully!', 'success');
      } else {
        showToast('Registered requested. If UAC prompted, confirm to finish.', 'info');
      }
    } catch (e) {
      console.error('Apply error:', e);
      showToast('Error applying effect: ' + e.message, 'error');
    } finally {
      applyBtn.disabled = false;
      applyBtn.innerHTML = originalText;
    }
  });

  // Undo (Remove) Button Handler
  undoBtn.addEventListener('click', async () => {
    undoBtn.disabled = true;
    const originalText = undoBtn.innerHTML;
    undoBtn.innerHTML = '<span class="status-dot"></span><span>Restoring Stock Look...</span>';

    try {
      showToast('Unregistering DLL & restoring native File Explorer...', 'info');
      const res = await api('/api/undo', 'POST');
      
      // Refresh status
      appState.status = await api('/api/status');
      renderStatus();

      if (!res.is_registered) {
        showToast('Default Windows Explorer restored successfully!', 'success');
      } else {
        showToast('Unregister requested. Confirm UAC prompt to complete.', 'info');
      }
    } catch (e) {
      console.error('Undo error:', e);
      showToast('Error removing effect: ' + e.message, 'error');
    } finally {
      undoBtn.disabled = false;
      undoBtn.innerHTML = originalText;
    }
  });

  // Restart Explorer Button Handler
  restartExplorerBtn.addEventListener('click', async () => {
    restartExplorerBtn.disabled = true;
    try {
      showToast('Restarting Windows Explorer...', 'info');
      await api('/api/restart-explorer', 'POST');
      showToast('File Explorer restarted', 'success');
      
      setTimeout(async () => {
        appState.status = await api('/api/status');
        renderStatus();
      }, 1500);
    } catch (e) {
      showToast('Failed to restart explorer: ' + e.message, 'error');
    } finally {
      restartExplorerBtn.disabled = false;
    }
  });

  // External Links Handlers
  async function openUrl(url) {
    try {
      await api('/api/open-url', 'POST', { url });
    } catch (e) {
      window.open(url, '_blank');
    }
  }

  userGithubBtn.addEventListener('click', () => openUrl(appState.links.github_url));
  userWebsiteBtn.addEventListener('click', () => openUrl(appState.links.website_url));
  sourceRepoBtn.addEventListener('click', () => openUrl(appState.links.repo_url));

  // Modal Open / Close
  function openModal() {
    inputGithubLabel.value = appState.links.github_label || '';
    inputGithubUrl.value = appState.links.github_url || '';
    inputWebsiteLabel.value = appState.links.website_label || '';
    inputWebsiteUrl.value = appState.links.website_url || '';
    linksModal.classList.remove('hidden');
  }

  function closeModal() {
    linksModal.classList.add('hidden');
  }

  editLinksBtn.addEventListener('click', openModal);
  openLinksModalBtn.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);
  cancelModalBtn.addEventListener('click', closeModal);

  linksModal.addEventListener('click', (e) => {
    if (e.target === linksModal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !linksModal.classList.contains('hidden')) {
      closeModal();
    }
  });

  saveLinksBtn.addEventListener('click', async () => {
    const updated = {
      github_label: inputGithubLabel.value.trim() || 'My GitHub',
      github_url: inputGithubUrl.value.trim() || 'https://github.com',
      website_label: inputWebsiteLabel.value.trim() || 'My Website',
      website_url: inputWebsiteUrl.value.trim() || 'https://mywebsite.com'
    };

    try {
      const res = await api('/api/links', 'POST', updated);
      appState.links = res.links;
      renderLinks();
      closeModal();
      showToast('Profile links updated successfully!', 'success');
    } catch (e) {
      showToast('Failed to save links: ' + e.message, 'error');
    }
  });

  // Theme Toggle
  const savedTheme = localStorage.getItem('translucent_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('translucent_theme', nextTheme);
  });

  // Periodic status poll (every 6 seconds) to keep status accurate if explorer restarts
  setInterval(async () => {
    try {
      appState.status = await api('/api/status');
      renderStatus();
    } catch (_) {}
  }, 6000);

  // Initialize on load
  init();
})();
