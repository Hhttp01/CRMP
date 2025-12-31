// --- הגדרות ראשוניות ---
let docNumber = parseInt(localStorage.getItem('crmp_doc_num')) || 1001;
document.getElementById('doc-num-display').innerText = docNumber;
document.getElementById('doc-date').valueAsDate = new Date();

// --- לוגיקת חתימה ---
const canvas = document.getElementById('sig-canvas');
const ctx = canvas.getContext('2d');
let drawing = false;

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => { drawing = false; ctx.beginPath(); });
canvas.addEventListener('mousemove', draw);

function draw(e) {
    if (!drawing) return;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
}

function clearSig() { ctx.clearRect(0, 0, canvas.width, canvas.height); }

// --- חישובים ---
function calculate() {
    let subtotal = 0;
    const vatRate = parseFloat(document.getElementById('vat-rate').value) / 100;
    document.querySelectorAll('#items-body tr').forEach(row => {
        const qty = row.querySelector('.qty').value || 0;
        const price = row.querySelector('.price').value || 0;
        const total = qty * price;
        row.querySelector('.row-total').innerText = total.toFixed(2) + " ₪";
        subtotal += total;
    });
    const vatAmount = subtotal * vatRate;
    document.getElementById('subtotal').innerText = subtotal.toFixed(2);
    document.getElementById('vat-amount').innerText = vatAmount.toFixed(2);
    document.getElementById('final-total').innerText = (subtotal + vatAmount).toFixed(2);
}

// --- פעולות ---
function addRow() {
    const row = `<tr><td><input type="text" placeholder="תיאור..."></td><td><input type="number" class="qty" value="1" oninput="calculate()"></td><td><input type="number" class="price" value="0" oninput="calculate()"></td><td class="row-total">0.00 ₪</td></tr>`;
    document.getElementById('items-body').insertAdjacentHTML('beforeend', row);
}

function generatePDF() {
    // הסתרת כפתורים שלא צריכים להופיע ב-PDF
    document.getElementById('hide-on-pdf-1').style.visibility = 'hidden';
    document.getElementById('hide-on-pdf-2').style.visibility = 'hidden';
    
    const element = document.getElementById('invoice-content');
    const opt = {
        margin: 10,
        filename: `CRMP-Doc-${docNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        // החזרת כפתורים ועדכון מספר מסמך
        document.getElementById('hide-on-pdf-1').style.visibility = 'visible';
        document.getElementById('hide-on-pdf-2').style.visibility = 'visible';
        docNumber++;
        localStorage.setItem('crmp_doc_num', docNumber);
        document.getElementById('doc-num-display').innerText = docNumber;
    });
}

function addNewClient() {
    const name = prompt("שם לקוח:");
    if (name) {
        const sel = document.getElementById('client-select');
        const opt = document.createElement('option');
        opt.value = name; opt.text = name;
        sel.add(opt); sel.value = name;
    }
}

function shareDoc() {
    const text = `שלום, הופק עבורך מסמך חדש ב-CRMP. לצפייה: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

window.onload = () => {
    if(localStorage.getItem('crmp_logo')) document.getElementById('user-logo').src = localStorage.getItem('crmp_logo');
    calculate();
};
