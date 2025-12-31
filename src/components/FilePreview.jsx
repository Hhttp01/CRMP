import React from 'react';
import { X, FileText, Download, ExternalLink } from 'lucide-react';

export default function FilePreview({ file, onClose, isDark }) {
  if (!file) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transition-colors ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <FileText className="text-blue-500" />
            <h3 className="font-bold truncate">{file.name}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className={`h-96 flex flex-col items-center justify-center p-8 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4">
            <FileText size={40} className="text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-lg font-medium mb-1">{file.name}</p>
          <p className="text-sm text-slate-500 mb-6">{file.size} • נוצר בתאריך {file.date}</p>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">
              <Download size={18} /> הורדה
            </button>
            <button className="flex items-center gap-2 px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              <ExternalLink size={18} /> פתח בדף חדש
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-700">
          תצוגה מקדימה מאובטחת - InvoCRM System
        </div>
      </div>
    </div>
  );
}
