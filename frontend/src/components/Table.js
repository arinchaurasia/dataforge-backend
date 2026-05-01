import React from 'react';

const Table = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Extract headers, excluding internal fields
  const headers = Array.from(
    new Set(data.flatMap((obj) => Object.keys(obj)))
  ).filter((h) => !['_id', '__v', 'createdAt', 'updatedAt', 'userId', 'reason', 'isImproper'].includes(h));

  return (
    <div className="overflow-x-auto custom-scrollbar">
      {/* 🎯 Fix 6: Prevent column squishing with min-width */}
      <table className="min-w-[900px] w-full text-left border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-slate-900 px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/10 rounded-tl-2xl">
              Status
            </th>
            {headers.map((header, idx) => (
              <th 
                key={header} 
                className={`px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/10 ${idx === headers.length - 1 ? 'rounded-tr-2xl' : ''}`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((row, index) => (
            <tr
              key={row._id || index}
              className={`group transition-all duration-200 hover:bg-primary-500/5 ${row.isImproper ? 'bg-rose-500/[0.02]' : ''}`}
            >
              <td className="sticky left-0 z-10 bg-inherit px-6 py-5 border-b border-white/5 text-center">
                {row.isImproper ? (
                  <div className="flex items-center justify-center">
                    <span title="Improper Data" className="cursor-help w-6 h-6 flex items-center justify-center bg-rose-500/10 text-rose-500 rounded-full text-[10px] animate-pulse">⚠️</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  </div>
                )}
              </td>
              {headers.map((header) => (
                <td key={header} className="px-6 py-5 border-b border-white/5 text-sm font-medium text-slate-300">
                  {row[header]?.toString() || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
