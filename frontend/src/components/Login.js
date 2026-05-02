import React, { useState } from "react";
import axios from "axios";

function Login({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const res = await axios.post(`https://dataforge-backend-kjsj.onrender.com${endpoint}`, {
        email,
        password
      });

      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userEmail", res.data.email);
        onLoginSuccess();
      } else {
        alert("Registration successful! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      
      {/* 🎯 Decorative Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

      <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-700">
        
        {/* 🎯 Main Glassmorphic Card */}
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-primary-600/40 mb-6 group hover:rotate-6 transition-transform duration-300">
              DF
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-center mb-3 tracking-tight font-outfit text-white">
              {isLogin ? "Welcome Back" : "Get Started"}
            </h2>
            <p className="text-slate-400 text-center text-sm font-medium max-w-[280px]">
              {isLogin ? "Sign in to your DataForge Pro account" : "Join the next generation of data analytics"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Work Email</label>
              <input 
                type="email" 
                required
                placeholder="name@company.com" 
                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300 shadow-inner"
                value={email}
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Password</label>
                {isLogin && <button type="button" className="text-[10px] text-primary-400 font-bold hover:underline">Forgot?</button>}
              </div>
              <input 
                type="password" 
                required
                placeholder="••••••••" 
                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300 shadow-inner"
                value={password}
                onChange={e => setPassword(e.target.value)} 
              />
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl animate-in shake duration-300">
                <p className="text-rose-400 text-xs text-center font-bold tracking-tight">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-primary-600/20 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 mt-4 font-outfit uppercase tracking-wider"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (isLogin ? "Sign In" : "Create Account")}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-slate-500 text-sm font-medium">
              {isLogin ? "New to DataForge?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-white font-black hover:text-primary-400 transition-colors"
              >
                {isLogin ? "Create Account" : "Login Here"}
              </button>
            </p>
          </div>
        </div>
        
        {/* 🎯 Branding Footer */}
        <p className="text-center mt-8 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
          Powered by DataForge Cloud
        </p>
      </div>
    </div>
  );
}

export default Login;
