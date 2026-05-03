import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://dataforge-backend-kjsj.onrender.com";

function Login({ onLoginSuccess }) {
  const [view, setView] = useState("login"); // login, register, forgot, reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#/reset-password/")) {
      const token = hash.split("#/reset-password/")[1];
      if (token) {
        setResetToken(token);
        setView("reset");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    
    try {
      if (view === "login") {
        const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userEmail", res.data.email);
        onLoginSuccess();
      } else if (view === "register") {
        await axios.post(`${API_BASE}/api/auth/register`, { email, password });
        setView("login");
        setMessage("Registration successful! Please login.");
      } else if (view === "forgot") {
        await axios.post(`${API_BASE}/api/auth/forgot-password`, { email });
        setMessage("If an account exists, a reset link has been sent to your email.");
      } else if (view === "reset") {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        await axios.post(`${API_BASE}/api/auth/reset-password`, { token: resetToken, password });
        setMessage("Password reset successful! You can now login.");
        setView("login");
        window.history.pushState({}, "", "/"); // Clear URL
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => {
    switch (view) {
      case "register": return { title: "Get Started", subtitle: "Join the next generation of data analytics" };
      case "forgot": return { title: "Reset Password", subtitle: "Enter your email to receive a reset link" };
      case "reset": return { title: "New Password", subtitle: "Secure your account with a new password" };
      default: return { title: "Welcome Back", subtitle: "Sign in to your DataForge Pro account" };
    }
  };

  const { title, subtitle } = renderHeader();

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
              {title}
            </h2>
            <p className="text-slate-400 text-center text-sm font-medium max-w-[280px]">
              {subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {view !== "reset" && (
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
            )}

            {(view === "login" || view === "register" || view === "reset") && (
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    {view === "reset" ? "New Password" : "Password"}
                  </label>
                  {view === "login" && (
                    <button 
                      type="button" 
                      onClick={() => setView("forgot")}
                      className="text-[10px] text-primary-400 font-bold hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
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
            )}

            {view === "reset" && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300 shadow-inner"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)} 
                />
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 animate-in shake duration-300">
                <p className="text-xs text-center font-bold tracking-tight">{error}</p>
              </div>
            )}

            {message && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 animate-in fade-in duration-300">
                <p className="text-xs text-center font-bold tracking-tight">{message}</p>
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
                  <span>Processing...</span>
                </div>
              ) : (
                view === "login" ? "Sign In" : 
                view === "register" ? "Create Account" : 
                view === "forgot" ? "Send Link" : "Reset Password"
              )}
            </button>

            {view === "forgot" && (
              <button 
                type="button"
                onClick={() => setView("login")}
                className="w-full text-slate-500 text-xs font-bold hover:text-white transition-colors pt-2"
              >
                Back to Login
              </button>
            )}
          </form>

          {(view === "login" || view === "register") && (
            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-slate-500 text-sm font-medium">
                {view === "login" ? "New to DataForge?" : "Already have an account?"}
                <button 
                  onClick={() => setView(view === "login" ? "register" : "login")}
                  className="ml-2 text-white font-black hover:text-primary-400 transition-colors"
                >
                  {view === "login" ? "Create Account" : "Login Here"}
                </button>
              </p>
            </div>
          )}
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
