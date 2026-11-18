'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export default function HitungCepatPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fungsi memuat data hasil dari endpoint /api/results
  async function fetchResults() {
    try {
      setRefreshing(true);
      const res = await fetch('/api/results');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Fetch Results Error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchResults();

    // Auto-refresh setiap 20 detik agar angka selalu terkini
    const interval = setInterval(fetchResults, 20000);
    return () => clearInterval(interval);
  }, []);

  const totalDpt = data?.turnout?.totalDpt || 0;
  const totalVoted = data?.turnout?.totalVoted || 0;
  const turnoutPercentNum = totalDpt > 0 ? (totalVoted / totalDpt) * 100 : 0;
  const turnoutString = data?.turnout?.turnoutPercentage || '0.00%';

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-16 py-12 px-4 text-white">
      {/* 1. HEADER SECTION */}
      <section className="flex flex-col items-center text-center gap-6 max-w-3xl animate-fadeIn">
        <h1 className="font-cinzel text-5xl md:text-7xl font-bold tracking-wider text-white drop-shadow-sm">
          HITUNG CEPAT
        </h1>
        <div className="flex flex-col gap-3 font-lato text-sm md:text-base text-stone-100/90 leading-relaxed font-light text-justify md:text-center">
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

        {/* Tombol Refresh Data */}
        <button
          onClick={fetchResults}
          disabled={refreshing}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-lato px-5 py-2.5 rounded-full transition-all border border-white/20 hover:scale-105"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Memperbarui...' : 'Perbarui Data Suara'}
        </button>
      </section>

      {/* 2. SUARA MASUK & DONUT CHART (1:1 SESUAI FIGMA) */}
      <section className="flex flex-col items-center text-center gap-8 w-full pb-16 animate-fadeIn">
        <div className="flex flex-col gap-3 max-w-2xl">
          <h2 className="font-baskerville italic text-4xl md:text-5xl font-bold text-white drop-shadow-sm">
            Suara Masuk
          </h2>
          <p className="font-lato text-sm text-stone-100/90 leading-relaxed font-light">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget felis ut lorem
            ultricies porta sed at leo. Nunc neque dolor, aliquet at dignissim id, vulputate sit
            amet nibh. Donec sed varius erat, ut pharetra magna. Cras ipsum lectus, venenatis et
            efficitur id, consectetur id nulla.
          </p>
        </div>

        {/* DONUT CHART PERSIS MOCKUP FIGMA */}
        <div className="relative flex items-center justify-center p-4">
          <div
            className="w-72 h-72 md:w-80 md:h-80 rounded-full flex items-center justify-center shadow-2xl p-6 transition-all duration-700"
            style={{
              background: `conic-gradient(#185343 0% ${turnoutPercentNum}%, #84B082 ${turnoutPercentNum}% 100%)`,
            }}
          >
            {/* Bagian Tengah Donut */}
            <div className="w-full h-full rounded-full bg-[#49666E] border-4 border-white/20 flex flex-col items-center justify-center shadow-inner p-4 text-center">
              <span className="font-cinzel text-3xl md:text-4xl font-bold text-white tracking-widest drop-shadow-md">
                {loading ? '...' : `${totalVoted}/${totalDpt}`}
              </span>
              <span className="font-lato text-xs text-stone-200 mt-1 uppercase tracking-wider font-semibold">
                Partisipasi: {turnoutString}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}