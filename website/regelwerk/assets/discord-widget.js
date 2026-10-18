// Public Discord widget data only. No bot token, webhook or account credentials.
(() => {
  const root = document.querySelector('[data-discord-community]');
  if (!root) return;
  if (window.parent !== window) { root.hidden = true; return; }
  const GUILD = '1552250932643893249';
  const count = root.querySelector('[data-discord-count]');
  const faces = root.querySelector('[data-discord-avatars]');
  const stamp = root.querySelector('[data-discord-updated]');
  const join = root.querySelector('[data-discord-join]');
  let visible = false, busy = false;
  async function refresh() {
    if (!visible || busy || document.hidden) return;
    busy = true;
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), 8000);
    try {
      const response = await fetch(`https://discord.com/api/guilds/${GUILD}/widget.json`,
        {credentials:'omit', signal:abort.signal, cache:'no-cache'});
      if (!response.ok) throw new Error('Widget unavailable');
      const data = await response.json();
      if (data.id !== GUILD || !Number.isSafeInteger(data.presence_count) || data.presence_count < 0) throw new Error('Invalid widget data');
      count.textContent = `${data.presence_count} auf Discord online`;
      root.dataset.state = 'online';
      if (typeof data.instant_invite === 'string') {
        const url = new URL(data.instant_invite);
        if (url.protocol === 'https:' && (url.hostname === 'discord.gg' ||
          (url.hostname === 'discord.com' && url.pathname.startsWith('/invite/')))) join.href = url.href;
      }
      faces.replaceChildren();
      for (const member of (Array.isArray(data.members) ? data.members : []).slice(0, 7)) {
        if (typeof member.avatar_url !== 'string') continue;
        const url = new URL(member.avatar_url);
        if (url.protocol !== 'https:' || url.hostname !== 'cdn.discordapp.com') continue;
        const img = document.createElement('img');
        img.src = url.href; img.alt = ''; img.width = 42; img.height = 42;
        img.referrerPolicy = 'no-referrer';
        img.addEventListener('error', () => img.remove(), {once:true});
        faces.append(img);
      }
      stamp.textContent = 'Discord-Status · ' + new Intl.DateTimeFormat('de-DE', {hour:'2-digit',minute:'2-digit'}).format(new Date());
    } catch {
      root.dataset.state = 'unavailable';
      count.textContent = 'Deine Community wartet';
      faces.replaceChildren();
      stamp.textContent = 'Online-Anzeige gerade nicht verfügbar';
    } finally { clearTimeout(timer); busy = false; }
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) refresh(); },
      {rootMargin:'150px'}).observe(root);
  } else { visible = true; refresh(); }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  setInterval(refresh, 60000);
})();
