// מבנה הנתונים ההתחלתי
let fileSystem = [
    { id: 1, name: "לקוחות", type: "folder", children: [
        { id: 101, name: "אחזקות אביב", type: "folder", children: [] },
        { id: 102, name: "קבוצת עזריאלי", type: "folder", children: [] }
    ]},
    { id: 2, name: "דוחות שנתיים", type: "folder", children: [] }
];

let folderStack = [fileSystem]; // מחסנית התיקיות לניווט
let pathNames = []; // שמות התיקיות בנתיב
let selectedId = null;

window.onload = () => {
    renderExplorer();
};

function renderExplorer() {
    const grid = document.getElementById('file-grid');
    const bc = document.getElementById('breadcrumb');
    grid.innerHTML = '';
    
    // רנדור נתיב הניווט (Breadcrumbs)
    bc.innerHTML = '<span class="breadcrumb-item" onclick="jumpTo(-1)">מחשב זה</span>';
    pathNames.forEach((name, index) => {
        bc.innerHTML += ` <span style="color:#aaa"> > </span> <span class="breadcrumb-item" onclick="jumpTo(${index})">${name}</span>`;
    });

    // קבלת הפריטים בתיקייה שבה אנחנו נמצאים כרגע
    const currentItems = folderStack[folderStack.length - 1];

    currentItems.forEach(item => {
        const div = document.createElement('div');
        div.className = `item-card ${selectedId === item.id ? 'selected' : ''}`;
        
        div.innerHTML = `
            <span class="item-icon">${item.type === 'folder' ? '📁' : '📄'}</span>
            <span class="item-name" id="name-${item.id}">${item.name}</span>
        `;

        div.onclick = (e) => {
            e.stopPropagation();
            selectedId = item.id;
            renderExplorer();
        };

        div.ondblclick = (e) => {
            if (item.type === 'folder') {
                folderStack.push(item.children); // צלילה פנימה
                pathNames.push(item.name);
                selectedId = null;
                renderExplorer();
            }
        };

        grid.appendChild(div);
    });
}

function createNew(type) {
    const currentLevel = folderStack[folderStack.length - 1];
    const newId = Date.now();
    const name = type === 'folder' ? "תיקייה חדשה" : "קובץ חדש";
    
    const newItem = { 
        id: newId, 
        name: name, 
        type: type, 
        children: type === 'folder' ? [] : null 
    };

    currentLevel.push(newItem);
    selectedId = newId;
    renderExplorer();
}

function jumpTo(index) {
    // חוזר לרמה שנבחרה בנתיב
    folderStack = folderStack.slice(0, index + 2);
    pathNames = pathNames.slice(0, index + 1);
    selectedId = null;
    renderExplorer();
}

function deleteItem() {
    if (!selectedId) return;
    const currentLevel = folderStack[folderStack.length - 1];
    const idx = currentLevel.findIndex(i => i.id === selectedId);
    if (idx > -1) {
        currentLevel.splice(idx, 1);
        selectedId = null;
        renderExplorer();
    }
}

function renameItem() {
    if (!selectedId) return;
    const el = document.getElementById(`name-${selectedId}`);
    const currentLevel = folderStack[folderStack.length - 1];
    const item = currentLevel.find(i => i.id === selectedId);
    
    const newName = prompt("הזן שם חדש:", item.name);
    if (newName) {
        item.name = newName;
        renderExplorer();
    }
}

function switchTab(view) {
    document.getElementById('explorer-view').style.display = view === 'explorer' ? 'grid' : 'none';
    document.getElementById('excel-view').style.display = view === 'excel' ? 'block' : 'none';
}
