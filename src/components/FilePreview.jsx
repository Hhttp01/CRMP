import React from 'react';
import { X, FileText, Download } from 'lucide-react';

export default function FilePreview({ file, onClose, isDark }) {
  if (!file) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-lg rounded-2xl shadow-xl p-6 ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <FileText className="text-blue-500" />
            <span className="font-bold truncate">{file.name}</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full"><X /></button>
        </div>
        <div className={`h-48 rounded-xl flex flex-col items-center justify-center mb-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
           <FileText size={48} className="text-slate-400 mb-2" />
           <p className="text-sm text-slate-500">{file.size} • {file.date}</p>
        </div>
        <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
          <Download size={18} /> הורד מסמך
        </button>
      </div>
    </div>
  );
}
