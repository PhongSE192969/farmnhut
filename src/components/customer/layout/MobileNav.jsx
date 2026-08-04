import { Link } from "react-router-dom";
import { X, User, LogOut, Loader2 } from "lucide-react";

export default function MobileNav({
  open,
  onClose,
  navLinks,
  isCustomer,
  isBackOfficeUser,
  dashboardPath,
  isLoggingOut,
  onLogout,
  labels = {},
}) {
  if (!open) return null;

  return (
    <div
      className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex flex-col pt-20 px-6 gap-2"
      role="dialog"
      aria-modal="true"
      aria-label="Menu điều hướng"
    >
      <button
        onClick={onClose}
        aria-label="Đóng menu"
        className="absolute top-4 right-4 text-white size-10 flex items-center justify-center"
      >
        <X size={24} />
      </button>

      {navLinks.map((link) => (
        <Link
          key={link.key}
          to={link.href}
          onClick={onClose}
          className="text-2xl font-black text-white/80 hover:text-customer-accent transition-colors py-3 border-b border-white/10"
        >
          {link.label}
        </Link>
      ))}

      <div className="flex flex-col gap-3 mt-6">
        {isCustomer ? (
          <>
            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center justify-center gap-2 h-12 bg-customer-accent text-customer-primaryDark font-bold rounded-xl"
            >
              <User size={18} />
              {labels.myProfile || "Hồ sơ của tôi"}
            </Link>

            <button
              type="button"
              onClick={onLogout}
              disabled={isLoggingOut}
              className="flex items-center justify-center gap-2 h-12 border border-white/20 text-white font-bold rounded-xl disabled:opacity-60"
            >
              {isLoggingOut ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <LogOut size={18} />
              )}
              {labels.signOut || "Đăng xuất"}
            </button>
          </>
        ) : isBackOfficeUser ? (
          <>
            <Link
              to={dashboardPath}
              onClick={onClose}
              className="flex items-center justify-center h-12 bg-customer-accent text-customer-primaryDark font-bold rounded-xl"
            >
              {labels.dashboard || "Bảng điều khiển"}
            </Link>

            <button
              type="button"
              onClick={onLogout}
              disabled={isLoggingOut}
              className="flex items-center justify-center gap-2 h-12 border border-white/20 text-white font-bold rounded-xl disabled:opacity-60"
            >
              {isLoggingOut ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <LogOut size={18} />
              )}
              {labels.signOut || "Đăng xuất"}
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              onClick={onClose}
              className="flex items-center justify-center h-12 border border-white/20 text-white font-bold rounded-xl"
            >
              {labels.signIn || "Đăng nhập"}
            </Link>

            <Link
              to="/register"
              onClick={onClose}
              className="flex items-center justify-center h-12 bg-customer-accent text-customer-primaryDark font-bold rounded-xl"
            >
              {labels.joinUs || "Tham gia"}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
