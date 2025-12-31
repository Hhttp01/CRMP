let clients = JSON.parse(localStorage.getItem('crmp_clients_2030')) || [];
let archive = JSON.parse(localStorage.getItem('crmp_archive')) || [];
let docNum = localStorage.getItem('crmp_doc_num') || 1001;

// --- ניווט בין דפים ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(`page-${pageId}`).classList.add('active');
    event.target.classList.add('active');
}

// --- ניהול לקוחות ---
function openClientModal() { document.getElementById('client-modal').style.display = 'flex'; }
function closeClientModal() { document.getElementById('client-modal').style.display = 'none'; }

function saveClient() {
    const client = {
        id: Date.now(),
        name: document.getElementById('new-client-name').value,
        email: document.getElementById('new-client-email').value,
        phone: document.getElementById('new-client-phone').value
    };
    clients.push(client);
    localStorage.setItem('crmp_clients_2030', JSON.stringify(clients));
    renderClients();
    renderClientSelect();
    closeClientModal();
}

function renderClients() {
    const list = document.getElementById('client-list');
    list.innerHTML = clients.map(c => `
        <div class="client-card">
            <h4>${c.name}</h4>
            <p>📧 ${c.email}</p>
            <p>📞 ${c.phone}</p>
            <button onclick="deleteClient(${c.id})" style="color:red; background:none; border:none; cursor:pointer;">מחק</button>
        </div>
    `).join('');
}

function deleteClient(id) {
    clients = clients.filter(c => c.id !== id);
    localStorage.setItem('crmp_clients_2030', JSON.stringify(clients));
    renderClients();
    renderClientSelect();
}

function renderClientSelect() {
    const sel = document.getElementById('client-select-main');
    sel.innerHTML = clients.map(c => `<option value="${c.name}">${c.name}</option>`).join('') || '<option>אין לקוחות</option>';
}

// --- לוגיקת הפקה ---
function calculate() {
    let total = 0;
    document.querySelectorAll('#items-body tr').forEach(row => {
        const q = row.querySelector('.qty').value;
        const p = row.querySelector('.price').value;
        const rowSum = q * p;
        row.querySelector('.row-total').innerText = rowSum.toFixed(2) + ' ₪';
        total += rowSum;
    });
    document.getElementById('total').innerText = total.toFixed(2);
    document.getElementById('subtotal').innerText = (total / 1.17).toFixed(2);
}

function addRow() {
    const tr = `<tr><td><input type="text" class="input-minimal" placeholder="שירות/מוצר"></td><td><input type="number" class="input-minimal qty" value="1" oninput="calculate()"></td><td><input type="number" class="input-minimal price" value="0" oninput="calculate()"></td><td class="row-total">0.00 ₪</td></tr>`;
    document.getElementById('items-body').insertAdjacentHTML('beforeend', tr);
}

function generatePDF() {
    const element = document.getElementById('invoice-content');
    html2pdf().from(element).save().then(() => {
        archive.push({
            num: docNum,
            client: document.getElementById('client-select-main').value,
            total: document.getElementById('total').innerText,
            date: new Date().toLocaleDateString()
        });
        localStorage.setItem('crmp_archive', JSON.stringify(archive));
        docNum++;
        localStorage.setItem('crmp_doc_num', docNum);
        location.reload();
    });
}

// --- חתימה (צמצום קוד למינימום) ---
const canvas = document.getElementById('sig-canvas');
const ctx = canvas.getContext('2d');
let drawing = false;
canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mousemove', (e) => {
    if(!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
});

window.onload = () => {
    renderClients();
    renderClientSelect();
    document.getElementById('doc-num').innerText = docNum;
};
