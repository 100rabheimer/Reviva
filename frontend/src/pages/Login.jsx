import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, ArrowRight, Zap, CheckCircle2, Bot, UserPlus, LogIn, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loginAsDemo } = useAuth();
  const { addToast } = useToast();
  const { theme, toggleTheme } = useTheme();

  // Mode: "login" or "register"
  const [isRegisterMode, setIsRegisterMode] = useState(
    location.pathname === "/signup"
  );

  // Form states
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("merchant@acmefintech.com");
  const [password, setPassword] = useState("password123");
  const [razorpayKey, setRazorpayKey] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(email, password);
    addToast("Logged in successfully as Merchant!", "success");
    navigate("/dashboard");
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!companyName.trim()) {
      addToast("Please enter your Company / Business name", "error");
      return;
    }
    if (!email.trim() || !password.trim()) {
      addToast("Please fill in email and password", "error");
      return;
    }

    register(companyName, email, password, razorpayKey);
    addToast(
      `Welcome to Reviva, ${companyName}! Account created successfully.`,
      "success"
    );
    navigate("/dashboard");
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    addToast("Loaded Reviva Demo Account with live mock data!", "info");
    navigate("/dashboard");
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    const targetEmail = (forgotEmail || email).trim();
    if (!targetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
      setForgotStatus("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: targetEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        setForgotStatus(data.message || "Unable to reset password right now.");
        return;
      }

      setForgotStatus(data.message || `Password reset email sent to ${targetEmail}.`);
      setForgotEmail("");
      setIsForgotPassword(false);
      addToast(data.message || "Password reset email sent.", "success");
    } catch (error) {
      console.error("Forgot password error:", error);
      setForgotStatus("Unable to send reset email right now. Please try again later.");
    }
  };

  return (
    <div className={`relative flex min-h-screen items-center justify-center ${theme === "dark" ? "bg-[#0c1726] text-slate-100" : "bg-[radial-gradient(circle_at_top,_#f4fbff_0%,_#eaf6ff_38%,_#edf7ff_100%)] text-slate-900"} px-4 py-8 sm:px-6 md:px-8 lg:px-12 font-sans transition-colors duration-200`}>
      
      {/* TOP RIGHT FLOATING THEME MODE SWITCHER */}
      <div className="absolute top-5 right-5 z-20">
        <button
          onClick={() => {
            toggleTheme();
            addToast(
              theme === "dark" ? "Switched to Day Mode ☀️" : "Switched to Dark Mode 🌙",
              "info"
            );
          }}
          className="flex items-center gap-2 rounded-xl border border-sky-200 bg-white/90 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xl backdrop-blur-md hover:bg-sky-50 transition active:scale-95"
          title={theme === "dark" ? "Switch to Day Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-4 w-4 text-amber-400" />
              <span>Day Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 text-sky-400" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      <div className="grid w-full max-w-5xl grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12">
        
        {/* LEFT COLUMN: Clean Sticker Logo + Brand Name + Tagline */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-4">
          <div className="relative group">
            {/* Glowing ambient backing */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 blur-2xl opacity-75 group-hover:opacity-100 transition duration-500" />
            
            <img
              src="/logo.png"
              alt="Reviva Logo"
              className="relative h-24 sm:h-32 md:h-40 w-auto object-contain drop-shadow-[0_10px_25px_rgba(0,180,216,0.3)] transition-transform duration-300 hover:scale-105"
            />
          </div>

          <p className={`text-sm sm:text-base font-bold uppercase tracking-wider text-transparent bg-clip-text ${theme === "dark" ? "bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400" : "bg-gradient-to-r from-amber-600 via-cyan-600 to-emerald-600"}`}>
            AI Powered Payments & Recovery
          </p>

          <p className={`text-xs sm:text-sm max-w-md leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
            Automate failed Razorpay payment retries, prevent silent subscriber churn, and generate personalized customer outreach using applied GenAI intelligence.
          </p>

          <div className={`space-y-2.5 pt-2 text-xs font-semibold ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
            <div className="flex items-center gap-2.5">
              <Zap className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Real-Time Razorpay Webhook Event Listener</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Bot className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>LLM Failure Classification & A/B Messaging</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Smart Retry Scheduler & Revenue Intelligence</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Merchant Auth Card (Sign In / Register Switcher) */}
        <div className="w-full">
          <div className="rounded-3xl border border-sky-100 bg-white/90 p-8 shadow-2xl shadow-sky-100/60 backdrop-blur-xl">
            
            {/* Mode Tabs */}
            <div className="flex items-center justify-between border-b border-sky-100 pb-4 mb-6">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                    !isRegisterMode
                      ? "bg-sky-600 text-white shadow border border-sky-500"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsRegisterMode(true)}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                    isRegisterMode
                      ? "bg-amber-500 text-white shadow"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register New Account</span>
                </button>
              </div>
            </div>

            {/* SIGN IN FORM */}
            {!isRegisterMode ? (
              <form onSubmit={handleLoginSubmit} className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Merchant Email Address
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-sky-200 bg-sky-50/60 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                      placeholder="merchant@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-sky-200 bg-sky-50/60 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3.5 text-sm font-bold text-white shadow-lg transition hover:from-amber-600 hover:to-orange-700 active:scale-98"
                >
                  <span>Sign In to Merchant Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setForgotEmail(email);
                      setForgotStatus("");
                    }}
                    className="text-xs font-semibold text-sky-600 transition hover:text-sky-700"
                  >
                    Forgot password?
                  </button>
                </div>
              </form>
            ) : (
              /* REGISTER NEW ACCOUNT FORM */
              <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Company / Business Name *
                  </label>
                  <div className="mt-1.5">
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full rounded-xl border border-sky-200 bg-sky-50/60 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                      placeholder="e.g. Acme Fintech Corp"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Work Email Address *
                  </label>
                  <div className="mt-1.5">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-sky-200 bg-sky-50/60 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                      placeholder="billing@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Password *
                  </label>
                  <div className="mt-1.5">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-sky-200 bg-sky-50/60 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                      placeholder="Create a strong password"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Razorpay Key ID (Optional)
                  </label>
                  <div className="mt-1.5">
                    <input
                      type="text"
                      value={razorpayKey}
                      onChange={(e) => setRazorpayKey(e.target.value)}
                      className="w-full rounded-xl border border-sky-200 bg-sky-50/60 px-4 py-2.5 text-xs font-mono text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                      placeholder="rzp_test_..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3.5 text-sm font-bold text-white shadow-lg transition hover:from-amber-600 hover:to-orange-700 active:scale-98"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register Merchant Account</span>
                </button>
              </form>
            )}

            {isForgotPassword && (
              <form onSubmit={handleForgotPassword} className="mt-5 space-y-4 border-t border-slate-800 pt-5 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Reset Email Address
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      required
                      value={forgotEmail || email}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full rounded-xl border border-sky-200 bg-sky-50/60 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                      placeholder="merchant@company.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 py-3.5 text-sm font-bold text-white shadow-lg transition hover:from-cyan-600 hover:to-sky-700 active:scale-98"
                >
                  <span>Send Reset Link</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                {forgotStatus && (
                  <p className="text-xs text-sky-300">{forgotStatus}</p>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setForgotStatus("");
                  }}
                  className="text-xs font-semibold text-slate-500 transition hover:text-slate-700"
                >
                  Back to sign in
                </button>
              </form>
            )}

            {!isForgotPassword && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-sky-100" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-slate-500 font-semibold">
                      Or Quick Evaluation
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleDemoLogin}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 py-3 text-sm font-bold text-slate-700 hover:bg-sky-100 transition"
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Launch Live Demo Account</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
