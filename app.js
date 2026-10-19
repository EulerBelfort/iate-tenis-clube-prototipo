document.addEventListener('DOMContentLoaded', () => {
  const today = document.querySelector('[data-today]');
  if (today) today.textContent = new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',year:'numeric'}).format(new Date());
  const toast = document.querySelector('.toast');
  let toastTimer;
  function notify(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }
  document.querySelectorAll('[data-toast]').forEach(el => el.addEventListener('click', e => {
    if (el.closest('dialog')) return;
    notify(el.dataset.toast);
  }));
  const modal = document.querySelector('#modal');
  document.querySelectorAll('[data-modal]').forEach(el => el.addEventListener('click', () => {
    if (!modal) { notify('Ação demonstrativa.'); return; }
    const title = document.querySelector('#modal-title');
    if (title) title.textContent = el.dataset.modal;
    modal.showModal();
  }));
  document.querySelectorAll('dialog [data-toast]').forEach(el => el.addEventListener('click', () => {
    notify(el.dataset.toast);
    setTimeout(() => modal?.close(), 30);
  }));
  document.querySelectorAll('[data-filter]').forEach(input => input.addEventListener('input', () => {
    const query = input.value.toLocaleLowerCase('pt-BR');
    const key = input.dataset.filter;
    let rows = [];
    if (key === 'members') rows = [...document.querySelectorAll('[data-member-rows] tr')];
    else if (key === 'access') rows = [...document.querySelectorAll('tbody tr')];
    else if (key === 'invites') rows = [...document.querySelectorAll('tbody tr')];
    else if (key === 'boats') rows = [...document.querySelectorAll('tbody tr')];
    rows.forEach(row => row.hidden = !row.textContent.toLocaleLowerCase('pt-BR').includes(query));
  }));
  const statusFilter = document.querySelector('[data-status-filter]');
  statusFilter?.addEventListener('change', () => {
    document.querySelectorAll('[data-member-rows] tr').forEach(row => {
      row.hidden = (statusFilter.value && row.dataset.status !== statusFilter.value) ||
        !row.textContent.toLocaleLowerCase('pt-BR').includes((document.querySelector('[data-filter="members"]')?.value || '').toLocaleLowerCase('pt-BR'));
    });
  });
  const slips = document.querySelector('[data-slips]');
  if (slips) {
    const occupied = new Set([3,4,5,8,9,12,13,16,18,19,22,25,27,30,31,34,36,39,42,45,47,50,52,54,58,60]);
    const maintenance = new Set([11,24,41,49,57,63]);
    for (let i=1;i<=64;i++) {
      const btn = document.createElement('button');
      const id = 'A-' + String(i).padStart(2,'0');
      btn.className = 'slip ' + (maintenance.has(i) ? 'maint' : occupied.has(i) ? 'occ' : 'free-slip');
      btn.textContent = id;
      btn.setAttribute('aria-label', id + (maintenance.has(i) ? ' manutenção' : occupied.has(i) ? ' ocupada' : ' livre'));
      btn.addEventListener('click', () => {
        const detail = document.querySelector('[data-slip-detail]');
        const state = maintenance.has(i) ? 'Manutenção' : occupied.has(i) ? 'Ocupada' : 'Livre';
        const statusClass = maintenance.has(i) ? 'warning' : occupied.has(i) ? 'info' : 'success';
        detail.innerHTML = `<span class="status ${statusClass}">${state}</span><b>Vaga ${id}</b><p>${occupied.has(i) ? 'Embarcação: Phantom / proprietário associado (dado ilustrativo).' : maintenance.has(i) ? 'Vaga temporariamente bloqueada para manutenção.' : 'Esta vaga está livre no protótipo e pode ser selecionada para uma nova reserva.'}</p>`;
      });
      slips.appendChild(btn);
    }
  }
});