"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, User, LogOut, Settings, Heart, Menu, X, Film } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-dark shadow-2xl" : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center neon-glow group-hover:scale-110 transition-transform">
              <Film size={18} />
            </div>
            <span className="text-xl font-bold tracking-wider hidden sm:block">
              CINE<span className="text-accent">MAX</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "/", label: "Home" },
              { href: "/movies", label: "Movies" },
              { href: "/favorites", label: "Favorites" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-300 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search */}
            <AnimatePresence>
              {searchOpen ? (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleSearch}
                  className="relative overflow-hidden"
                >
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies..."
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2 text-sm text-white placeholder-muted focus:outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </motion.form>
              ) : (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-surface transition-all"
                >
                  <Search size={20} />
                </motion.button>
              )}
            </AnimatePresence>

            {session ? (
              <>
                <button className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-surface transition-all hidden md:flex">
                  <Bell size={20} />
                </button>
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-surface transition-all"
                  >
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-bold">
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 mt-2 w-48 glass rounded-xl overflow-hidden shadow-2xl"
                        onBlur={() => setProfileOpen(false)}
                      >
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-sm font-medium truncate">{session.user?.name}</p>
                          <p className="text-xs text-muted truncate">{session.user?.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-surface-2 transition-colors"
                            onClick={() => setProfileOpen(false)}
                          >
                            <User size={15} /> Profile
                          </Link>
                          <Link
                            href="/favorites"
                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-surface-2 transition-colors"
                            onClick={() => setProfileOpen(false)}
                          >
                            <Heart size={15} /> Favorites
                          </Link>
                          {session.user?.role === "ADMIN" && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-accent hover:bg-surface-2 transition-colors"
                              onClick={() => setProfileOpen(false)}
                            >
                              <Settings size={15} /> Admin Panel
                            </Link>
                          )}
                          <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-surface-2 transition-colors"
                          >
                            <LogOut size={15} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-xl transition-all"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-surface transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass-dark border-t border-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {[
                { href: "/", label: "Home" },
                { href: "/movies", label: "Movies" },
                { href: "/favorites", label: "Favorites" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 rounded-xl hover:bg-surface-2 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
