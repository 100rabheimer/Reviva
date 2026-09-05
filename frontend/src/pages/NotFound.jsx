import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-[#F7F4EE] p-6">
      <div className="w-full max-w-lg text-center">
        {/* 404 */}
        <p className="text-7xl font-bold tracking-tight text-[#C66A2B] sm:text-9xl">
          404
        </p>

        {/* Content */}
        <h1 className="mt-6 text-2xl font-semibold text-[#1F1F1C] sm:text-3xl">
          Page not found
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500 sm:text-base">
          The page you're looking for doesn't exist, may have been moved,
          or the URL might be incorrect.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#DDD8CF] bg-white px-5 py-3 text-sm font-medium text-[#1F1F1C] transition hover:bg-[#FAF9F6]"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1F1F1C] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            <Home size={18} />
            Go to Dashboard
          </button>
        </div>
      </div>
    </main>
  );
}

export default NotFound;