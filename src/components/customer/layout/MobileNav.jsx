import { Link } from "react-router-dom";
import { X, User, LogOut, Loader2, Search, ShoppingBag } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/constraints";

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
  searchQuery = "",
  onSearchChange,
  onSearchKeyDown,
  isSearching = false,
  clearSearch,
  searchResults,
  onSearchSubmit,
  currentLangCode,
  setCurrentLangCode,
  cartCount = 0,
  onCartClick,
}) {
  if (!open) return null;

  return (
    <div
      className="xl:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex flex-col pt-20 px-6 pb-6 gap-4 overflow-y-auto"
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

      {/* Search — was desktop-only above xl, must stay reachable below it */}
      <div className="flex items-center bg-white/10 border border-white/15 rounded-xl px-3 h-11 gap-2 shrink-0">
        {isSearching ? (
          <Loader2 size={16} className="text-white/50 animate-spin shrink-0" />
        ) : (
          <Search size={16} className="text-white/50 shrink-0" />
        )}
        <label htmlFor="mobile-nav-search" className="sr-only">
          {labels.searchPlaceholder || "Tìm kiếm phân bón..."}
        </label>
        <input
          id="mobile-nav-search"
          value={searchQuery}
          onChange={onSearchChange}
          onKeyDown={onSearchKeyDown}
          placeholder={labels.searchPlaceholder || "Tìm phân bón..."}
          className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder-white/40 outline-none"
        />
        {searchQuery && (
          <button onClick={clearSearch} aria-label="Xoá tìm kiếm" className="text-white/50 hover:text-white transition-colors shrink-0">
            <X size={14} />
          </button>
        )}
      </div>

      {searchQuery && searchResults && searchResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden text-gray-800 shrink-0 max-h-[240px] overflow-y-auto">
          {searchResults.map((item) => (
            <Link
              key={item.id}
              to={`/products/${item.id}`}
              onClick={onClose}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
            >
              <img
                src={item.image || item.imageUrl || "/agri-logo.svg"}
                alt=""
                className="size-9 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/agri-logo.svg";
                }}
              />
              <div className="flex flex-col">
                <span className="font-bold text-sm text-gray-700">{item.name}</span>
                <span className="text-xs text-gray-500">{item.categoryName}</span>
              </div>
            </Link>
          ))}
          <button
            onClick={onSearchSubmit}
            className="w-full p-3 text-center text-sm font-bold text-customer-primary bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            Xem tất cả kết quả
          </button>
        </div>
      )}

      {/* Language switcher — same reasoning as search above */}
      {SUPPORTED_LANGUAGES?.length > 0 && (
        <div className="flex items-center gap-2 shrink-0">
          {SUPPORTED_LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setCurrentLangCode?.(l.code)}
              className={`flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-semibold transition-all ${
                currentLangCode === l.code
                  ? "bg-customer-accent text-customer-primaryDark"
                  : "bg-white/10 text-white/70"
              }`}
              aria-label={`Chuyển ngôn ngữ sang ${l.label}`}
            >
              <span>{l.flag}</span>
              <span>{l.code.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}

      <nav className="flex flex-col shrink-0">
        {navLinks.map((link) => (
          <Link
            key={link.key}
            to={link.href}
            onClick={onClose}
            className="text-xl font-black text-white/80 hover:text-customer-accent transition-colors py-3 border-b border-white/10"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex flex-col gap-3 mt-2 shrink-0">
        {!isBackOfficeUser && (
          <button
            type="button"
            onClick={onCartClick}
            className="relative flex items-center justify-center gap-2 h-12 bg-customer-accent text-customer-primaryDark font-bold rounded-xl"
          >
            <ShoppingBag size={18} />
            {labels.cart || "Giỏ hàng"}
            {cartCount > 0 && (
              <span className="min-w-[20px] h-5 rounded-full bg-customer-primaryDark text-white text-xs flex items-center justify-center px-1 font-bold">
                {cartCount}
              </span>
            )}
          </button>
        )}

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
