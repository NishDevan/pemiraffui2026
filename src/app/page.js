import Image from 'next/image';
import Link from 'next/link';
import { Link2 } from 'lucide-react';

export default function Home() {
  const regulations = [
    { title: 'Peraturan Pemilihan Raya IKM FF UI 2026', href: '#' },
    { title: 'Petunjuk Teknis Tata Cara Pemungutan Suara', href: '#' },
    { title: 'Ketetapan BPM FF UI Terkait Pemira', href: '#' },
    { title: 'Panduan dan Kode Etik Kampanye Paslon', href: '#' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-16 md:gap-28 py-6 md:py-8 px-4 sm:px-6 md:px-8 text-white overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-10">
        <div className="flex-1 flex flex-col gap-4 md:gap-5 w-full">
          <div className="flex flex-col leading-none -space-y-1 md:-space-y-3">
            <h1 className="font-cinzel text-4xl sm:text-6xl md:text-8xl font-bold tracking-wider leading-tight text-white drop-shadow-sm">
              PEMIRA
            </h1>
            <span className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold tracking-wider leading-tight text-white drop-shadow-sm">
              IKM FF UI 2026
            </span>
          </div>
          <p className="font-lato text-xs sm:text-sm md:text-base text-stone-100/90 leading-relaxed text-justify font-medium">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut laoreet
            tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl euismod nunc. Sed euismod,
            nunc ut laoreet tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl euismod nunc.
          </p>
          <p className="font-lato text-xs sm:text-sm md:text-base text-stone-100/90 leading-relaxed text-justify font-medium">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut laoreet
            tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl euismod nunc. Sed euismod,
            nunc ut laoreet tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl euismod nunc.
          </p>
          <div className="pt-2">
            <Link
              href="/bilik-suara"
              className="inline-block bg-[#E78F81] hover:bg-[#d87c6e] text-white font-lato font-medium px-7 py-3 rounded-full shadow-lg transition-transform hover:scale-105 text-sm md:text-base"
            >
              Menuju Bilik Suara
            </Link>
          </div>
        </div>

        {/* Logo Lingkaran Hero */}
        <div className="w-52 h-52 sm:w-64 sm:h-64 md:w-80 md:h-80 relative flex-shrink-0 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#185343] border-4 border-[#277561] shadow-2xl p-4 sm:p-6 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#FBF8EE] relative overflow-hidden p-3 sm:p-4 shadow-inner flex items-center justify-center">
              <Image
                src="/logo_pemira.png"
                alt="Logo Pemira IKM FF UI"
                width={200}
                height={200}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. TAGAR KAMI SECTION */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10">
        <div className="w-52 h-52 sm:w-64 sm:h-64 md:w-80 md:h-80 relative flex-shrink-0 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#185343] border-4 border-[#277561] shadow-2xl p-4 sm:p-6 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#FBF8EE] relative overflow-hidden p-3 sm:p-4 shadow-inner flex items-center justify-center">
              <Image
                src="/logo_pemira.png"
                alt="Tagar Pemira IKM FF UI"
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3 md:gap-4 w-full">
          <h2 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold tracking-wider text-white">
            TAGAR KAMI
          </h2>
          <h3 className="font-lato italic font-semibold text-stone-200 text-sm sm:text-base md:text-xl break-all sm:break-words">
            #HarmoniDalamDemokrasiAksiDalamTransformasi
          </h3>
          <p className="font-lato text-xs sm:text-sm md:text-base text-stone-100/90 leading-relaxed font-medium text-justify">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut laoreet
            tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl euismod nunc. Sed euismod,
            nunc ut laoreet tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl euismod nunc.
          </p>
        </div>
      </section>

      {/* 3. MASKOT KAMI SECTION */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-10">
        <div className="flex-1 flex flex-col gap-3 md:gap-4 w-full">
          <h2 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold tracking-wider text-white">
            MASKOT KAMI
          </h2>
          <h3 className="font-baskerville italic text-stone-200 text-base sm:text-lg md:text-xl">
            NIRVA
          </h3>
          <p className="font-lato text-xs sm:text-sm md:text-base text-stone-100/90 leading-relaxed font-bold text-justify">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut laoreet
            tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl euismod nunc. Sed euismod,
            nunc ut laoreet tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl euismod nunc.
          </p>
        </div>

        {/* Gambar Maskot */}
        <div className="w-52 h-52 sm:w-64 sm:h-64 md:w-80 md:h-80 relative flex items-center justify-center flex-shrink-0">
          <Image
            src="/maskot_pemira.png"
            alt="Maskot Pemira IKM FF UI"
            width={320}
            height={320}
            className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
          />
        </div>
      </section>

      {/* 4. PERATURAN PEMIRA SECTION */}
      <section className="flex flex-col gap-6 md:gap-8 pb-12 w-full">
        <h2 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold tracking-wider text-center text-white">
          PERATURAN PEMIRA
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto w-full">
          {regulations.map((reg, index) => (
            <a
              key={index}
              href={reg.href}
              className="flex items-center gap-3 sm:gap-4 bg-[#FBF8EE] hover:bg-white text-slate-800 p-3 sm:p-4 rounded-xl shadow-md transition-all duration-200 hover:-translate-y-1 group border border-stone-200"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-stone-200 flex items-center justify-center text-slate-700 group-hover:bg-[#E78F81] group-hover:text-white transition-colors flex-shrink-0">
                <Link2 size={18} />
              </div>
              <span className="font-baskerville italic font-bold text-xs sm:text-sm md:text-base leading-snug">
                {reg.title}
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}