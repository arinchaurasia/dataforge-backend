import React, { useState } from 'react';

const Filter = ({ onFilter, onGlobalSearch, onExport }) => {
  const [field, setField] = useState('');
  const [value, setValue] = useState('');
  const [globalValue, setGlobalValue] = useState('');

  const handleApply = () => {
    onFilter(field, value);
    setGlobalValue(''); // Clear global when field search is used
  };

  const handleGlobalApply = (e) => {
    if (e.key === 'Enter') {
        onGlobalSearch(globalValue);
        setField('');
        setValue('');
    }
  };

  const handleClear = () => {
    setField('');
    setValue('');
    setGlobalValue('');
    onFilter('', '');
  };

  const fields = [
    { label: 'Select Field', value: '' },
    { label: 'Emp ID', value: 'empId' },
    { label: 'Name', value: 'name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Email', value: 'email' },
    { label: 'Age', value: 'age' },
    { label: 'City', value: 'city' },
    { label: 'Role', value: 'role' },
    { label: 'Skills', value: 'skills' },
  ];

  return (
    <div className="flex flex-col xl:flex-row xl:items-center gap-6">
      {/* 🎯 Target 4: Global Search */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary-400 transition-colors">
           🔍
        </div>
        <input
          type="text"
          placeholder="Global Search (Press Enter)..."
          value={globalValue}
          onKeyDown={handleGlobalApply}
          onChange={(e) => setGlobalValue(e.target.value)}
          className="bg-slate-900/50 border border-slate-800 text-slate-200 text-sm rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary-500/50 transition-all w-full xl:w-72 placeholder:text-slate-600 shadow-lg"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 p-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner">
        <div className="flex flex-col gap-1 px-2">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Filter By</label>
          <select
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="bg-transparent border-none text-slate-200 text-sm rounded-lg py-1 px-1 outline-none focus:ring-0 cursor-pointer w-32"
          >
            {fields.map(f => <option key={f.value} value={f.value} className="bg-slate-900">{f.label}</option>)}
          </select>
        </div>
        <div className="w-[1px] h-8 bg-white/10 hidden sm:block" />
        <div className="flex flex-col gap-1 px-2">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Value</label>
          <input
            type="text"
            placeholder="Search..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="bg-transparent border-none text-slate-200 text-sm py-1 px-1 outline-none focus:ring-0 placeholder:text-slate-600 w-36"
          />
        </div>
        <div className="flex gap-2 ml-auto sm:ml-0">
          <button
            onClick={handleApply}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black transition-all border border-white/5 active:scale-95"
          >
            APPLY
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-2 text-slate-500 hover:text-white transition-colors text-xs font-bold"
          >
            RESET
          </button>
        </div>
      </div>

      {/* 🎯 Target 2: Export Button */}
      <button
        onClick={onExport}
        className="flex items-center gap-2 px-6 py-3 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-600/20 rounded-2xl text-xs font-black transition-all shadow-lg active:scale-95 ml-auto"
      >
        📥 EXPORT CSV
      </button>
    </div>
  );
};

export default Filter;
