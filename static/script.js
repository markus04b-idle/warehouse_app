// ── Inventory loader ──────────────────────────────────────────────────────────

async function loadInventory() {
  const tbody = document.getElementById('inventory-body');
  const status = document.getElementById('status-bar');

  try {
    const res = await fetch('/inventory');
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const items = await res.json();

    renderTable(items);
    status.textContent = `${items.length} record${items.length !== 1 ? 's' : ''} loaded`;
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" class="state-cell">Failed to load inventory: ${err.message}</td></tr>`;
    status.textContent = '';
  }
}

function renderTable(items) {
  const tbody = document.getElementById('inventory-body');

  if (items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="state-cell">No records found.</td></tr>';
    return;
  }

  tbody.innerHTML = items.map(item => `
    <tr data-id="${item.id}">
      <td class="id-cell">${item.id}</td>
      <td class="sku-cell">${escapeHtml(item.sku)}</td>
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.category)}</td>
      <td class="num-cell">${item.quantity}</td>
      <td class="num-cell">$${item.unit_price.toFixed(2)}</td>
      <td class="actions-cell">
        <button class="btn btn-warning" onclick="openEditModal(${item.id})">Edit</button>
        <button class="btn btn-danger" onclick="confirmDelete(${item.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

// ── Modal helpers ─────────────────────────────────────────────────────────────

function openCreateModal() {
  document.getElementById('modal-title').textContent = 'New Record';
  document.getElementById('record-form').reset();
  document.getElementById('field-id').value = '';
  document.getElementById('submit-btn').textContent = 'Create';
  showModal();
}

function openEditModal(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (!row) return;

  const cells = row.querySelectorAll('td');
  document.getElementById('modal-title').textContent = 'Edit Record';
  document.getElementById('field-id').value = id;
  document.getElementById('field-sku').value = cells[1].textContent.trim();
  document.getElementById('field-name').value = cells[2].textContent.trim();
  document.getElementById('field-category').value = cells[3].textContent.trim();
  document.getElementById('field-quantity').value = cells[4].textContent.trim();
  document.getElementById('field-unit-price').value = parseCurrency(cells[5].textContent.trim());
  document.getElementById('submit-btn').textContent = 'Save';
  showModal();
}

function confirmDelete(id) {
  if (!confirm(`Delete record #${id}? This cannot be undone.`)) return;
  deleteRecord(id);
}

// ── Stub functions — wire these up once endpoints exist ───────────────────────

function submitForm(event) {
  event.preventDefault();
  const id = document.getElementById('field-id').value;
  const payload = {
    sku: document.getElementById('field-sku').value,
    name: document.getElementById('field-name').value,
    category: document.getElementById('field-category').value,
    quantity: parseInt(document.getElementById('field-quantity').value, 10),
    unit_price: parseFloat(document.getElementById('field-unit-price').value),
  };

  if (id) {
    updateRecord(parseInt(id, 10), payload);
  } else {
    createRecord(payload);
  }
}

function createRecord(payload) {
  // TODO: POST /inventory  →  then reload
  console.log('createRecord', payload);
  closeModal();
}

function updateRecord(id, payload) {
  // TODO: PATCH /inventory/{id}  →  then reload
  console.log('updateRecord', id, payload);
  closeModal();
}

function deleteRecord(id) {
  // TODO: DELETE /inventory/{id}  →  then reload
  console.log('deleteRecord', id);
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function showModal() {
  document.getElementById('modal-overlay').hidden = false;
}

function closeModal() {
  document.getElementById('modal-overlay').hidden = true;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseCurrency(str) {
  return parseFloat(str.replace(/[^0-9.]/g, ''));
}

// ── Close modal on backdrop click ────────────────────────────────────────────
document.getElementById('modal-overlay').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

// ── Bootstrap ────────────────────────────────────────────────────────────────
loadInventory();
