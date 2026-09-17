import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-up ${
              isSuccess
                ? "border-emerald-200 bg-white text-emerald-700"
                : isError
                ? "border-rose-200 bg-white text-rose-700"
                : "border-sky-200 bg-white text-sky-700"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {isSuccess && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />}
              {isError && <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />}
              {!isSuccess && !isError && <Info className="h-5 w-5 shrink-0 text-sky-500" />}

              <p className="text-sm font-medium text-slate-700 truncate">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="rounded-md p-1 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ToastContainer;
