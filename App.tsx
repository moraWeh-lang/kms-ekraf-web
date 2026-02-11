
import React, { useState, useMemo } from 'react';
import { User, UserRole, Document, DocCategory, ChatMessage } from './types';
import { MOCK_DOCUMENTS, USAGE_STATS, POPULAR_TOPICS } from './constants';
import { askKmsBot } from './services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const App: React.FC = () => {
  // --- STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'documents' | 'architecture'>('dashboard');
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleSelection, setRoleSelection] = useState<UserRole>(UserRole.MEMBER);

  // Repository State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocCategory>(DocCategory.ALL);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Halo! Saya asisten AI EKRAF. Tanyakan apa saja tentang SOP atau dokumen organisasi kita.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // --- LOGIC ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation as per flowchart
    if (email && password) {
      setUser({
        id: 'user-1',
        name: email.split('@')[0],
        email: email,
        role: roleSelection
      });
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('dashboard');
  };

  const filteredDocuments = useMemo(() => {
    return MOCK_DOCUMENTS.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.summary.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === DocCategory.ALL || doc.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setIsTyping(true);

    const response = await askKmsBot(msg, chatMessages, MOCK_DOCUMENTS);
    setChatMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsTyping(false);
  };

  // --- VIEWS ---

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          <div className="bg-blue-600 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">KMS EKRAF HIMA SI</h1>
            <p className="text-blue-100 text-sm mt-1">Knowledge Management System login</p>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Kampus</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="marvel@student.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Masuk Sebagai</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setRoleSelection(UserRole.MEMBER)}
                  className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${roleSelection === UserRole.MEMBER ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-500'}`}
                >
                  Anggota
                </button>
                <button 
                  type="button"
                  onClick={() => setRoleSelection(UserRole.ADMIN)}
                  className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${roleSelection === UserRole.ADMIN ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-500'}`}
                >
                  Admin
                </button>
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
            >
              Masuk Ke Sistem
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3">
          <div className="flex items-center gap-10">
            <h1 className="text-xl font-black text-blue-700 tracking-tighter flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">E</div>
              KMS EKRAF
            </h1>
            <nav className="hidden md:flex gap-1 font-medium text-sm">
              <button onClick={() => setCurrentPage('dashboard')} className={`px-4 py-2 rounded-lg transition-all ${currentPage === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}>Dashboard</button>
              <button onClick={() => setCurrentPage('documents')} className={`px-4 py-2 rounded-lg transition-all ${currentPage === 'documents' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}>Repositori</button>
              <button onClick={() => setCurrentPage('architecture')} className={`px-4 py-2 rounded-lg transition-all ${currentPage === 'architecture' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}>Struktur</button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">{user?.name}</p>
              <p className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">{user?.role}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Keluar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* DASHBOARD PAGE */}
        {currentPage === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-slate-900">Halo, {user?.name}! 👋</h2>
                    <p className="text-slate-500 mt-2 leading-relaxed">
                      {user?.role === UserRole.ADMIN 
                        ? 'Anda masuk sebagai Admin. Pantau akses pengetahuan dan kelola dokumentasi divisi di sini.' 
                        : 'Akses cepat semua SOP dan pedoman Divisi Ekonomi Kreatif untuk menunjang program kerja Anda.'}
                    </p>
                    <div className="mt-6 flex gap-3">
                       <button onClick={() => setCurrentPage('documents')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all">
                        Eksplor Pengetahuan
                      </button>
                      <button onClick={() => setIsChatOpen(true)} className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                        Tanya AI Chatbot
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-full bg-blue-50 opacity-50 skew-x-12 -mr-20"></div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    Statistik Penggunaan KMS (Bulanan)
                  </h3>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={USAGE_STATS}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <YAxis hide />
                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Topik Paling Dicari</h3>
                  <div className="space-y-4">
                    {POPULAR_TOPICS.map((topic, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-indigo-400' : 'bg-slate-300'}`}></div>
                          <span className="text-sm font-semibold text-slate-700">{topic.name}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-400">{topic.value}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 italic">Data diperbarui otomatis setiap 24 jam berdasarkan interaksi chatbot.</p>
                  </div>
                </div>

                <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100">
                  <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Knowledge Tip
                  </h4>
                  <p className="text-sm text-indigo-100 leading-relaxed">
                    Gunakan chatbot AI di pojok kanan bawah untuk meringkas dokumen panjang dalam hitungan detik. 
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTS PAGE */}
        {currentPage === 'documents' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex-1 max-w-2xl">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Repositori Pengetahuan</h2>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      placeholder="Cari dokumen, SOP, atau kebijakan..."
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <select 
                    className="px-4 py-3 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as DocCategory)}
                  >
                    {Object.values(DocCategory).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              {user?.role === UserRole.ADMIN && (
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Upload Dokumen
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map(doc => (
                <div key={doc.id} className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter bg-slate-100 px-2 py-1 rounded">
                      {doc.category}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{doc.title}</h4>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">{doc.summary}</p>
                  
                  <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {doc.views} Views
                    </div>
                    <span>{doc.date}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedDoc(doc)}
                    className="w-full mt-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                  >
                    Buka Dokumen
                  </button>
                </div>
              ))}
              {filteredDocuments.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h5 className="text-slate-900 font-bold">Dokumen Tidak Ditemukan</h5>
                  <p className="text-slate-400 text-sm">Coba kata kunci lain atau pilih kategori yang berbeda.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ARCHITECTURE PAGE */}
        {currentPage === 'architecture' && (
          <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <header className="text-center space-y-4">
              <span className="text-blue-600 text-xs font-black uppercase tracking-widest">System Documentation</span>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Arsitektur & Intelegensi</h2>
              <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Platform ini menggabungkan manajemen basis data konvensional dengan Large Language Model (LLM) 
                untuk akses informasi instan bagi anggota organisasi.
              </p>
            </header>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Pilar Knowledge Base</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Setiap dokumen yang diunggah dikategorikan secara otomatis ke dalam klaster AD/ART, SOP, atau Laporan. 
                    Meta-data ini digunakan Gemini sebagai context-window untuk menjawab pertanyaan pengguna.
                  </p>
                </div>
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Context-Aware RAG (Retrieval-Augmented Generation)
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Semantic Search Interface
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-3xl text-white space-y-6">
                <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Engine Intelegensi</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Menggunakan Google Gemini-3-Flash untuk pemrosesan bahasa alami. Kecepatan respon rata-rata &lt; 2 detik 
                    dengan akurasi berbasis fakta dari dokumen internal EKRAF.
                  </p>
                </div>
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm font-semibold text-indigo-300 bg-white/5 p-3 rounded-xl">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                    Zero-latency UI updates
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-indigo-300 bg-white/5 p-3 rounded-xl">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                    System Instruction Guardrails
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* DOCUMENT PREVIEW MODAL */}
      {selectedDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedDoc.title}</h3>
                <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mt-1">{selectedDoc.category}</p>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
              <div className="max-w-2xl mx-auto space-y-8">
                <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 prose prose-slate">
                  <p className="text-slate-600 leading-relaxed font-serif whitespace-pre-wrap">
                    {selectedDoc.content}
                  </p>
                  <div className="mt-12 h-64 bg-slate-50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-200">
                    <span className="text-slate-400 text-sm italic">Visualisasi PDF Preview Tersemat</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setSelectedDoc(null)} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-50">Tutup</button>
              <button className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 text-white shadow-lg shadow-blue-100">Download PDF</button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING CHATBOT */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40 group"
        >
          <svg className="w-8 h-8 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {isChatOpen && (
        <div className="fixed bottom-8 right-8 w-[400px] h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col z-50 border border-blue-100 overflow-hidden animate-in slide-in-from-bottom-12 fade-in duration-300">
          <div className="bg-blue-600 p-6 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center overflow-hidden border-2 border-white/20">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Ekraf" alt="AI Bot" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-none">EKRAF AI Support</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-[10px] text-blue-100 font-bold uppercase tracking-widest">Active Insight</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-blue-100 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-100' 
                  : 'bg-white text-slate-800 shadow-sm border border-slate-200 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 rounded-tl-none flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              <input 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Tanyakan kebijakan atau SOP..."
                className="flex-1 bg-slate-100 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none"
              />
              <button 
                onClick={handleSendMessage}
                className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 active:scale-95 transform transition-transform"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              <button onClick={() => setChatInput('Bagaimana SOP Sponsor?')} className="whitespace-nowrap bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors border border-blue-100 uppercase tracking-tighter">SOP Sponsor</button>
              <button onClick={() => setChatInput('Apa visi HIMA SI?')} className="whitespace-nowrap bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors border border-blue-100 uppercase tracking-tighter">Visi Organisasi</button>
              <button onClick={() => setChatInput('Ringkas AD/ART')} className="whitespace-nowrap bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors border border-blue-100 uppercase tracking-tighter">Ringkas AD/ART</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
