import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  User,
  LogOut,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useLanguageStore, useSearchStore } from "@/stores";
import { useCartStore } from "@/stores/cartStore";
import { translations } from "@/locales";
import { SUPPORTED_LANGUAGES } from "@/constraints";
import toast from "react-hot-toast";
import { Logout } from "@/services";
import { firebaseLogout } from "@/services/firebaseAuthService";
import MegaMenu from "./MegaMenu";
import MobileNav from "./MobileNav";
import { getNavLinks } from "./navLinks";

const normalizeRoleName = (role) => String(role || "").toUpperCase();

const getDashboardPathByRole = (roleName) => {
  switch (normalizeRoleName(roleName)) {
    case "MANAGER":
      return "/manager";
    case "ADMIN":
      return "/admin";
    case "STORE_MANAGER":
      return "/store-manager";
    case "STAFF":
      return "/staff";
    default:
      return "/";
  }
};

export default function CustomerHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuthStore();
  const { language: currentLangCode, setLanguage: setCurrentLangCode } =
    useLanguageStore();
  const {
    searchQuery,
    setSearchQuery,
    isSearching,
    clearSearch,
    performSearch,
    searchResults,
  } = useSearchStore();
  const { items } = useCartStore();

  const debounceRef = useRef(null);
  const t = translations[currentLangCode]?.customer || translations.vi?.customer || {};
  const navLinks = getNavLinks(t.nav);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const cartCount = items.length;
  const userRole = normalizeRoleName(user?.role?.name || user?.role);
  const isCustomer = isAuthenticated && userRole === "CUSTOMER";
  const isBackOfficeUser = isAuthenticated && userRole !== "CUSTOMER";

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!val.trim()) {
      clearSearch();
      return;
    }

    if (location.pathname !== "/products") {
      debounceRef.current = setTimeout(() => performSearch(val, 10), 500);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      navigate("/products");
    }
  };

  const clearLocalAuth = () => {
    try {
      useCartStore.getState().clearCart?.(true);
      logout?.();
      localStorage.removeItem("capital-coffee-auth");
      sessionStorage.clear();
    } catch (error) {
      console.error("Clear local auth error:", error);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      setMobileMenuOpen(false);

      try {
        await firebaseLogout();
      } catch (firebaseError) {
        console.warn("Firebase logout failed, continue clearing local auth:", firebaseError);
      }

      try {
        await Logout();
      } catch (backendLogoutError) {
        console.warn("Backend logout failed, continue clearing local auth:", backendLogoutError);
      }

      clearLocalAuth();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      clearLocalAuth();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const dashboardPath = getDashboardPathByRole(userRole);

  return (
    <>
      <header
        className={`font-customer sticky top-0 z-50 bg-customer-primaryDark text-white border-b border-white/10 transition-all duration-200 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div
          className={`flex items-center justify-between px-4 lg:px-10 mx-auto max-w-7xl transition-all duration-200 ${
            scrolled ? "py-2" : "py-3 lg:py-4"
          }`}
        >
          <div className="flex items-center gap-4 lg:gap-8">
            <Link to="/" className="flex items-center gap-2.5" aria-label="AgriFert - Trang chủ">
              <img src="/agri-logo.svg" alt="" className="h-9 w-9 object-contain" />
              <span className="text-lg font-extrabold tracking-tight">AgriFert</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1 pl-2">
              {navLinks.map((link) =>
                link.megaMenu ? (
                  <div key={link.key} className="group relative">
                    <Link
                      to={link.href}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors hover:text-customer-accent ${
                        location.pathname === link.href ? "text-customer-accent" : "text-white/85"
                      }`}
                    >
                      {link.label}
                    </Link>
                    <MegaMenu labels={t.nav} />
                  </div>
                ) : (
                  <Link
                    key={link.key}
                    to={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors hover:text-customer-accent ${
                      location.pathname === link.href ? "text-customer-accent" : "text-white/85"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-xl px-1.5 h-10 border border-white/10">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setCurrentLangCode(l.code)}
                  className={`p-1 rounded-lg text-sm transition-all ${
                    currentLangCode === l.code
                      ? "bg-customer-accent text-customer-primaryDark font-bold"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  title={l.label}
                  aria-label={`Chuyển ngôn ngữ sang ${l.label}`}
                >
                  {l.flag}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center bg-white/10 border border-white/10 rounded-xl px-3 h-10 gap-2 hover:border-customer-accent/40 focus-within:border-customer-accent/40 transition-colors relative">
              {isSearching ? (
                <Loader2 size={16} className="text-white/50 animate-spin" />
              ) : (
                <Search size={16} className="text-white/50" />
              )}

              <label htmlFor="customer-header-search" className="sr-only">
                {t.nav?.searchPlaceholder || "Tìm kiếm phân bón..."}
              </label>
              <input
                id="customer-header-search"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                placeholder={t.nav?.searchPlaceholder || "Tìm phân bón..."}
                className="bg-transparent text-sm text-white placeholder-white/40 outline-none w-40"
              />

              {searchQuery && (
                <button onClick={clearSearch} aria-label="Xoá tìm kiếm" className="text-white/50 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              )}

              {searchQuery && location.pathname !== "/products" && (
                <div className="absolute top-12 right-0 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 text-gray-800">
                  {isSearching ? (
                    <div className="p-4 flex items-center justify-center gap-2 text-sm text-gray-400">
                      <Loader2 size={16} className="animate-spin text-customer-primary" />
                      Đang tìm...
                    </div>
                  ) : searchResults && searchResults.length > 0 ? (
                    <div className="flex flex-col">
                      <div className="flex flex-col max-h-[280px] overflow-y-auto">
                        {searchResults.map((item) => (
                          <Link
                            key={item.id}
                            to={`/products/${item.id}`}
                            onClick={clearSearch}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                          >
                            <img
                              src={item.image || item.imageUrl || "/agri-logo.svg"}
                              alt=""
                              className="size-10 rounded-lg object-cover"
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
                      </div>
                      <button
                        onClick={() => navigate("/products")}
                        className="p-3 text-center text-sm font-bold text-customer-primary bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        Xem tất cả kết quả
                      </button>
                    </div>
                  ) : searchResults && searchResults.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      Không tìm thấy phân bón phù hợp
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {isCustomer ? (
              <div className="hidden md:flex items-center gap-1">
                <button
                  onClick={() => navigate("/checkout")}
                  className="relative flex items-center gap-2 h-10 px-3 lg:px-4 bg-customer-accent text-customer-primaryDark font-bold text-sm rounded-xl hover:brightness-95 transition-colors"
                >
                  <ShoppingBag size={18} />
                  <span className="hidden lg:inline">{t.nav?.cart || "Giỏ hàng"}</span>
                  {cartCount > 0 && (
                    <span className="min-w-[20px] h-5 rounded-full bg-customer-primaryDark text-white text-xs flex items-center justify-center px-1 font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>

                <Link
                  to="/profile"
                  aria-label={t.nav?.account || "Tài khoản"}
                  className="flex items-center justify-center gap-2 h-10 w-10 bg-customer-accent text-customer-primaryDark font-bold rounded-xl"
                >
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="size-8 rounded-full object-cover" />
                  ) : (
                    <User size={18} />
                  )}
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  aria-label={t.nav?.logout || "Đăng xuất"}
                  className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-60"
                >
                  {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                </button>
              </div>
            ) : isBackOfficeUser ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to={dashboardPath}
                  className="h-10 px-4 flex items-center text-sm font-bold text-white border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
                >
                  {t.nav?.dashboard || "Bảng điều khiển"}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  aria-label={t.nav?.logout || "Đăng xuất"}
                  className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-60"
                >
                  {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                </button>
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link
                  to="/login"
                  className="h-10 px-4 flex items-center text-sm font-bold text-white border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
                >
                  {t.nav?.signIn || "Đăng nhập"}
                </Link>
                <Link
                  to="/register"
                  className="h-10 px-4 flex items-center text-sm font-bold text-customer-primaryDark bg-customer-accent rounded-xl hover:brightness-95 transition-colors"
                >
                  {t.nav?.joinUs || "Tham gia"}
                </Link>
                <button
                  onClick={() => navigate("/checkout")}
                  className="relative flex items-center gap-2 h-10 px-3 bg-customer-accent text-customer-primaryDark font-bold text-sm rounded-xl hover:brightness-95 transition-colors"
                  aria-label={t.nav?.cart || "Giỏ hàng"}
                >
                  <ShoppingBag size={18} />
                  {cartCount > 0 && (
                    <span className="min-w-[20px] h-5 rounded-full bg-customer-primaryDark text-white text-xs flex items-center justify-center px-1 font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden flex items-center justify-center size-10 rounded-xl bg-white/10 text-white"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={navLinks}
        isCustomer={isCustomer}
        isBackOfficeUser={isBackOfficeUser}
        dashboardPath={dashboardPath}
        isLoggingOut={isLoggingOut}
        onLogout={handleLogout}
        labels={t.nav}
      />
    </>
  );
}
