// נתונים ראשוניים
let fileSystem = [
    { id: 1, name: "אחזקות אביב", type: "folder", children: [] },
    { id: 2, name: "קבוצת עזריאלי", type: "folder", children: [] }
];

// מנהל המיקום הנוכחי
let folderStack = [fileSystem]; // מחסנית של רמות התיקיות
let pathNames = []; // שמות התיקיות בנתיב
let selectedId = null;

window.onload = () => {
    renderExplorer();
    renderSidebar();
};

// הפונקציה המרכזית לרנדור הסייר
function renderExplorer() {
    const grid = document.getElementById('explorer-grid');
    const bc = document.getElementById('breadcrumb');
    grid.innerHTML = '';
    
    // 1. עדכון הנתיב (Breadcrumbs)
    bc.innerHTML = '<span onclick="jumpTo(-1)" style="cursor:pointer; color:blue; text-decoration:underline;">מחשב זה</span>';
    pathNames.forEach((name, index) => {
        bc.innerHTML += ` > <span onclick="jumpTo(${index})" style="cursor:pointer; color:blue; text-decoration:underline;">${name}</span>`;
    });

    // 2. קבלת הפריטים בתיקייה הנוכחית (הרמה האחרונה במחסנית)
    const currentLevelItems = folderStack[folderStack.length - 1];

    if (currentLevelItems.length === 0) {
        grid.innerHTML = '<div style="padding:20px; color:#999;">תיקייה זו ריקה. השתמש בכפתורי הריבון למעלה כדי להוסיף קבצים.</div>';
    }

    currentLevelItems.forEach(item => {
        const div = document.createElement('div');
        div.className = `item-card ${selectedId === item.id ? 'selected' : ''}`;
        
        div.innerHTML = `
            <div class="item-icon">${item.type === 'folder' ? '📁' : '📄'}</div>
            <div class="item-name" id="name-${item.id}">${item.name}</div>
        `;

        // לחיצה אחת לבחירה
        div.onclick = (e) => {
            e.stopPropagation();
            selectedId = item.id;
            renderExplorer(); // רענון כדי להציג בחירה
        };

        // לחיצה כפולה לכניסה לתיקייה
        div.ondblclick = (e) => {
            if (item.type === 'folder') {
                folderStack.push(item.children); // נכנסים פנימה ל-children של התיקייה
                pathNames.push(item.name);
                selectedId = null;
                renderExplorer();
                updateExcelInfo(item.name); // עדכון דף האקסל על הבניין הנבחר
            }
        };

        grid.appendChild(div);
    });
}

// חזרה אחורה בנתיב
function jumpTo(index) {
    // index -1 זה ה-Root
    folderStack = folderStack.slice(0, index + 2);
    pathNames = pathNames.slice(0, index + 1);
    selectedId = null;
    renderExplorer();
}

// יצירת פריט חדש בתוך התיקייה שבה אנו נמצאים כרגע
function createNew(type) {
    const currentItems = folderStack[folderStack.length - 1];
    const name = type === 'folder' ? "תיקייה חדשה" : "מסמך חדש";
    
    const newItem = { 
        id: Date.now(), 
        name: name, 
        type: type, 
        children: type === 'folder' ? [] : null 
    };

    currentItems.push(newItem);
    renderExplorer();
    renderSidebar();
}

// מחיקה מהתיקייה הנוכחית
function deleteItem() {
    if (!selectedId) {
        alert("אנא בחר פריט למחיקה");
        return;
    }
    const currentItems = folderStack[folderStack.length - 1];
    const idx = currentItems.findIndex(i => i.id === selectedId);
    
    if (idx > -1) {
        if (confirm("האם אתה בטוח שברצונך למחוק?")) {
            currentItems.splice(idx, 1);
            selectedId = null;
            renderExplorer();
            renderSidebar();
        }
    }
}

// שינוי שם פריט נבחר
function renameItem() {
    if (!selectedId) return;
    const nameEl = document.getElementById(`name-${selectedId}`);
    nameEl.contentEditable = true;
    nameEl.style.background = "white";
    nameEl.style.border = "1px solid blue";
    nameEl.focus();
    
    nameEl.onblur = () => {
        nameEl.contentEditable = false;
        nameEl.style.background = "transparent";
        nameEl.style.border = "none";
        const currentItems = folderStack[folderStack.length - 1];
        const item = currentItems.find(i => i.id === selectedId);
        item.name = nameEl.innerText;
        renderSidebar();
    };
}
