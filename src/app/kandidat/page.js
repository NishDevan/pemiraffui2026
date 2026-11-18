'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Sparkles } from 'lucide-react';

export default function KandidatPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Ambil daftar kandidat dari Backend API
  useEffect(() => {
    fetch('/api/candidates')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCandidates(data.data);
        }
      })
      .catch((err) => console.error('Fetch Candidates Error:', err))
      .finally(() => setLoading(false));
  }, []);

  // Pisahkan kandidat berdasarkan kategori
  const bemCandidates = candidates.filter((c) => c.category === 'KETUA_BEM');
  const bpmCandidates = candidates.filter((c) => c.category === 'BPM');

  // Misi default 1 - 5 jika dari database belum terisi
  const defaultMissions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget felis ut lorem ultricies porta sed at leo.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget felis ut lorem ultricies porta sed at leo.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget felis ut lorem ultricies porta sed at leo.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget felis ut lorem ultricies porta sed at leo.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget felis ut lorem ultricies porta sed at leo.',
  ];

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-16 md:gap-28 py-8 md:py-12 px-4 sm:px-6 md:px-8 text-white overflow-x-hidden">
      {/* ============================================================ */}
      {/* 1. SEKSI BEM FF UI */}
      {/* ============================================================ */}
      <section className="flex flex-col items-center text-center gap-6 md:gap-8 w-full">
        <div className="flex flex-col gap-3 md:gap-4 max-w-6xl w-full">
          <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide sm:tracking-wider text-white drop-shadow-sm break-words">
            Calon Ketua & Wakil Ketua BEM FF UI
          </h1>
          <div className="flex flex-col gap-2.5 font-lato text-xs sm:text-sm md:text-base text-stone-100/90 leading-relaxed font-medium text-justify md:text-center">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget felis ut lorem
              ultricies porta sed at leo. Nunc neque dolor, aliquet at dignissim id, vulputate sit
              amet nibh. Donec sed varius erat, ut pharetra magna. Cras ipsum lectus, venenatis et
              efficitur id, consectetur id nulla.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget felis ut lorem
              ultricies porta sed at leo. Nunc neque dolor, aliquet at dignissim id, vulputate sit
              amet nibh. Donec sed varius erat, ut pharetra magna. Cras ipsum lectus, venenatis et
              efficitur id, consectetur id nulla.
            </p>
          </div>
        </div>

        {/* Kartu Paslon BEM */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-24 pt-2">
          {loading ? (
            <div className="flex gap-6 sm:gap-12">
              <div className="w-44 h-64 sm:w-60 sm:h-80 rounded-2xl bg-white/10 animate-pulse"></div>
              <div className="w-44 h-64 sm:w-60 sm:h-80 rounded-2xl bg-white/10 animate-pulse"></div>
            </div>
          ) : (
            bemCandidates.map((cand) => (
              <div
                key={cand.id}
                onClick={() => setSelectedCandidate(cand)}
                className="flex flex-col items-center gap-3 sm:gap-4 cursor-pointer group transition-all duration-300 hover:-translate-y-2"
              >
                {/* Bingkai Foto Bulat */}
                <div className="w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-full bg-[#185343] border-4 border-[#277561] shadow-2xl p-3 sm:p-4 flex items-center justify-center relative overflow-hidden group-hover:scale-105 group-hover:border-[#E78F81] transition-all duration-300">
                  <div className="w-full h-full rounded-full bg-[#24463C] flex items-center justify-center text-stone-200 font-cinzel text-xl sm:text-2xl font-bold">
                    <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform">👥</span>
                  </div>
                </div>

                {/* Nomor Urut & Nama Paslon */}
                <div className="flex flex-col items-center text-center">
                  <span className="font-baskerville text-lg sm:text-xl md:text-2xl font-bold tracking-wide text-white group-hover:text-stone-100 transition-colors">
                    Nomor Urut {cand.orderNumber}
                  </span>
                  <span className="font-baskerville text-xs sm:text-sm md:text-base text-stone-200 mt-0.5 max-w-[200px] sm:max-w-[220px]">
                    {cand.candidateName}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. SEKSI BPM FF UI */}
      {/* ============================================================ */}
      <section className="flex flex-col items-center text-center gap-6 md:gap-8 pb-12 w-full">
        <div className="flex flex-col gap-3 md:gap-4 max-w-6xl w-full">
          <h2 className="font-cinzel text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide sm:tracking-wider text-white drop-shadow-sm break-words">
            Calon Anggota Independen BPM FF UI
          </h2>
          <div className="flex flex-col gap-2.5 font-lato text-xs sm:text-sm md:text-base text-stone-100/90 leading-relaxed font-light text-justify md:text-center">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget felis ut lorem
              ultricies porta sed at leo. Nunc neque dolor, aliquet at dignissim id, vulputate sit
              amet nibh. Donec sed varius erat, ut pharetra magna. Cras ipsum lectus, venenatis et
              efficitur id, consectetur id nulla.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget felis ut lorem
              ultricies porta sed at leo. Nunc neque dolor, aliquet at dignissim id, vulputate sit
              amet nibh. Donec sed varius erat, ut pharetra magna. Cras ipsum lectus, venenatis et
              efficitur id, consectetur id nulla.
            </p>
          </div>
        </div>

        {/* Kartu Calon BPM */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 pt-2">
          {loading ? (
            <div className="w-44 h-64 sm:w-60 sm:h-80 rounded-2xl bg-white/10 animate-pulse"></div>
          ) : (
            bpmCandidates.map((cand) => (
              <div
                key={cand.id}
                onClick={() => setSelectedCandidate(cand)}
                className="flex flex-col items-center gap-3 sm:gap-4 cursor-pointer group transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-full bg-[#185343] border-4 border-[#277561] shadow-2xl p-3 sm:p-4 flex items-center justify-center relative overflow-hidden group-hover:scale-105 group-hover:border-[#E78F81] transition-all duration-300">
                  <div className="w-full h-full rounded-full bg-[#24463C] flex items-center justify-center text-stone-200 font-cinzel text-xl sm:text-2xl font-bold">
                    <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform">👤</span>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center">
                  <span className="font-baskerville text-lg sm:text-xl md:text-2xl font-bold tracking-wide text-white group-hover:text-stone-100 transition-colors">
                    Nomor Urut {cand.orderNumber}
                  </span>
                  <span className="font-baskerville text-xs sm:text-sm md:text-base text-stone-200 mt-0.5 max-w-[200px] sm:max-w-[220px]">
                    {cand.candidateName}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. MODAL / POPUP DETAIL KANDIDAT (VISI, MISI, PROKER) */}
      {/* ============================================================ */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#244E57] border border-white/20 text-white rounded-3xl max-w-3xl w-full p-5 sm:p-8 md:p-10 shadow-2xl relative my-6 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            {/* Tombol Tutup Silang */}
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-stone-300 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition-all"
            >
              <X size={20} />
            </button>

            {/* Header Modal */}
            <div className="flex items-center gap-4 sm:gap-6 border-b border-white/10 pb-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#185343] border-2 border-emerald-400 flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0">
                {selectedCandidate.category === 'KETUA_BEM' ? '👥' : '👤'}
              </div>
              <div>
                <span className="text-xs sm:text-sm font-cinzel text-emerald-300 font-bold tracking-widest uppercase">
                  Nomor Urut {selectedCandidate.orderNumber}
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold tracking-wide mt-0.5">
                  {selectedCandidate.candidateName}
                </h3>
              </div>
            </div>

            {/* VISI */}
            <div className="flex flex-col gap-2">
              <h4 className="font-baskerville text-base sm:text-lg font-bold text-amber-200 tracking-wider">
                VISI
              </h4>
              <p className="font-lato text-xs sm:text-sm md:text-base leading-relaxed text-stone-100/90 font-light text-justify bg-black/15 p-3.5 sm:p-4 rounded-2xl border border-white/5">
                {selectedCandidate.vision ||
                  'Terwujudnya IKM FF UI yang berintegritas, dinamis, inklusif, serta berdampak nyata bagi seluruh civitas akademika dan masyarakat.'}
              </p>
            </div>

            {/* MISI 1 - 5 */}
            <div className="flex flex-col gap-3">
              <h4 className="font-baskerville text-base sm:text-lg font-bold text-amber-200 tracking-wider">
                MISI
              </h4>
              <div className="flex flex-col gap-2">
                {defaultMissions.map((misi, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-black/15 p-2.5 sm:p-3 rounded-xl border border-white/5 font-lato text-xs sm:text-sm text-stone-100/90"
                  >
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#E78F81] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="leading-snug">{misi}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* PROKER UNGGULAN */}
            <div className="flex flex-col gap-2">
              <h4 className="font-baskerville text-base sm:text-lg font-bold text-amber-200 tracking-wider">
                PROGRAM KERJA UNGGULAN
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Farmasi Mengabdi 2026',
                  'Pekan Olahraga & Seni Farmasi',
                  'UI Pharmacy Innovation Challenge',
                  'Advokasi Terpadu Mahasiswa',
                ].map((proker, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-[#185343]/60 border border-emerald-500/30 p-2.5 sm:p-3 rounded-xl font-lato text-xs sm:text-sm font-semibold"
                  >
                    <Sparkles size={14} className="text-amber-300 flex-shrink-0" />
                    <span>{proker}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}