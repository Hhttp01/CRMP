// מערכת הקבצים - מבנה היררכי
let fsData = [
    { id: "1", name: "לקוחות", type: "folder", children: [
        { id: "101", name: "אחזקות אביב", type: "folder", children: [] },
        { id: "102", name: "קבוצת עזריאלי", type: "folder", children: [] }
    ]},
    { id: "2", name: "ארכיון 2025", type: "folder", children: [] }
];

// ניהול המיקום
let navigationStack = [fsData]; // מחסנית התיקיות (לצלילה פנימה)
let pathNames = ["מחשב זה"]; // שמות הנתיב
let selectedId = null;

const navigation = {
    render() {
        const grid = document.getElementById('view-explorer');
        const bc = document.getElementById('breadcrumbs');
        grid.innerHTML = '';
        bc.innerHTML = '';

        // רנדור נתיב (Breadcrumbs)
        pathNames.forEach((name, index) => {
            const step = document.createElement('span');
            step.className = 'breadcrumb-step';
            step.innerText = name + (index < pathNames.length - 1 ? ' > ' : '');
            step.onclick = () => navigation.jumpTo(index);
            bc.appendChild(step);
        });

        // רנדור קבצים בתיקייה הנוכחית
        const currentFolder = navigationStack[navigationStack.length - 1];
        currentFolder.forEach(item => {
            const div = document.createElement('div');
            div.className = `file-item ${selectedId === item.id ? 'selected' : ''}`;
            div.innerHTML = `
                <span class="icon">${item.type === 'folder' ? '📁' : '📄'}</span>
                <span class="name">${item.name}</span>
            `;
            
            div.onclick = (e) => {
                e.stopPropagation();
                selectedId = item.id;
                this.render();
            };

            div.ondblclick = () => {
                if (item.type === 'folder') {
                    navigationStack.push(item.children);
                    pathNames.push(item.name);
                    selectedId = null;
                    this.render();
                } else {
                    this.switchTab('excel', item.name);
                }
            };
            grid.appendChild(div);
        });
    },

    jumpTo(index) {
        navigationStack = navigationStack.slice(0, index + 1);
        pathNames = pathNames.slice(0, index + 1);
        selectedId = null;
        this.render();
    },

    switchTab(view, title = null) {
        document.querySelectorAll('.view-explorer, .excel-container').forEach(v => v.classList.remove('active'));
        document.getElementById('view-explorer').classList.toggle('active', view === 'explorer');
        document.getElementById('view-excel').classList.toggle('active', view === 'excel');
        if(title) document.getElementById('excel-target').innerText = "עורך: " + title;
    }
};

const actions = {
    create(type) {
        const currentFolder = navigationStack[navigationStack.length - 1];
        const newItem = {
            id: Date.now().toString(),
            name: type === 'folder' ? "תיקייה חדשה" : "קובץ חדש",
            type: type,
            children: type === 'folder' ? [] : null
        };
        currentFolder.push(newItem);
        navigation.render();
    },

    rename() {
        if (!selectedId) return;
        const currentFolder = navigationStack[navigationStack.length - 1];
        const item = currentFolder.find(i => i.id === selectedId);
        const newName = prompt("שנה שם:", item.name);
        if (newName) {
            item.name = newName;
            navigation.render();
        }
    },

    delete() {
        if (!selectedId || !confirm("למחוק פריט זה?")) return;
        const currentFolder = navigationStack[navigationStack.length - 1];
        const index = currentLevel = currentFolder.findIndex(i => i.id === selectedId);
        currentFolder.splice(index, 1);
        selectedId = null;
        navigation.render();
    }
};

// אתחול ראשוני
document.addEventListener('DOMContentLoaded', () => {
    navigation.render();
});
