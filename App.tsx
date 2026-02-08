
import React, { useState, useEffect } from 'react';
import { User, UserRole, Document, DocCategory, ChatMessage } from './types';
import { MOCK_DOCUMENTS, ROI_DATA } from './constants';
import { askKmsBot } from './services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'documents' | 'architecture'>('dashboard');
  const [user] = useState<User>({ id: '1', name: 'Marvel', role: UserRole.ADMIN });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Halo! Ada yang bisa saya bantu terkait dokumentasi EKRAF HIMA SI hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const response = await askKmsBot(userMsg, chatMessages, MOCK_DOCUMENTS);
    setChatMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsTyping(false);
  };

  const ChartData = [
    { name: 'Akses Manual', time: 15, fill: '#94a3b8' },
    { name: 'KMS + AI', time: 0.1, fill: '#3b82f6' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header / Nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-blue-700 tracking-tight flex items-center gap-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              EKRAF KMS
            </h1>
            <nav className="hidden md:flex gap-6">
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className={`text-sm font-medium transition-colors ${currentPage === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600 pb-5 -mb-5' : 'text-gray-500 hover:text-blue-600'}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setCurrentPage('documents')}
                className={`text-sm font-medium transition-colors ${currentPage === 'documents' ? 'text-blue-600 border-b-2 border-blue-600 pb-5 -mb-5' : 'text-gray-500 hover:text-blue-600'}`}
              >
                Dokumen SOP
              </button>
              <button 
                onClick={() => setCurrentPage('architecture')}
                className={`text-sm font-medium transition-colors ${currentPage === 'architecture' ? 'text-blue-600 border-b-2 border-blue-600 pb-5 -mb-5' : 'text-gray-500 hover:text-blue-600'}`}
              >
                Struktur Sistem
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
              {user.name[0]}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 relative">
        {currentPage === 'dashboard' && (
          <div className="space-y-8">
            <section className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-2xl p-8 text-white shadow-lg">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold mb-4">Selamat Datang di EKRAF KMS</h2>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Sistem Manajemen Pengetahuan berbasis AI untuk sentralisasi dokumen strategis (AD/ART, GBHKO, SOP) 
                  dan pencegahan knowledge loss dalam transisi kepengurusan Divisi Ekonomi Kreatif HIMA SI.
                </p>
                <div className="mt-6 flex gap-4">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
                    <span className="block text-2xl font-bold">60%</span>
                    <span className="text-xs uppercase tracking-wider text-blue-200">Efisiensi Akses</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
                    <span className="block text-2xl font-bold">100%</span>
                    <span className="text-xs uppercase tracking-wider text-blue-200">Kodifikasi Data</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ROI Analysis */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Analisis ROI & Evaluasi KMS (Menit)
                </h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="time" radius={[4, 4, 0, 0]}>
                        {ChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 space-y-3">
                  {ROI_DATA.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 font-medium">{item.metric}</span>
                      <div className="flex gap-4">
                        <span className="text-red-500 line-through text-xs">{item.before}</span>
                        <span className="text-green-600 font-bold">{item.after}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Methodology */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Roadmap Amrit Tiwana
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="font-bold text-blue-900">Analisis & Pengembangan</h4>
                      <p className="text-sm text-blue-700">Audit asset pengetahuan dan kodifikasi data eksplisit ke database.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 border-l-4 border-gray-300 bg-gray-50 rounded-r-lg opacity-60">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="font-bold text-gray-900">Implementasi AI</h4>
                      <p className="text-sm text-gray-600">Integrasi Google AI Studio untuk pencarian interaktif berbasis NLP.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="font-bold text-green-900">Evaluasi & ROI</h4>
                      <p className="text-sm text-green-700">Pengukuran efektivitas sistem terhadap knowledge loss organisasi.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'documents' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Repositori Pengetahuan</h2>
                <p className="text-sm text-gray-500">Kumpulan dokumen eksplisit Divisi EKRAF</p>
              </div>
              {user.role === UserRole.ADMIN && (
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Upload Dokumen
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs uppercase text-gray-400 bg-gray-50 font-bold">
                    <th className="px-6 py-4">Judul Dokumen</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4">Uploader</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_DOCUMENTS.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                          </svg>
                          <div>
                            <p className="font-semibold text-gray-900">{doc.title}</p>
                            <p className="text-xs text-gray-500">{doc.summary}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
                          {doc.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{doc.uploader}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{doc.date}</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">Buka</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentPage === 'architecture' && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b">Struktur Sistem & Metodologi</h2>
            
            <div className="space-y-12">
              <section>
                <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                  Arsitektur Sistem
                </h3>
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 font-mono text-sm leading-relaxed">
                  <p className="mb-4 text-blue-800">// Alur Interaksi</p>
                  <p>User Input Pertanyaan → React Frontend → Integration Layer → Google AI Studio (Gemini-3-Flash)</p>
                  <p className="mt-2">AI Processes Knowledge Base (PDF/Context) → Natural Language Response → Chatbot UI</p>
                </div>
              </section>

              <section className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                    Database Schema (ERD)
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex gap-2"><strong>users:</strong> id, name, email, password, role_id</li>
                    <li className="flex gap-2"><strong>documents:</strong> id, title, category_id, file_path, upload_date</li>
                    <li className="flex gap-2"><strong>categories:</strong> id, name, description</li>
                    <li className="flex gap-2"><strong>chat_logs:</strong> id, user_id, message, ai_response, timestamp</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                    Hubungan SECI Model
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Externalization:</strong> Pengurus mengkonversi tacit knowledge (pengalaman event) menjadi dokumen SOP digital.</p>
                    <p><strong>Internalization:</strong> Anggota baru belajar secara mandiri melalui Chatbot AI yang memahami konteks dokumen.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Chatbot Toggle Button */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {/* Floating Chatbot Widget */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-blue-100 animate-in slide-in-from-bottom-8">
          <div className="bg-blue-600 p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img src="https://picsum.photos/seed/bot/100/100" alt="bot" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Knowledge Base Chatbot</h4>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-[10px] text-blue-100 font-medium">Online | Google AI Studio</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-blue-200 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none flex gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-100 rounded-b-2xl">
            <div className="flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Tanyakan SOP atau AD/ART..."
                className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              />
              <button 
                onClick={handleSendMessage}
                className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button onClick={() => setInput('Bagaimana SOP Sponsor?')} className="whitespace-nowrap bg-blue-50 text-blue-700 text-[10px] px-2 py-1 rounded-full hover:bg-blue-100 transition-colors border border-blue-100 font-medium">SOP Sponsor</button>
              <button onClick={() => setInput('Ringkas AD/ART')} className="whitespace-nowrap bg-blue-50 text-blue-700 text-[10px] px-2 py-1 rounded-full hover:bg-blue-100 transition-colors border border-blue-100 font-medium">Ringkas AD/ART</button>
              <button onClick={() => setInput('Laporan Bazaar')} className="whitespace-nowrap bg-blue-50 text-blue-700 text-[10px] px-2 py-1 rounded-full hover:bg-blue-100 transition-colors border border-blue-100 font-medium">Laporan Bazaar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
