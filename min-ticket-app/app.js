// Data (use the provided JSON)
const TICKETS = [
  {"id":101,"title":"Login button not clickable","status":"OPEN","priority":"HIGH","createdAt":"2025-09-22T10:15:00Z","assignee":"Alex"},
  {"id":102,"title":"Update footer links","status":"CLOSED","priority":"LOW","createdAt":"2025-09-18T08:30:00Z","assignee":"Sam"},
  {"id":103,"title":"Search results mismatch","status":"OPEN","priority":"MEDIUM","createdAt":"2025-09-25T12:00:00Z","assignee":"Priya"},
  {"id":104,"title":"Dark mode color contrast","status":"OPEN","priority":"HIGH","createdAt":"2025-09-27T09:00:00Z","assignee":"Jordan"},
  {"id":105,"title":"Profile avatar upload fails","status":"CLOSED","priority":"MEDIUM","createdAt":"2025-09-20T14:45:00Z","assignee":"Alex"},
  {"id":106,"title":"Checkout taxes incorrect","status":"OPEN","priority":"HIGH","createdAt":"2025-09-29T16:10:00Z","assignee":"Sam"},
  {"id":107,"title":"Keyboard nav skips menu","status":"OPEN","priority":"LOW","createdAt":"2025-09-21T11:20:00Z","assignee":"Priya"},
  {"id":108,"title":"Analytics double counting","status":"CLOSED","priority":"HIGH","createdAt":"2025-09-17T07:05:00Z","assignee":"Jordan"}
];

const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };

const statusFilterEl = document.getElementById('statusFilter');
const searchInput = document.getElementById('searchInput');
const listContainer = document.getElementById('listContainer');
const ticketTemplate = document.getElementById('ticketTemplate');
const countText = document.getElementById('countText');
const emptyState = document.getElementById('emptyState');
const clearBtn = document.getElementById('clearBtn');

function formatDate(iso){
  const d = new Date(iso);
  return d.toLocaleString();
}

function applyFiltersAndRender(){
  const status = statusFilterEl.value;
  const query = searchInput.value.trim().toLowerCase();

  // Filter
  let filtered = TICKETS.filter(t => {
    if(status !== 'ALL' && t.status !== status) return false;
    if(query && !t.title.toLowerCase().includes(query)) return false;
    return true;
  });

  // Sort by priority (HIGH→LOW), ties -> createdAt newest first
  filtered.sort((a,b) => {
    const p = priorityOrder[b.priority] - priorityOrder[a.priority];
    if(p !== 0) return p;
    // newest createdAt first
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  renderList(filtered);
}

function renderList(tickets){
  listContainer.innerHTML = '';
  const total = TICKETS.length;
  countText.textContent = `Showing ${tickets.length} of ${total} tickets`;

  if(tickets.length === 0){
    emptyState.hidden = false;
    return;
  } else {
    emptyState.hidden = true;
  }

  for(const t of tickets){
    const clone = ticketTemplate.content.cloneNode(true);
    clone.querySelector('.ticket-title').textContent = t.title;
    clone.querySelector('.id').textContent = `#${t.id}`;
    clone.querySelector('.status').textContent = t.status;
    clone.querySelector('.priority').textContent = t.priority;
    clone.querySelector('.assignee').textContent = `Assignee: ${t.assignee}`;
    clone.querySelector('.createdAt').textContent = `Created: ${formatDate(t.createdAt)}`;
    listContainer.appendChild(clone);
  }
}

// event listeners
statusFilterEl.addEventListener('change', applyFiltersAndRender);
searchInput.addEventListener('input', applyFiltersAndRender);
clearBtn.addEventListener('click', ()=>{
  statusFilterEl.value = 'ALL';
  searchInput.value = '';
  applyFiltersAndRender();
});

// initial render
applyFiltersAndRender();
