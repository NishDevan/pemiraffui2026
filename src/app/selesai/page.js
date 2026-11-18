'use client';

import Link from 'next/link';

export default function SelesaiPage() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-10 py-16 px-4 text-white animate-fadeIn">
      {/* Judul Besar */}
      <h1 className="font-cinzel text-5xl md:text-7xl font-bold tracking-wider leading-tight text-white drop-shadow-md">
        TERIMA KASIH
      </h1>

      <h2 className="font-cinzel text-xl md:text-3xl font-bold text-stone-100 tracking-wide">
        Atas Partisipasinya Pada PEMIRA IKM FF UI 2026
      </h2>

      {/* Deskripsi */}
      <p className="font-lato text-sm md:text-base text-stone-100/90 leading-relaxed font-light max-w-2xl text-justify md:text-center">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget felis ut lorem ultricies
        porta sed at leo. Nunc neque dolor, aliquet at dignissim id, vulputate sit amet nibh. Donec
        sed varius erat, ut pharetra magna. Cras ipsum lectus, venenatis et efficitur id, consectetur
        id nulla.
      </p>

      {/* Subjudul Hitung Cepat */}
      <div className="flex flex-col items-center gap-6 mt-6">
        <h3 className="font-cinzel text-4xl md:text-5xl font-bold tracking-wider text-white">
          CEK HITUNG CEPAT
        </h3>

        {/* Tombol Menuju Hitung Cepat dengan Icon Donut */}
        <Link
          href="/hitung-cepat"
          className="flex items-center gap-4 bg-[#FBF8EE] hover:bg-white text-slate-900 px-8 py-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 group border border-stone-200"
        >
          <div className="w-8 h-8 rounded-full border-4 border-slate-800 border-t-emerald-600 animate-spin flex-shrink-0"></div>
          <span className="font-baskerville italic font-bold text-xl md:text-2xl">
            Hitung Cepat
          </span>
        </Link>
      </div>
    </div>
  );
}