import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Upload from './components/Upload';
import Table from './components/Table';
import Filter from './components/Filter';
import Pagination from './components/Pagination';
import Login from './components/Login';
import Chart from './components/Chart';

const socket = io('https://dataforge-backend-kjsj.onrender.com');

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ field: '', value: '', q: '' });
  const [stats, setStats] = useState({ 
    total: 0, 
    valid: 0, 
    invalid: 0, 
    qualityScore: 100,
    issueBreakdown: [],
    insights: { highestSalary: 0, topCity: 'N/A', topRole: 'N/A' } 
  });
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
        const response = await axios.get('https://dataforge-backend-kjsj.onrender.com/api/data', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: 10, field: filters.field, value: filters.value, q: filters.q },
      });
      setData(response.data.data);
      setTotal(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      if (error.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  }, [page, filters, token]);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get('https://dataforge-backend-kjsj.onrender.com/api/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, [token]);

  const handleExport = async () => {
    try {
      const response = await axios.get('https://dataforge-backend-kjsj.onrender.com/api/export', {
        headers: { Authorization: `Bearer ${token}` },
        params: { field: filters.field, value: filters.value, q: filters.q },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dataforge_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      toast.success("Export successful");
    } catch (err) {
      toast.error("Export failed");
    }
  };

  const handleClearData = async () => {
    if (!window.confirm("Wipe all data?")) return;
    try {
      await axios.delete('https://dataforge-backend-kjsj.onrender.com/api/data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData([]);
      setTotal(0);
      toast.success("Database cleared");
      fetchData();
      fetchStats();
    } catch (err) {
      toast.error("Wipe failed");
    }
  };

  useEffect(() => {
    fetchData();
    fetchStats();
  }, [fetchData, fetchStats]);

  useEffect(() => {
    socket.on('dataUpdated', () => {
      fetchData();
      fetchStats();
    });
    return () => { socket.off('dataUpdated'); };
  }, [fetchData, fetchStats]);

  const handleLoginSuccess = () => { setToken(localStorage.getItem('token')); };
  const handleLogout = () => { localStorage.removeItem('token'); setToken(null); };

  const handleFilter = (field, value) => { setFilters({ field, value, q: '' }); setPage(1); };
  const handleGlobalSearch = (query) => { setFilters({ field: '', value: '', q: query }); setPage(1); };
  const handleUploadSuccess = () => { setActiveTab('dashboard'); toast.success("Processing complete"); };

  const getScoreColor = (score) => {
      if (score >= 95) return 'text-emerald-400 border-emerald-400/20';
      if (score >= 80) return 'text-amber-400 border-amber-400/20';
      return 'text-rose-400 border-rose-400/20';
  };

  if (!token) return <Login onLoginSuccess={handleLoginSuccess} />;

  return (
    <div className="flex bg-slate-950 text-slate-100 font-sans selection:bg-primary-500/30 min-h-screen">
      <Toaster position="bottom-right" />
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      
      <main className="flex-1 p-4 lg:p-6 lg:ml-64 transition-all duration-300">
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-white/5 mb-6">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-black text-xs">DF</div>
                <span className="font-bold font-outfit text-sm">DataForge Pro</span>
             </div>
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-400">☰</button>
          </div>

          {activeTab === 'dashboard' ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              
              {/* Header Overview Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-black tracking-tight font-outfit">Dashboard</h1>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Session: {localStorage.getItem('userEmail')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="glass-card px-4 py-2 rounded-xl border-white/5 flex items-center gap-3 shadow-lg">
                    <span className="text-primary-400 text-xs">📊</span>
                    <div className="leading-none">
                      <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-0.5">Rows</p>
                      <p className="text-xs font-black font-outfit">{stats.total.toLocaleString()}</p>
                    </div>
                  </div>
                  {/* 🎯 Fix: Professional "Integrity" replacement for "Health" */}
                  <div 
                    title="Integrity Score = % of records passing all validation checks"
                    className={`glass-card px-4 py-2 rounded-xl border flex items-center gap-3 shadow-xl transition-all cursor-help ${getScoreColor(stats.qualityScore)}`}
                  >
                    <span className="text-xs">🛡️</span>
                    <div className="leading-none text-slate-100">
                      <p className="text-[8px] opacity-60 uppercase font-black tracking-widest mb-0.5">Integrity</p>
                      <p className="text-xs font-black font-outfit">{stats.qualityScore}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT SIDE (2 Columns) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  
                  {/* Top Cards Alignment */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="glass-card p-4 rounded-xl border-white/5 flex items-center gap-3 transition-all hover:bg-white/5">
                      <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 text-sm font-bold">₹</div>
                      <div>
                        <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Salary</p>
                        <p className="text-sm font-black text-slate-200 font-outfit">₹{stats.insights.highestSalary.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="glass-card p-4 rounded-xl border-white/5 flex items-center gap-3 transition-all hover:bg-white/5">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 text-sm">📍</div>
                      <div>
                        <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">City</p>
                        <p className="text-sm font-black text-slate-200 font-outfit">{stats.insights.topCity}</p>
                      </div>
                    </div>
                    <div className="glass-card p-4 rounded-xl border-white/5 flex items-center gap-3 transition-all hover:bg-white/5">
                      <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 text-sm">💼</div>
                      <div>
                        <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Role</p>
                        <p className="text-sm font-black text-slate-200 font-outfit">{stats.insights.topRole}</p>
                      </div>
                    </div>
                  </div>

                  {/* Chart Section */}
                  <Chart />
                </div>

                {/* RIGHT SIDE (Management & Integrity Audit) */}
                <div className="flex flex-col gap-6">
                   <div className="glass-card p-6 rounded-3xl border-white/5 flex flex-col space-y-6 h-fit">
                      <div>
                        {/* 🎯 Fix: Professionalized Panel Name */}
                        <h3 className="text-lg font-black mb-1 font-outfit">Integrity Audit</h3>
                        <p className="text-[11px] text-slate-500">Breakdown of the {stats.qualityScore}% integrity score.</p>
                      </div>
                      
                      {/* Integrity Issues Breakdown */}
                      <div className="space-y-2">
                        {stats.issueBreakdown && stats.issueBreakdown.length > 0 ? (
                           stats.issueBreakdown.map((issue, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-white/5 group hover:border-primary-500/30 transition-all">
                                 <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full group-hover:scale-125 transition-all" />
                                    <span className="text-[11px] font-bold text-slate-300">{issue._id}</span>
                                 </div>
                                 <span className="text-[10px] font-black bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-md">{issue.count}</span>
                              </div>
                           ))
                        ) : (
                           <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-center">
                              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Verified 100% Integrity ✨</p>
                           </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-white/5 space-y-3">
                         <div className="flex items-center justify-between gap-4">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System</span>
                            <button onClick={handleClearData} className="px-3 py-1.5 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-lg text-[9px] font-black transition-all border border-rose-500/10">WIPE ALL</button>
                         </div>
                      </div>
                   </div>
                </div>

              </div>

              {/* Data Table Section */}
              <div className="glass-card p-5 md:p-8 rounded-[2rem] border-white/5 space-y-6">
                <div className="flex flex-col min-[1200px]:flex-row min-[1200px]:items-center justify-between gap-4 pb-2">
                  <div>
                    <h3 className="text-xl font-black tracking-tight font-outfit">Managed Dataset</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-bold uppercase tracking-widest">Showing {data.length} records</p>
                  </div>
                  <div className="w-full min-[1200px]:w-auto">
                    <Filter 
                        onFilter={handleFilter} 
                        onGlobalSearch={handleGlobalSearch} 
                        onExport={handleExport}
                    />
                  </div>
                </div>
                
                <div className="overflow-x-auto rounded-2xl border border-white/5 shadow-inner bg-slate-900/20">
                   {loading ? (
                       <div className="space-y-3 p-4">
                           {[...Array(4)].map((_, i) => (
                               <div key={i} className="h-14 bg-slate-900/50 rounded-xl animate-pulse" />
                           ))}
                       </div>
                   ) : (
                       <Table data={data} />
                   )}
                </div>

                <div className="flex justify-between items-center pt-2">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Page {page} of {totalPages}</p>
                   <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 flex justify-center">
               <Upload onUploadSuccess={handleUploadSuccess} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
