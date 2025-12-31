let docNumber = localStorage.getItem('crmp_doc_num') || 1001;
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

function generatePDF() {
    // שלב קריטי: הפיכת האינפוטים לטקסט לפני ה-PDF כדי שלא יצא ריק
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(i => {
        const span = document.createElement('span');
        span.className = 'temp-span';
        span.innerText = i.value;
        i.style.display = 'none';
        i.parentNode.insertBefore(span, i);
    });

    const element = document.getElementById('invoice-content');
    html2pdf().from(element).set({
        margin: 5, filename: `CRMP-${docNumber}.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).save().then(() => {
        // החזרת המצב לקדמותו
        document.querySelectorAll('.temp-span').forEach(s => s.remove());
        inputs.forEach(i => i.style.display = 'block');
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
    updateDateDisplay();
};
function updateDateDisplay() { document.getElementById('current-date-display').innerText = document.getElementById('doc-date').value; }
