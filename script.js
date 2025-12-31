
// פונקציה לחישוב שורת פריט
function updateTotals() {
    const vatRate = parseFloat(document.getElementById('vat-rate').value) / 100;
    let subtotal = 0;

    const rows = document.querySelectorAll('#items-body tr');
    rows.forEach(row => {
        const qty = row.querySelector('.qty').value;
        const price = row.querySelector('.price').value;
        const total = qty * price;
        row.querySelector('.row-total').innerText = total.toFixed(2) + " ₪";
        subtotal += total;
    });

    const vatAmount = subtotal * vatRate;
    const finalTotal = subtotal + vatAmount;

    // כאן אפשר להוסיף אלמנטים בתחתית הדף שיציגו את הסיכום הסופי
    console.log(`סכום לפני מע"מ: ${subtotal}, מע"מ: ${vatAmount}, סה"כ: ${finalTotal}`);
}

// פונקציה להוספת לקוח חדש (כרגע מדמה הוספה לרשימה)
function addNewClient() {
    const name = prompt("הכנס שם לקוח חדש:");
    if (name) {
        const select = document.getElementById('client-select');
        const option = document.createElement('option');
        option.text = name;
        option.value = name;
        select.add(option);
        select.value = name;
        alert(`הלקוח ${name} נוסף למערכת CRMP`);
    }
}

// פונקציה לשיתוף המסמך
function shareDocument() {
    const clientName = document.getElementById('client-select').value;
    const text = `שלום ${clientName}, מצורף קישור למסמך החדש שלך ממערכת CRMP.`;
    
    if (navigator.share) {
        navigator.share({
            title: 'מסמך מ-CRMP',
            text: text,
            url: window.location.href
        }).then(() => console.log('שיתוף הצליח'))
          .catch((error) => console.log('שגיאה בשיתוף', error));
    } else {
        // Fallback למקרה שאין תמיכה בשיתוף (למשל דפדפן ישן)
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
}

// האזנה לשינויים בטבלה לצורך חישוב מחדש
document.getElementById('invoice-form').addEventListener('input', updateTotals);
