import React, { useState } from 'react';
import axios from 'axios';

const Upload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      setFile(null);
      // Reset file input
      document.getElementById('csv-upload').value = '';
      onUploadSuccess();
      alert('Upload successful!');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass-card p-8 rounded-2xl max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 gradient-text">Upload CSV Data</h2>
      <p className="text-slate-400 mb-8">
        Import your data effortlessly. Upload a CSV file and watch it sync in real-time across your dashboard.
      </p>

      <div className="space-y-6">
        <div className="relative border-2 border-dashed border-slate-700 rounded-xl p-10 text-center hover:border-primary-500 transition-colors group">
          <input
            type="file"
            id="csv-upload"
            accept=".csv"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-2">
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📂</div>
            <p className="text-slate-300 font-medium">
              {file ? file.name : 'Click to browse or drag and drop'}
            </p>
            <p className="text-slate-500 text-sm">Supported format: .csv</p>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className={`w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
            uploading || !file
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/20'
          }`}
        >
          {uploading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Upload Now'
          )}
        </button>
      </div>
    </div>
  );
};

export default Upload;
