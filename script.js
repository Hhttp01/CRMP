// משתנים לניהול המיקום הנוכחי
let currentPath = []; // מערך ששומר את התיקיות שעברנו בהן
let folderStack = [currentData]; // מחסנית של רמות הנתונים (כדי לחזור אחורה)

function renderExplorer() {
    const grid = document.getElementById('file-grid');
    const breadcrumb = document.getElementById('breadcrumb');
    grid.innerHTML = '';
    
    // עדכון הנתיב בראש המסך (Breadcrumbs)
    breadcrumb.innerHTML = '<span onclick="goBackTo(0)" style="cursor:pointer; color:blue;">מחשב זה</span>';
    currentPath.forEach((folderName, index) => {
        breadcrumb.innerHTML += ` > <span onclick="goBackTo(${index + 1})" style="cursor:pointer; color:blue;">${folderName}</span>`;
    });

    // קבלת התיקייה הנוכחית מהמחסנית
    const items = folderStack[folderStack.length - 1];

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-card';
        if(selectedId === item.id) div.classList.add('selected');
        
        div.innerHTML = `
            <div class="item-icon">${item.type === 'folder' ? '📁' : '📄'}</div>
            <div class="item-name" id="name-${item.id}">${item.name}</div>
        `;

        // לחיצה בודדת לבחירה
        div.onclick = (e) => { 
            e.stopPropagation(); 
            selectedId = item.id;
            renderExplorer(); 
        };

        // לחיצה כפולה לכניסה לתיקייה
        div.ondblclick = () => {
            if(item.type === 'folder') {
                enterFolder(item);
            }
        };
        
        grid.appendChild(div);
    });
}

function enterFolder(folder) {
    currentPath.push(folder.name); // מוסיף את שם התיקייה לנתיב
    folderStack.push(folder.children); // נכנס לרמת הנתונים הבאה
    selectedId = null;
    renderExplorer();
}

function goBackTo(index) {
    // חוזר לרמה מסוימת בנתיב
    currentPath = currentPath.slice(0, index);
    folderStack = folderStack.slice(0, index + 1);
    selectedId = null;
    renderExplorer();
}

// עדכון פונקציית יצירת תיקייה שתעבוד בתוך המיקום הנוכחי
function createNew(type) {
    const name = type === 'folder' ? "תיקייה חדשה" : "מסמך חדש.pdf";
    const newItem = { 
        id: Date.now(), 
        name: name, 
        type: type, 
        children: type === 'folder' ? [] : null 
    };
    
    // מוסיף את הפריט לתיקייה הנוכחית שבה אנו נמצאים
    folderStack[folderStack.length - 1].push(newItem);
    renderExplorer();
}

// מחיקת פריט מהתיקייה הנוכחית
function deleteSelected() {
    if(!selectedId) return;
    const currentItems = folderStack[folderStack.length - 1];
    const index = currentItems.findIndex(i => i.id === selectedId);
    if (index > -1) {
        currentItems.splice(index
