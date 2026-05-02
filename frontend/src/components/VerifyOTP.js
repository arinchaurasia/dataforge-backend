import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const VerifyOTP = ({ email, onVerified }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      await axios.post('https://dataforge-backend-kjsj.onrender.com/api/auth/verify-otp', { email, otp });
      toast.success("Verified! You can now log in.");
      onVerified();
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-primary-600/40 mb-6">
          DF
        </div>
        <h2 className="text-3xl font-black text-white mb-2">Check your email</h2>
        <p className="text-sm text-slate-400 font-medium">We sent a 6-digit code to <span className="text-white">{email}</span></p>
      </div>

      <div className="space-y-4">
        <input 
          type="text" 
          value={otp} 
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-4 bg-slate-950/50 border border-white/5 rounded-2xl text-center text-3xl tracking-[0.5em] font-black text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
          placeholder="000000"
          maxLength="6"
        />
        
        <button 
          onClick={handleVerify}
          disabled={loading || otp.length !== 6}
          className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black shadow-xl shadow-primary-600/20 active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-widest"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : "Verify Code"}
        </button>

        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] pt-4 cursor-pointer hover:text-white transition-colors" onClick={() => onVerified()}>
          Back to Login
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
