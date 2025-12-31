// --- הגדרות וזיכרון ---
let docNumber = parseInt(localStorage.getItem('crmp_doc_num')) || 1001;
let archive = JSON.parse(localStorage.getItem('crmp_archive')) || [];
let clients = JSON.parse(localStorage.getItem('crmp_clients')) || [];

document.getElementById('doc-num-display').innerText = docNumber;
document.getElementById('doc-date').valueAsDate = new Date();

// --- חתימה מותאמת מובייל ---
const canvas = document.getElementById('sig-canvas');
const ctx = canvas.getContext('2d');
let drawing = false;

function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
}
const startDraw = (e) => { drawing = true; ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x, p.y); };
const doDraw = (e) => { if (!drawing) return; e.preventDefault(); const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };
const stopDraw = () => drawing = false;

canvas.addEventListener('mousedown', startDraw); canvas.addEventListener('mousemove', doDraw); window.addEventListener('mouseup', stopDraw);
canvas.addEventListener('touchstart', startDraw); canvas.addEventListener('touchmove', doDraw); canvas.addEventListener('touchend', stopDraw);
function clearSig() { ctx.clearRect(0, 0, canvas.width, canvas.height); }

// --- לוגיקה עסקית ---
function calculate() {
    let sub = 0;
    const vatP = parseFloat(document.getElementById('vat-rate').value) / 100;
    document.querySelectorAll('#items-body tr').forEach(row => {
        const q = row.querySelector('.qty').value || 0;
        const p = row.querySelector('.price').value || 0;
        const total = q * p;
        row.querySelector('.row-total').innerText = total.toFixed(2) + " ₪";
        sub += total;
    });
    const vAmt = sub * vatP;
    document.getElementById('subtotal').innerText = sub.toFixed(2);
    document.getElementById('vat-amount').innerText = vAmt.toFixed(2);
    document.getElementById('final-total').innerText = (sub + vAmt).toFixed(2);
}

function addRow() {
    const html = `<tr><td><input type="text" placeholder="תיאור..." class="item-desc"></td><td><input type="number" class="qty" value="1" oninput="calculate()"></td><td><input type="number" class="price" value="0" oninput="calculate()"></td><td class="row-total">0.00 ₪</td></tr>`;
    document.getElementById('items-body').insertAdjacentHTML('beforeend', html);
}

// --- ניהול לקוחות (חדש!) ---
function renderClients() {
    const sel = document.getElementById('client-select');
    sel.innerHTML = '<option value="">בחר לקוח...</option>';
    clients.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c; opt.text = c;
        sel.add(opt);
    });
}

function addNewClient() {
    const name = prompt("שם לקוח חדש:");
    if (name && !clients.includes(name)) {
        clients.push(name);
        localStorage.setItem('crmp_clients', JSON.stringify(clients));
        renderClients();
        document.getElementById('client-select').value = name;
    } else if (clients.includes(name)) {
        alert("הלקוח כבר קיים ברשימה.");
    }
}

// --- ניהול ארכיון ---
function saveToArchive() {
    const docData = {
        number: docNumber,
        client: document.getElementById('client-select').value || "לקוח מזדמן",
        total: document.getElementById('final-total').innerText,
        date: document.getElementById('doc-date').value,
        type: document.getElementById('doc-type').value,
        status: 'שולם'
    };
    archive.push(docData);
    localStorage.setItem('crmp_archive', JSON.stringify(archive));
    renderArchive();
}

function renderArchive() {
    const body = document.getElementById('archive-body');
    body.innerHTML = '';
    archive.slice().reverse().forEach(doc => {
        const row = `<tr>
            <td>${doc.number}</td>
            <td>${doc.client}</td>
            <td>${doc.total} ₪</td>
            <td><span class="status-pill status-paid">${doc.status}</span></td>
        </tr>`;
        body.insertAdjacentHTML('beforeend', row);
    });
}

function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "מספר מסמך,לקוח,סכום,תאריך,סוג\n";
    archive.forEach(doc => { csvContent += `${doc.number},${doc.client},${doc.total},${doc.date},${doc.type}\n`; });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "CRMP_Report.csv");
    document.body.appendChild(link);
    link.click();
}

function clearArchive() {
    if(confirm("למחוק את כל היסטוריית המסמכים?")) {
        archive = [];
        localStorage.setItem('crmp_archive', JSON.stringify(archive));
        renderArchive();
    }
}

// --- הפקת PDF ---
function generatePDF() {
    const inputs = document.querySelectorAll('input, select');
    const spans = [];
    inputs.forEach(i => {
        const span = document.createElement('span');
        span.className = 'temp-span';
        span.innerText = (i.tagName === 'SELECT') ? i.options[i.selectedIndex].text : i.value;
        i.style.display = 'none';
        i.parentNode.insertBefore(span, i);
        spans.push(span);
    });

    const element = document.getElementById('invoice-content');
    html2pdf().from(element).set({
        margin: 5, filename: `CRMP-${docNumber}.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).save().then(() => {
        spans.forEach(s => s.remove());
        inputs.forEach(i => i.style.display = 'block');
        saveToArchive();
        docNumber++;
        localStorage.setItem('crmp_doc_num', docNumber);
        document.getElementById('doc-num-display').innerText = docNumber;
    });
}

function previewLogo(e) {
    const r = new FileReader();
    r.onload = () => { document.getElementById('user-logo').src = r.result; localStorage.setItem('crmp_logo', r.result); };
    r.readAsDataURL(e.target.files[0]);
}

function shareDoc() {
    const msg = encodeURIComponent(`שלום, הופק עבורך מסמך ב-CRMP ע"ס ${document.getElementById('final-total').innerText} ₪.`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
}

window.onload = () => {
    if(localStorage.getItem('crmp_logo')) document.getElementById('user-logo').src = localStorage.getItem('crmp_logo');
    renderClients();
    renderArchive();
    updateDateDisplay();
};
function updateDateDisplay() { document.getElementById('current-date-display').innerText = document.getElementById('doc-date').value; }
