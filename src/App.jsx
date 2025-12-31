import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, Users, BarChart3, Menu, X, DollarSign, 
  Sun, Moon, Folder, FileText, ChevronRight, ChevronDown, Plus, Download, 
  Trash2, Eye, FileUp
} from 'lucide-react';
import FilePreview from './components/FilePreview'; // ייבוא הרכיב החדש

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null); // סטייט לתצוגה מקדימה
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "אלקטרה מוצרי צריכה",
      folders: [
        { 
          id: 'f1', name: "חוזים", isOpen: true,
          files: [{ id: 'doc1', name: "חוזה_שירות_2024.pdf", size: "1.2MB", date: "12/12/2023", type: "pdf" }]
        },
        { 
          id: 'f2', name: "חשבוניות", isOpen: false,
          files: [{ id: 'inv1', name: "חשבונית_מס_10204.pdf", size: "240KB", date: "01/01/2024", type: "invoice" }]
        }
      ]
    }
  ]);
  
  const [selectedClientId, setSelectedClientId] = useState(1);
  const fileInputRef = useRef(null);
  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  // פונקציות עזר (הוספת לקוח, תיקייה, חשבונית...)
  const generateInvoice = () => {
    const invId = Math.floor(Math.random() * 9000) + 1000;
    const newInvoice = {
      id: Date.now(),
      name: `חשבונית_מס_${invId}.pdf`,
      size: "150KB",
      date: new Date().toLocaleDateString(),
      type: "invoice"
    };

    setClients(clients.map(c => c.id === selectedClientId ? {
      ...c, folders: c.folders.map(f => f.name === "חשבוניות" ? { ...f, files: [newInvoice, ...f.files], isOpen: true } : f)
    } : c));
  };

  return (
    <div className={`min-h-screen flex font-sans ${isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`} dir="rtl">
      
      {/* רכיב תצוגה מקדימה - מופיע רק כשנבחר קובץ */}
      <FilePreview 
        file={previewFile} 
        onClose={() => setPreviewFile(null)} 
        isDark={isDark} 
      />

      {/* Sidebar & Header (כפי שהיה קודם) */}
      {/* ... הקוד של ה-Sidebar וה-Header נשאר זהה ... */}

      <main className="flex-1 lg:mr-72 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">ניהול קבצים</h3>
            <button onClick={generateInvoice} className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
               <DollarSign size={18} /> הפק חשבונית מהירה
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* רשימת לקוחות */}
            <div className={`lg:col-span-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
               {clients.map(client => (
                 <button key={client.id} onClick={() => setSelectedClientId(client.id)} className={`w-full text-right p-4 rounded-xl ${selectedClientId === client.id ? 'bg-blue-600 text-white' : ''}`}>
                   {client.name}
                 </button>
               ))}
            </div>

            {/* סייר קבצים */}
            <div className={`lg:col-span-8 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="p-4">
                {selectedClient.folders.map(folder => (
                  <div key={folder.id} className="mb-4">
                    <div className="flex items-center gap-2 mb-2 font-bold"><Folder size={18}/> {folder.name}</div>
                    <div className="mr-6 space-y-2">
                      {folder.files.map(file => (
                        <div key={file.id} className="flex justify-between p-3 bg-slate-100/50 dark:bg-slate-700/30 rounded-xl group">
                          <span>{file.name}</span>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setPreviewFile(file)} className="text-blue-500"><Eye size={18}/></button>
                            <button className="text-slate-400"><Download size={18}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
