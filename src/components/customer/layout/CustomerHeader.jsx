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

// Shared between the always-inline (2xl+) search box and the floating
// panel used at the xl compact tier — avoids duplicating this markup.
function SearchResultsPanel({ isSearching, searchResults, onResultClick, onViewAll, floating = false }) {
  return (
    <div
      className={
        floating
          ? "bg-white text-gray-800"
          : "absolute top-11 right-0 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 text-gray-800"
      }
    >
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
                onClick={onResultClick}
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
            onClick={onViewAll}
            className="w-full p-3 text-center text-sm font-bold text-customer-primary bg-gray-50 hover:bg-gray-100 transition-colors"
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
  );
}

// Below xl (1280px) the header collapses to logo + hamburger only — nav,
// language switcher, search and account/cart all move into MobileNav.
// Chosen because the full desktop row (6 nav items + search + language +
// account cluster) only has room to sit on one line from ~1280px up —
// measured with Playwright (see PR notes). Do not lower this without
// re-measuring.
//
// NOTE: the "xl:" prefix below is written as a literal string everywhere
// on purpose — Tailwind's JIT scanner only picks up complete, literal
// class names from source. A template-interpolated `` `${x}:flex` ``
// never gets generated and silently does nothing at runtime.

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
  // Search stays icon + floating panel at every xl+ width on purpose —
  // see the comment above the search markup below before changing this.
  const [searchOpen, setSearchOpen] = useState(false);
  const searchPanelRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;

    const handleClickOutside = (e) => {
      if (searchPanelRef.current && !searchPanelRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setSearchOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Desktop nav uses the xl breakpoint; close the drawer if the viewport
  // is (or becomes, via resize) wide enough to show the desktop header.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1280px)");
    const handleChange = (e) => {
      if (e.matches) setMobileMenuOpen(false);
    };
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

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
          className={`flex items-center gap-2 xl:gap-4 px-4 sm:px-6 lg:px-6 xl:px-6 2xl:px-14 mx-auto max-w-[1920px] transition-all duration-200 ${
            scrolled ? "py-2" : "py-3 lg:py-3.5"
          }`}
        >
          {/* Logo — fixed width, never shrinks */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
            aria-label="AgriFert - Trang chủ"
          >
            <img src="/agri-logo.svg" alt="" className="h-8 w-8 object-contain shrink-0" />
            <span className="text-base font-extrabold tracking-tight whitespace-nowrap">
              AgriFert
            </span>
          </Link>

          {/* Desktop nav — fills the remaining width, items spread evenly across it */}
          <nav
            className="hidden xl:flex items-center justify-evenly flex-1 min-w-0 px-2"
          >
            {navLinks.map((link) =>
              link.megaMenu ? (
                <div key={link.key} className="group relative shrink-0">
                  <Link
                    to={link.href}
                    className={`block px-1.5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors hover:text-customer-accent ${
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
                  className={`shrink-0 px-1.5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors hover:text-customer-accent ${
                    location.pathname === link.href ? "text-customer-accent" : "text-white/85"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Actions — fixed cluster, never shrinks below its content */}
          <div className="hidden xl:flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-0.5 bg-white/5 rounded-xl px-1 h-9 border border-white/10 shrink-0">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setCurrentLangCode(l.code)}
                  className={`px-1 py-0.5 rounded-lg text-sm transition-all ${
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

            {/*
              Search is icon + floating panel at every width from xl up,
              with no wider "upgrade" tier. An earlier version tried to
              show a full inline input again at 2xl, back when the outer
              container was capped at max-w-7xl (1280px) — at that cap,
              a wider *viewport* didn't mean a wider *header*, so the
              extra-width assumption was false and re-triggered the nav/
              action overlap this component exists to prevent. The
              container is wider now (max-w-[1920px] below), but the nav
              is what benefits from that (flex-1 + justify-evenly soaks
              up any extra room automatically) — don't re-add a wider
              search tier without re-measuring with Playwright the way
              the PR history for this file did.
            */}
            <div ref={searchPanelRef} className="relative shrink-0">
              <button
                onClick={() => setSearchOpen((v) => !v)}
                aria-label={t.nav?.searchPlaceholder || "Tìm kiếm"}
                aria-expanded={searchOpen}
                className="flex items-center justify-center h-9 w-9 rounded-xl bg-white/10 border border-white/10 text-white/70 hover:text-white hover:border-customer-accent/40 transition-colors"
              >
                <Search size={16} />
              </button>

              {searchOpen && (
                <div className="absolute right-0 top-11 w-72 bg-customer-primaryDark border border-white/15 rounded-xl shadow-xl p-2 z-50">
                  <div className="flex items-center bg-white/10 border border-white/10 rounded-lg px-2.5 h-10 gap-1.5">
                    {isSearching ? (
                      <Loader2 size={15} className="text-white/50 animate-spin shrink-0" />
                    ) : (
                      <Search size={15} className="text-white/50 shrink-0" />
                    )}
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchKeyDown}
                      placeholder={t.nav?.searchPlaceholder || "Tìm phân bón..."}
                      className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder-white/40 outline-none"
                    />
                    {searchQuery && (
                      <button onClick={clearSearch} aria-label="Xoá tìm kiếm" className="text-white/50 hover:text-white transition-colors shrink-0">
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {searchQuery && location.pathname !== "/products" && (
                    <div className="mt-2 rounded-lg overflow-hidden">
                      <SearchResultsPanel
                        isSearching={isSearching}
                        searchResults={searchResults}
                        onResultClick={() => {
                          clearSearch();
                          setSearchOpen(false);
                        }}
                        onViewAll={() => {
                          setSearchOpen(false);
                          navigate("/products");
                        }}
                        floating
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {isCustomer ? (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => navigate("/checkout")}
                  className="relative flex items-center gap-1.5 h-9 px-2.5 bg-customer-accent text-customer-primaryDark font-bold text-sm rounded-xl hover:brightness-95 transition-colors whitespace-nowrap"
                  aria-label={t.nav?.cart || "Giỏ hàng"}
                >
                  <ShoppingBag size={17} />
                  {cartCount > 0 && (
                    <span className="min-w-[18px] h-[18px] rounded-full bg-customer-primaryDark text-white text-[11px] flex items-center justify-center px-1 font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>

                <Link
                  to="/profile"
                  aria-label={t.nav?.account || "Tài khoản"}
                  className="flex items-center justify-center h-9 w-9 bg-customer-accent text-customer-primaryDark font-bold rounded-xl shrink-0"
                >
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="size-7 rounded-full object-cover" />
                  ) : (
                    <User size={17} />
                  )}
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  aria-label={t.nav?.logout || "Đăng xuất"}
                  className="p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-60 shrink-0"
                >
                  {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                </button>
              </div>
            ) : isBackOfficeUser ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <Link
                  to={dashboardPath}
                  className="h-9 px-3 flex items-center text-sm font-bold text-white border border-white/20 rounded-xl hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  {t.nav?.dashboard || "Bảng điều khiển"}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  aria-label={t.nav?.logout || "Đăng xuất"}
                  className="p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-60 shrink-0"
                >
                  {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 shrink-0">
                <Link
                  to="/login"
                  className="h-9 px-3 flex items-center text-sm font-bold text-white border border-white/20 rounded-xl hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  {t.nav?.signIn || "Đăng nhập"}
                </Link>
                <Link
                  to="/register"
                  className="h-9 px-3 flex items-center text-sm font-bold text-customer-primaryDark bg-customer-accent rounded-xl hover:brightness-95 transition-colors whitespace-nowrap"
                >
                  {t.nav?.joinUs || "Tham gia"}
                </Link>
                <button
                  onClick={() => navigate("/checkout")}
                  className="relative flex items-center gap-1.5 h-9 px-2.5 bg-customer-accent text-customer-primaryDark font-bold text-sm rounded-xl hover:brightness-95 transition-colors shrink-0"
                  aria-label={t.nav?.cart || "Giỏ hàng"}
                >
                  <ShoppingBag size={17} />
                  {cartCount > 0 && (
                    <span className="min-w-[18px] h-[18px] rounded-full bg-customer-primaryDark text-white text-[11px] flex items-center justify-center px-1 font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Below xl: logo + hamburger only — everything else lives in MobileNav */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={mobileMenuOpen}
            className="xl:hidden ml-auto flex items-center justify-center size-10 rounded-xl bg-white/10 text-white shrink-0"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
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
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchKeyDown={handleSearchKeyDown}
        isSearching={isSearching}
        clearSearch={clearSearch}
        searchResults={searchResults}
        onSearchSubmit={() => {
          setMobileMenuOpen(false);
          navigate("/products");
        }}
        currentLangCode={currentLangCode}
        setCurrentLangCode={setCurrentLangCode}
        cartCount={cartCount}
        onCartClick={() => {
          setMobileMenuOpen(false);
          navigate("/checkout");
        }}
      />
    </>
  );
}
