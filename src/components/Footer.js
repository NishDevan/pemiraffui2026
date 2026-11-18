import Image from 'next/image';
import { MapPin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#FBF8EE] border-t border-stone-200/70 py-6 px-4 md:px-8 text-slate-700 text-xs mt-auto font-lato">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand Kiri */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 relative flex-shrink-0">
            <Image
              src="/logo_pemira.png"
              alt="Logo Pemira IKM FF UI"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h4 className="font-cinzel font-bold text-slate-800 text-sm tracking-wider uppercase">
              Pemilihan Raya
            </h4>
            <p className="font-cinzel text-emerald-900 text-xs font-semibold tracking-widest">
              IKM FF UI 2026
            </p>
          </div>
        </div>

        {/* Informasi Kontak & Lokasi Kanan */}
        <div className="flex flex-col gap-1.5 text-slate-600 text-[11px] md:text-xs">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-emerald-800 flex-shrink-0" />
            <span>Ruang BPM FF UI, Gedung C, Lt. 4, Rumpun Ilmu Kesehatan, Universitas Indonesia</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-emerald-800 flex-shrink-0" />
            <a href="mailto:pemilihanrayaffui@gmail.com" className="hover:underline">
              pemilihanrayaffui@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            {/* SVG Instagram Vektor Asli */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-emerald-800 flex-shrink-0"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <a
              href="https://instagram.com/pemiraikmffui"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-medium"
            >
              @pemiraikmffui
            </a>
          </div>
        </div>
      </div>

      <div className="font-bold max-w-7xl mx-auto text-center border-t border-stone-200/60 mt-4 pt-3 text-[12px] text-stone-500 font-cinzel">
        © 2026 Pemilihan Raya IKM FF UI.
      </div>
    </footer>
  );
}