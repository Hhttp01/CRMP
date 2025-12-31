// מסד נתונים מקומי מורחב
let db = {
    clients: JSON.parse(localStorage.getItem('master_db')) || [
        { id: 1, name: "אחזקות אביב", projects: ["מגדל המאה", "בניין הדרים"], debt: 4500 },
        { id: 2, name: "קבוצת עזריאלי", projects: ["מגדל עגול", "מגדל משולש"], debt: 0 }
    ],
    archive: [],
    settings: { vat: 0.17 }
};

window.onload = () => {
    renderTree();
    initCharts();
    setupDragAndDrop();
};

// --- ניהול היררכיה וסייר ---
function renderTree() {
    const root = document.getElementById('tree-root');
    root.innerHTML = '';
    db.clients.forEach(client => {
        const group = document.createElement('div');
        group.className = 'tree-group';
        group.innerHTML = `
            <div class="tree-item client-node" onclick="toggleSub('${client.id}')">
                <span class="folder-icon">📂</span> <strong>${client.name}</strong>
                ${client.debt > 0 ? '<span class="debt-tag">חוב</span>' : ''}
            </div>
            <div id="subs-${client.id}" class="sub-container" style="display:none;">
                ${client.projects.map(p => `
                    <div class="tree-item sub-item" onclick="selectProject('${client.name}', '${p}')">
                        <span class="building-icon">🏢</span> ${p}
                    </div>
                `).join('')}
            </div>
        `;
        root.appendChild(group);
    });
}

function toggleSub(id) {
    const el = document.getElementById('subs-' + id);
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function selectProject(client, project) {
    // עדכון כותרות בכל הדפים
    document.getElementById('client-name-display').innerText = client;
    document.getElementById('project-name-display').innerText = "נכס: " + project;
    document.getElementById('vault-title').innerText = "כספת מסמכים: " + project;
    
    // סימון ויזואלי בסייר
    document.querySelectorAll('.sub-item').forEach(el => el.classList.remove('active-sub'));
    event.currentTarget.classList.add('active-sub');
    
    // מעבר אוטומטי לעורך
    switchView('editor');
}

// --- עורך גליונות חכם (Excel Engine) ---
function addExcelRow() {
    const tbody = document.getElementById('sheet-body');
    const row = tbody.insertRow();
    row.innerHTML = `
        <td>${tbody.rows.length}</td>
        <td><input type="text" class="excel-in" onfocus="updateFormulaBar(this)" oninput="calculateTotal()"></td>
        <td><input type="number" class="excel-in qty" value="1" oninput="calculateTotal()"></td>
        <td><input type="number" class="excel-in prc" value="0" oninput="calculateTotal()"></td>
        <td class="row-total">0.00</td>
    `;
}

function calculateTotal() {
    let subtotal = 0;
    document.querySelectorAll('#sheet-body tr').forEach(row => {
        const q = row.querySelector('.qty').value || 0;
        const p = row.querySelector('.prc').value || 0;
        const total = q * p;
        row.querySelector('.row-total').innerText = total.toLocaleString() + " ₪";
        subtotal += total;
    });
    // עדכון דאשבורד BI בזמן אמת (אוטונומי)
    console.log("Subtotal updated:", subtotal);
}

// --- ניהול קבצים, תיקיות ומדיה ---
function createNewFolder() {
    const name = prompt("שם התיקייה החדשה:");
    if (!name) return;
    const grid = document.getElementById('file-system');
    const folder = document.createElement('div');
    folder.className = 'file-card folder';
    folder.innerHTML = `📁 ${name} <span class="delete-file" onclick="this.parentElement.remove()">×</span>`;
    grid.prepend(folder);
}

function setupDragAndDrop() {
    const zone = document.getElementById('file-system');
    zone.ondragover = (e) => { e.preventDefault(); zone.classList.add('drag-over'); };
    zone.ondragleave = () => zone.classList.remove('drag-over');
    zone.ondrop = (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        handleFileUpload(files);
    };
}

function handleFileUpload(files) {
    const grid = document.getElementById('file-system');
    Array.from(files).forEach(file => {
        const card = document.createElement('div');
        card.className = 'file-card';
        const icon = file.type.includes('video') ? '🎥' : file.type.includes('image') ? '🖼️' : '📄';
        card.innerHTML = `${icon} ${file.name}`;
        grid.appendChild(card);
    });
}
