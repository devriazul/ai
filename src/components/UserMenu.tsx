"use client";
export function UserMenu({ email }: { email: string }) {
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/login';
  };
  return (
    <div className="flex-1 flex justify-end items-center gap-3">
      <span className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 px-3 py-1 text-sm font-semibold text-white shadow">{email}</span>
      <button
        onClick={handleLogout}
        className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 hover:text-red-600 transition-all shadow"
      >
        Logout
      </button>
    </div>
  );
} 