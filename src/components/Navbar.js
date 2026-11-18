'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { X, Menu } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State untuk efek sliding pill navigasi desktop
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navContainerRef = useRef(null);
  const itemRefs = useRef({});

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update posisi sliding pill setiap kali berpindah route / ukuran layar berubah
  useEffect(() => {
    setMobileMenuOpen(false);

    const updatePill = () => {
      const activeEl = itemRefs.current[pathname];
      if (activeEl && navContainerRef.current) {
        const containerLeft = navContainerRef.current.getBoundingClientRect().left;
        const targetLeft = activeEl.getBoundingClientRect().left;
        setPillStyle({
          left: targetLeft - containerLeft,
          width: activeEl.offsetWidth,
          opacity: 1,
        });
      } else {
        // Jika sedang di luar 4 menu utama (misal /selesai), pudarkan pill
        setPillStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    // Jalankan segera dan berikan delay tipis agar pengukuran DOM akurat
    updatePill();
    const timer = setTimeout(updatePill, 60);
    window.addEventListener('resize', updatePill);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePill);
    };
  }, [pathname]);

  const navItems = [
    { name: 'Tentang Kami', href: '/' },
    { name: 'Kandidat', href: '/kandidat' },
    { name: 'Bilik Suara', href: '/bilik-suara' },
    { name: 'Hitung Cepat', href: '/hitung-cepat' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled ? 'pt-2 md:pt-4 px-3 sm:px-6 md:px-10' : 'pt-0 px-0'
      }`}
    >
      <div
        className={`transition-all duration-300 mx-auto flex flex-col ${
          isScrolled
            ? 'max-w-7xl bg-[#FBF8EE]/95 backdrop-blur-md rounded-2xl md:rounded-full py-2.5 sm:py-3.5 px-4 sm:px-6 md:px-10 shadow-2xl border border-stone-200/90 ring-1 ring-black/5'
            : 'w-full bg-[#FBF8EE] border-b border-stone-200/80 py-3.5 sm:py-4 md:py-5 px-4 sm:px-6 md:px-10 shadow-sm'
        }`}
      >
        {/* BARIS UTAMA NAVBAR */}
        <div className="flex items-center justify-between w-full gap-3">
          {/* 1. Logo Kiri */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 relative flex-shrink-0">
              <Image
                src="/logo_pemira.png"
                alt="Logo Pemira IKM FF UI"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="leading-tight">
              <span className="block font-cinzel font-bold text-slate-800 text-xs sm:text-sm md:text-base tracking-wider uppercase">
                Pemilihan Raya
              </span>
              <span className="block font-cinzel text-emerald-900 text-[10px] sm:text-xs md:text-sm font-semibold tracking-widest">
                IKM FF UI 2026
              </span>
            </div>
          </Link>

          {/* 2. Menu Navigasi Desktop dengan Efek Sliding Kapsul yang Lebih Besar */}
          <nav
            ref={navContainerRef}
            className="hidden md:flex relative items-center bg-[#8B9DA3]/70 backdrop-blur-sm p-1.5 rounded-full shadow-inner border border-white/25 text-sm md:text-base font-lato"
          >
            {/* Indikator Sliding Pill */}
            <div
              className="absolute top-1.5 bottom-1.5 bg-[#2D6A75] rounded-full shadow-md transition-all duration-300 ease-out pointer-events-none"
              style={{
                left: `${pillStyle.left}px`,
                width: `${pillStyle.width}px`,
                opacity: pillStyle.opacity,
              }}
            />

            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  ref={(el) => (itemRefs.current[item.href] = el)}
                  href={item.href}
                  className={`relative z-10 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-800 hover:text-white/90'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* 3. Sisi Kanan: Profil SSO + Tombol Hamburger Mobile */}
          <div className="flex items-center gap-2 sm:gap-3 font-lato flex-shrink-0">
            {loading ? (
              <div className="w-20 sm:w-28 h-9 bg-stone-200/80 rounded-full animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center gap-2 bg-white/80 border border-stone-300 px-3 sm:px-3.5 py-1.5 rounded-full shadow-sm">
                <div className="text-right leading-none max-w-[90px] sm:max-w-none">
                  <span className="block font-mono text-[10px] sm:text-xs font-bold text-slate-800 truncate">
                    {user.npm}
                  </span>
                  <span className="inline-block text-[8px] sm:text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full mt-0.5">
                    DPT Valid
                  </span>
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2D6A75] text-white flex items-center justify-center font-bold text-xs sm:text-sm uppercase font-cinzel flex-shrink-0 shadow-inner">
                  {user.name ? user.name[0] : 'U'}
                </div>
                <Link
                  href="/api/auth/logout"
                  title="Logout"
                  className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                >
                  <X size={15} />
                </Link>
              </div>
            ) : (
              <Link
                href="/api/auth/login"
                className="bg-[#E78F81] hover:bg-[#d87c6e] text-white font-bold text-xs sm:text-sm md:text-base px-4 py-2 sm:px-6 sm:py-2.5 rounded-full shadow-md transition-all hover:scale-105"
              >
                Login SSO
              </Link>
            )}

            {/* Tombol Hamburger Khusus Layar HP */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-stone-200/80 hover:bg-stone-300 text-slate-800 transition-colors"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* DRAWER MENU DROPDOWN MOBILE */}
        {mobileMenuOpen && (
          <div className="md:hidden flex flex-col gap-2 pt-4 mt-3 border-t border-stone-200/70 font-lato animate-fadeIn">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#2D6A75] text-white shadow-sm font-bold'
                      : 'text-slate-700 hover:bg-stone-100'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}