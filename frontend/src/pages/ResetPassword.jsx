import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2, ArrowLeft } from "lucide-react";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token || !email) {
      setStatus({ type: "error", message: "This reset link is missing required information." });
      return;
    }

    if (password.length < 6) {
      setStatus({ type: "error", message: "Password must be at least 6 characters long." });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus({ type: "error", message: data.message || "Unable to reset password." });
        return;
      }

      setStatus({ type: "success", message: data.message || "Password updated successfully." });
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (error) {
      console.error("Reset password error:", error);
      setStatus({ type: "error", message: "Something went wrong while resetting your password." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#f4fbff_0%,_#edf7ff_40%,_#e8f4ff_100%)] px-4 py-12 text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-sky-100 bg-white/90 p-6 shadow-2xl shadow-sky-100/60">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </button>

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Security</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Create a new password</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">New password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-11 text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Confirm password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-11 text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                placeholder="Re-enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {status.message && (
            <div
              className={`rounded-xl border px-3 py-2 text-sm ${
                status.type === "success"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/40 bg-red-500/10 text-red-300"
              }`}
            >
              {status.type === "success" ? <CheckCircle2 className="mr-2 inline-block h-4 w-4" /> : null}
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:from-sky-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Updating password..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
