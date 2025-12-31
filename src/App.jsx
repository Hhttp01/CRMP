import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, Users, BarChart3, Menu, X, DollarSign, 
  Sun, Moon, Folder, FileText, ChevronRight, ChevronDown, Plus, Download, 
  Trash2, Eye, FileUp, LogOut
} from 'lucide-react';
import FilePreview from './components/FilePreview';

const initialData = [
  {
    id: 1,
    name: "אלקטרה מוצרי צריכה",
    folders: [
      { 
        id: 'f1', name: "חוזים", isOpen: true,
        files: [{ id: 'doc1', name: "חוזה_שירות_2025.pdf", size: "1.2MB", date: "31/12/2025", type: "pdf" }]
      },
      { 
        id: 'f2', name: "חשבוניות", isOpen: false,
        files: [{ id: 'inv1', name: "חשבונית_מס_10204.pdf", size: "240KB", date: "01/01/2025", type: "invoice" }]
      }
    ]
  }
];

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  
  // טעינה מה-LocalStorage בסטטיק
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('invocrm_data');
    return saved ? JSON.parse(saved) : initialData;
  });

  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id);
  const fileInputRef = useRef(null);

  // שמירה אוטומטית ל-LocalStorage בכל שינוי
  useEffect(() => {
    localStorage.setItem('invocrm_data', JSON.stringify(clients));
  }, [clients]);

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  const addClient = () => {
    const name = prompt("שם לקוח חדש:");
    if (!name) return;
    const newClient = {
      id: Date.now(),
      name,
      folders: [
        { id: `f-inv-${Date.now()}`, name: "חשבוניות", isOpen: true, files: [] },
        { id: `f-gen-${Date.now()}`, name: "כללי", isOpen: false, files: [] }
      ]
    };
    setClients([...clients, newClient]);
    setSelectedClientId(newClient.id);
  };

  const addFolder = () => {
    const folderName = prompt("שם התיקייה החדשה:");
    if (!folderName) return;
    setClients(clients.map(c => c.id === selectedClientId ? {
      ...c, folders: [...c.folders, { id: Date.now(), name: folderName, isOpen: true, files: [] }]
    } : c));
  };

  const generateInvoice = () => {
    const invId = Math.floor(Math.random() * 9000) + 1000;
    const newInvoice = {
      id: Date.now(),
      name: `חשבונית_מס_${invId}.pdf`,
      size: "145KB",
      date: new Date().toLocaleDateString(),
      type: "invoice"
    };

    setClients(clients.map(c => c.id === selectedClientId ? {
      ...c, folders: c.folders.map(f => 
        f.name === "חשבוניות" ? { ...f, files: [newInvoice, ...f.files], isOpen: true } : f
      )
    } : c));
  };

  const toggleFolder = (folderId) => {
    setClients(clients.map(c => c.id === selectedClientId ? {
      ...c, folders: c.folders.map(f => f.id === folderId ? { ...f, isOpen: !f.isOpen } : f)
    } : c));
  };

  const deleteFile = (folderId, fileId) => {
    if(!confirm("האם למחוק את הקובץ?")) return;
    setClients(clients.map(c => c.id === selectedClientId ? {
      ...c, folders: c.folders.map(f => f.id === folderId ? {
        ...f, files: f.files.filter(file => file.id !== fileId)
      } : f)
    } : c));
  };

  return (
