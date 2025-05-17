"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const GREETING = "Welcome to Devriazul Ai virtual assistant!";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [typed, setTyped] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // Typing animation
  useEffect(() => {
    setTyped("");
    setShowConfetti(false);
    let i = 0;
    const interval = setInterval(() => {
      setTyped(GREETING.slice(0, i + 1));
      i++;
      if (i === GREETING.length) {
        clearInterval(interval);
        setTimeout(() => setShowConfetti(true), 400);
      }
    }, 38);
    return () => clearInterval(interval);
  }, []);

  // Hide confetti after 2s
  useEffect(() => {
    if (showConfetti) {
      const timeout = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [showConfetti]);

  // Simple confetti burst using emoji
  function Confetti() {
    return (
      <div className="pointer-events-none fixed inset-0 z-30 flex items-start justify-center overflow-hidden">
        {[...Array(24)].map((_, i) => (
          <span
            key={i}
            className="confetti-emoji"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.7}s`,
              fontSize: `${Math.random() * 1.2 + 1.2}rem`,
              top: 0,
              position: 'absolute',
            }}
          >
            {['🎉','✨','🥳','🎊','💜','💙','💖'][i % 7]}
          </span>
        ))}
        <style jsx>{`
          .confetti-emoji {
            animation: confetti-fall 1.6s cubic-bezier(0.4,0,0.2,1);
            opacity: 0.85;
            pointer-events: none;
          }
          @keyframes confetti-fall {
            0% { transform: translateY(-40px) rotate(-10deg) scale(1); opacity: 0.7; }
            80% { opacity: 1; }
            100% { transform: translateY(90vh) rotate(20deg) scale(1.1); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      localStorage.setItem("isLoggedIn", "true");
      router.replace("/");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100 overflow-hidden">
      {/* Animated Bubbles */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Bubble 1 */}
        <div className="absolute left-10 top-10 w-40 h-40 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-40 blur-2xl animate-bubble1" />
        {/* Bubble 2 */}
        <div className="absolute right-16 top-32 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-300 opacity-30 blur-2xl animate-bubble2" />
        {/* Bubble 3 */}
        <div className="absolute left-1/2 bottom-10 w-52 h-52 rounded-full bg-gradient-to-br from-pink-300 to-blue-300 opacity-30 blur-3xl animate-bubble3" />
        {/* Bubble 4 */}
        <div className="absolute right-1/4 bottom-24 w-28 h-28 rounded-full bg-gradient-to-br from-purple-300 to-pink-200 opacity-40 blur-2xl animate-bubble4" />
        {/* Bubble 5 */}
        <div className="absolute left-1/4 top-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-blue-300 to-purple-200 opacity-30 blur-2xl animate-bubble5" />
      </div>
      {/* Welcome Message with Typing Animation */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 drop-shadow-lg animate-welcome-fade min-h-[2.5rem] md:min-h-[3rem]">
          {typed}
          <span className="inline-block w-2 h-6 md:h-7 align-middle bg-gradient-to-r from-purple-400 to-pink-400 rounded animate-cursor-blink ml-1" />
        </h1>
        {showConfetti && <Confetti />}
      </div>
      {/* Animated Card with Apple AI-style border */}
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="absolute inset-0 rounded-2xl p-[3px] bg-[conic-gradient(from_0deg,_#a78bfa_0%,_#f472b6_33%,_#60a5fa_66%,_#a78bfa_100%)] animate-border-spin" aria-hidden="true" />
        <div className="relative rounded-[1.05rem] bg-white p-8 shadow-xl flex flex-col items-center space-y-6">
          {/* Logo or Avatar */}
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg mb-2 animate-pop-in">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">AI Chat Login</h2>
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-500 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200 focus:scale-[1.03]"
                required
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-500 shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all duration-200 focus:scale-[1.03]"
                required
                placeholder="Enter your password"
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center animate-shake">{error}</div>}
            <button
              type="submit"
              className="w-full rounded-lg py-2.5 text-white font-semibold shadow-md text-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 disabled:opacity-60 relative overflow-hidden group"
              style={{background: 'linear-gradient(90deg, #a78bfa, #f472b6, #60a5fa, #a78bfa)'}}
            >
              <span className="absolute inset-0 z-0 transition-all duration-700 bg-[linear-gradient(270deg,_#a78bfa,_#f472b6,_#60a5fa,_#a78bfa)] bg-[length:200%_200%] group-hover:animate-btn-gradient group-active:scale-95 rounded-lg" aria-hidden="true" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-t-2 border-t-white border-purple-200 rounded-full animate-spin inline-block"></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
      {/* Animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.7s cubic-bezier(0.4,0,0.2,1); }
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.7); }
          80% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-pop-in { animation: pop-in 0.7s cubic-bezier(0.4,0,0.2,1); }
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.4s; }
        /* Bubble Animations */
        @keyframes bubble1 {
          0% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-40px) scale(1.08); opacity: 0.5; }
          100% { transform: translateY(0) scale(1); opacity: 0.3; }
        }
        .animate-bubble1 { animation: bubble1 7s ease-in-out infinite; }
        @keyframes bubble2 {
          0% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { transform: translateY(-30px) scale(1.12); opacity: 0.4; }
          100% { transform: translateY(0) scale(1); opacity: 0.2; }
        }
        .animate-bubble2 { animation: bubble2 8s ease-in-out infinite; }
        @keyframes bubble3 {
          0% { transform: translateY(0) scale(1); opacity: 0.25; }
          50% { transform: translateY(-60px) scale(1.05); opacity: 0.4; }
          100% { transform: translateY(0) scale(1); opacity: 0.25; }
        }
        .animate-bubble3 { animation: bubble3 10s ease-in-out infinite; }
        @keyframes bubble4 {
          0% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 0.5; }
          100% { transform: translateY(0) scale(1); opacity: 0.3; }
        }
        .animate-bubble4 { animation: bubble4 9s ease-in-out infinite; }
        @keyframes bubble5 {
          0% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { transform: translateY(-25px) scale(1.13); opacity: 0.35; }
          100% { transform: translateY(0) scale(1); opacity: 0.2; }
        }
        .animate-bubble5 { animation: bubble5 11s ease-in-out infinite; }
        @keyframes welcome-fade {
          0% { opacity: 0; transform: translateY(-20px) scale(0.98); }
          60% { opacity: 1; transform: translateY(0) scale(1.04); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-welcome-fade { animation: welcome-fade 1.2s cubic-bezier(0.4,0,0.2,1); }
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-cursor-blink { animation: cursor-blink 1s steps(2) infinite; }
        @keyframes border-spin {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        .animate-border-spin {
          animation: border-spin 4s linear infinite;
        }
        @keyframes btn-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .group-hover\:animate-btn-gradient:hover {
          animation: btn-gradient 2s linear infinite;
        }
      `}</style>
    </main>
  );
} 