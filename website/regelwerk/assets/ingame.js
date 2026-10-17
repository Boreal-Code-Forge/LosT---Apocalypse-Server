// Small authenticated bridge for the F4 game window. No game callback access here.
(() => {
  if (window.parent === window) return;
  const GAME = 'https://cfx-nui-ls_handbook';
  let active = false, parentOrigin;
  window.addEventListener('message', event => {
    const preview = event.origin === 'http://127.0.0.1:8772';
    if (event.source !== window.parent || (event.origin !== GAME && !preview) || event.data?.type !== 'LS_HANDBOOK_INIT') return;
    active = true; parentOrigin = event.origin;
    // Restrict links even if a site author accidentally adds target=_blank.
    document.querySelectorAll('a[target]').forEach(a => a.removeAttribute('target'));
    document.querySelectorAll('a[href]').forEach(a => {
      if (!a.hasAttribute('data-ui-image') && /\.(png|jpe?g|gif|pdf)$/i.test(new URL(a.href, location.href).pathname)) a.hidden = true;
    });
    window.parent.postMessage({type:'LS_HANDBOOK_READY'}, parentOrigin);
  });
  window.addEventListener('keydown', event => {
    if (active && (event.key === 'Escape' || event.key === 'F4')) {
      event.preventDefault(); event.stopImmediatePropagation();
      window.parent.postMessage({type:'LS_HANDBOOK_CLOSE'}, parentOrigin);
    }
  }, true);
  document.addEventListener('click', event => {
    if (!active) return;
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !url.pathname.startsWith('/LosT---Apocalypse-Server/')) event.preventDefault();
    else { link.removeAttribute('target'); link.removeAttribute('download'); }
  }, true);
})();
