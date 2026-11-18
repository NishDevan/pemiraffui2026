'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Vote, ArrowRight, ArrowLeft, Settings } from 'lucide-react';

export default function BilikSuaraPage() {
  const router = useRouter();

  // State Data
  const [user, setUser] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Pengaturan Bilik Suara (Buka / Tutup / Jam)
  const [electionStatus, setElectionStatus] = useState('OPEN');
  const [electionSchedule, setElectionSchedule] = useState('08.00 - 16.00 WIB');
  const [adminScheduleInput, setAdminScheduleInput] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  // State Alur Pemilihan
  const [step, setStep] = useState(1); // 1 = BEM FF UI, 2 = BPM FF UI
  const [selectedBem, setSelectedBem] = useState(null);
  const [selectedBpm, setSelectedBpm] = useState(null);

  // State Dialog Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // State Countdown Otomatis untuk Mahasiswa yang Sudah Memilih
  const [countdown, setCountdown] = useState(3);

  // 1. Fetch Seluruh Kebutuhan Data Awal
  useEffect(() => {
    async function loadInitialData() {
      try {
        // Cek sesi user
        const authRes = await fetch('/api/auth/me');
        const authData = await authRes.json();
        if (authData.authenticated) {
          setUser(authData.user);
        }

        // Ambil status & jadwal bilik suara
        const settingRes = await fetch('/api/settings/election');
        const settingData = await settingRes.json();
        if (settingData.success) {
          setElectionStatus(settingData.status);
          setElectionSchedule(settingData.schedule);
          setAdminScheduleInput(settingData.schedule);
        }

        // Ambil kandidat
        const candRes = await fetch('/api/candidates');
        const candData = await candRes.json();
        if (candData.success) {
          setCandidates(candData.data);
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // 2. Timer Hitung Mundur 3 Detik jika sudah vote (Khusus Warga)
  useEffect(() => {
    if (user?.hasVoted && !user?.isAdmin) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        router.push('/selesai');
      }
    }
  }, [user, countdown, router]);

  // 3. Pengawas Keamanan: Peringatan jika mencoba Reload / Tutup Tab saat sedang memilih
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (selectedBem || selectedBpm) {
        e.preventDefault();
        e.returnValue = ''; // Memicu konfirmasi browser bawaan
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [selectedBem, selectedBpm]);

  // 4. Pengawas Keamanan: Mencegat navigasi Navbar jika ada pilihan aktif
  useEffect(() => {
    const handleLinkClick = (e) => {
      const targetLink = e.target.closest('a');
      if (targetLink && targetLink.getAttribute('href') !== '/bilik-suara') {
        if (selectedBem || selectedBpm) {
          e.preventDefault();
          setShowCancelModal(true); // Munculkan modal "Batal Memilih?"
        }
      }
    };

    document.addEventListener('click', handleLinkClick, { capture: true });
    return () => document.removeEventListener('click', handleLinkClick, { capture: true });
  }, [selectedBem, selectedBpm]);

  const bemCandidates = candidates.filter((c) => c.category === 'KETUA_BEM');
  const bpmCandidates = candidates.filter((c) => c.category === 'BPM');

  // 5. Fungsi Admin: Simpan Status & Jam Bilik Suara
  async function handleSaveAdminSettings(newStatus) {
    setSavingSettings(true);
    try {
      const res = await fetch('/api/settings/election', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          schedule: adminScheduleInput,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setElectionStatus(newStatus);
        setElectionSchedule(adminScheduleInput);
        alert(`Bilik suara berhasil diubah menjadi: ${newStatus}`);
      } else {
        alert(data.error || 'Gagal menyimpan pengaturan.');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setSavingSettings(false);
    }
  }

  // 6. Fungsi Pemilih: Kirim Suara ke Backend (BEM + BPM Sekaligus)
  async function handleFinalVote() {
    setSubmitting(true);
    try {
      // Cari ID paslon kotak kosong BPM jika memilih kotak kosong
      let bpmId = selectedBpm;
      if (selectedBpm === 'KOTAK_KOSONG') {
        const kotakKosongCandidate = bpmCandidates.find((c) =>
          c.candidateName.toLowerCase().includes('kotak kosong')
        );
        bpmId = kotakKosongCandidate ? kotakKosongCandidate.id : selectedBpm;
      }

      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          votes: [
            { candidateId: selectedBem, category: 'KETUA_BEM' },
            { candidateId: bpmId, category: 'BPM' },
          ],
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/selesai');
      } else {
        alert(data.error || 'Gagal mengirim suara.');
        setShowConfirmModal(false);
      }
    } catch (err) {
      alert('Terjadi kesalahan saat mencatat suara.');
      setShowConfirmModal(false);
    } finally {
      setSubmitting(false);
    }
  }

  // JIKA MASIH LOADING
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        <p className="font-cinzel text-lg mt-4 tracking-widest">MEMUAT BILIK SUARA...</p>
      </div>
    );
  }

  // KONDISI 1: USER BELUM LOGIN
  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn">
        <div className="bg-[#FBF8EE] text-slate-800 rounded-3xl max-w-lg w-full p-8 md:p-12 shadow-2xl relative flex flex-col items-center text-center border border-stone-200 animate-pop-in">
          <div className="absolute right-4 bottom-4 w-32 h-32 opacity-15 pointer-events-none">
            <Image src="/maskot_pemira.png" alt="Maskot" width={128} height={128} className="object-contain" />
          </div>
          <h2 className="font-baskerville italic text-3xl md:text-4xl font-bold text-slate-900">
            Anda Belum Login!
          </h2>
          <p className="font-lato font-semibold text-rose-600 text-sm md:text-base mt-4 max-w-xs">
            Silahkan login terlebih dahulu sebagai IKM FF UI yang terdaftar pada DPT
          </p>
          <a
            href="/api/auth/login"
            className="mt-8 bg-[#E78F81] hover:bg-[#d87c6e] text-white font-lato font-bold px-8 py-3.5 rounded-2xl shadow-md transition-all hover:scale-105"
          >
            Saya Paham, Login Sekarang
          </a>
        </div>
      </div>
    );
  }

  // KONDISI 2: USER SUDAH PERNAH MEMILIH (MODAL DENGAN REDIRECT OTOMATIS 3 DETIK)
  if (user.hasVoted && !user.isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn">
        <div className="bg-[#FBF8EE] text-slate-800 rounded-3xl max-w-md w-full p-8 md:p-10 shadow-2xl relative flex flex-col items-center text-center border border-stone-200 animate-pop-in">
          <div className="absolute right-3 bottom-3 w-32 h-32 opacity-15 pointer-events-none">
            <Image src="/maskot_pemira.png" alt="Maskot" width={128} height={128} className="object-contain" />
          </div>

          <h2 className="font-baskerville italic text-3xl md:text-4xl font-bold text-slate-900">
            Hak Suara Sudah Digunakan!
          </h2>

          <p className="font-lato font-semibold text-slate-700 text-sm md:text-base mt-3">
            NPM Anda telah tercatat sah menggunakan hak suara pada PEMIRA IKM FF UI 2026.
          </p>

          <p className="font-lato font-bold text-[#E78F81] text-xs md:text-sm mt-3 bg-[#E78F81]/10 px-4 py-1.5 rounded-full">
            Dialihkan ke halaman Terima Kasih dalam {countdown} detik...
          </p>

          <div className="flex flex-col gap-3 w-full mt-6">
            <button
              onClick={() => router.push('/selesai')}
              className="w-full bg-[#E78F81] hover:bg-[#d87c6e] text-white font-lato font-bold py-3.5 rounded-2xl shadow-md transition-all hover:scale-105"
            >
              Lanjut Sekarang
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-white hover:bg-stone-50 text-slate-800 border border-stone-300 font-lato font-semibold py-3 rounded-2xl transition-colors"
            >
              Kembali ke Halaman Utama
            </button>
          </div>
        </div>
      </div>
    );
  }

  // KONDISI 3: BILIK SUARA SEDANG DITUTUP (PAUSED)
  if (electionStatus === 'PAUSED' && !user.isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn">
        <div className="bg-[#FBF8EE] text-slate-800 rounded-3xl max-w-lg w-full p-8 md:p-12 shadow-2xl relative flex flex-col items-center text-center border border-stone-200 animate-pop-in">
          <div className="absolute right-4 bottom-4 w-32 h-32 opacity-15 pointer-events-none">
            <Image src="/maskot_pemira.png" alt="Maskot" width={128} height={128} className="object-contain" />
          </div>
          <h2 className="font-baskerville italic text-3xl md:text-4xl font-bold text-slate-900">
            Bilik Suara Sedang Ditutup!
          </h2>
          <p className="font-lato font-bold text-rose-600 text-sm md:text-base mt-4 max-w-xs">
            Bilik Suara akan dibuka pada jam {electionSchedule}
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-8 bg-[#E78F81] hover:bg-[#d87c6e] text-white font-lato font-bold px-8 py-3.5 rounded-2xl shadow-md transition-all hover:scale-105"
          >
            Saya Paham, Kembali ke Halaman Utama
          </button>
        </div>
      </div>
    );
  }

  // KONDISI 4: BILIK SUARA SUDAH DITUTUP / BERAKHIR (ENDED)
  if (electionStatus === 'ENDED' && !user.isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn">
        <div className="bg-[#FBF8EE] text-slate-800 rounded-3xl max-w-lg w-full p-8 md:p-12 shadow-2xl relative flex flex-col items-center text-center border border-stone-200 animate-pop-in">
          <div className="absolute right-4 bottom-4 w-32 h-32 opacity-15 pointer-events-none">
            <Image src="/maskot_pemira.png" alt="Maskot" width={128} height={128} className="object-contain" />
          </div>
          <h2 className="font-baskerville italic text-3xl md:text-4xl font-bold text-slate-900">
            Bilik Suara Sudah Ditutup!
          </h2>
          <p className="font-lato font-bold text-rose-600 text-sm md:text-base mt-4 max-w-xs">
            Terima Kasih IKM FF UI yang telah berpartisipasi!
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-8 bg-[#E78F81] hover:bg-[#d87c6e] text-white font-lato font-bold px-8 py-3.5 rounded-2xl shadow-md transition-all hover:scale-105"
          >
            Saya Paham, Kembali ke Halaman Utama
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-8 md:gap-12 py-6 md:py-8 px-4 sm:px-6 text-white overflow-x-hidden">
      {/* ============================================================ */}
      {/* FLOATING BANNER ADMIN / KONTROL PANITIA */}
      {/* ============================================================ */}
      {user?.isAdmin && (
        <div className="w-full bg-[#18353A] border-2 border-amber-400/60 p-4 md:p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 font-lato animate-fadeIn">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold flex-shrink-0">
              <Settings size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel font-bold text-amber-300 text-xs sm:text-sm tracking-wider uppercase">
                  Panel Kontrol Panitia
                </span>
                <span className="text-[9px] sm:text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                  Admin Active
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-300 mt-0.5">
                Status saat ini: <span className="font-bold text-white">{electionStatus}</span> ({electionSchedule})
              </p>
            </div>
          </div>

          {/* Opsi Switch Status & Jam Buka Responsif */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              value={adminScheduleInput}
              onChange={(e) => setAdminScheduleInput(e.target.value)}
              placeholder="Contoh: 08.00 - 16.00 WIB"
              className="bg-black/30 border border-white/20 text-xs px-3 py-2 rounded-xl text-white outline-none focus:border-amber-400 w-full sm:w-44 text-center sm:text-left"
            />
            <div className="grid grid-cols-3 sm:flex items-center gap-1.5 w-full sm:w-auto">
              <button
                disabled={savingSettings}
                onClick={() => handleSaveAdminSettings('OPEN')}
                className={`text-[11px] sm:text-xs px-3 py-2 rounded-xl font-bold transition-all ${
                  electionStatus === 'OPEN'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white/10 text-stone-300 hover:bg-emerald-600/50'
                }`}
              >
                Buka
              </button>
              <button
                disabled={savingSettings}
                onClick={() => handleSaveAdminSettings('PAUSED')}
                className={`text-[11px] sm:text-xs px-3 py-2 rounded-xl font-bold transition-all ${
                  electionStatus === 'PAUSED'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-white/10 text-stone-300 hover:bg-amber-600/50'
                }`}
              >
                Tutup
              </button>
              <button
                disabled={savingSettings}
                onClick={() => handleSaveAdminSettings('ENDED')}
                className={`text-[11px] sm:text-xs px-3 py-2 rounded-xl font-bold transition-all ${
                  electionStatus === 'ENDED'
                    ? 'bg-rose-700 text-white shadow-md'
                    : 'bg-white/10 text-stone-300 hover:bg-rose-700/50'
                }`}
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 1: BILIK SUARA BEM FF UI */}
      {/* ============================================================ */}
      {step === 1 && (
        <section className="flex flex-col items-center text-center gap-8 md:gap-10 w-full animate-fadeIn">
          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-6xl font-bold tracking-wider text-white drop-shadow-md">
            BILIK SUARA <br />
            <span className="text-stone-100">BEM FF UI</span>
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-20 w-full">
            {bemCandidates.map((cand) => {
              const isSelected = selectedBem === cand.id;
              return (
                <div
                  key={cand.id}
                  onClick={() => setSelectedBem(cand.id)}
                  className={`flex flex-col items-center gap-4 cursor-pointer group transition-all duration-300 p-2 sm:p-4 rounded-3xl ${
                    isSelected ? 'scale-105' : 'hover:-translate-y-2'
                  }`}
                >
                  {/* Lingkaran Berpola Siluet Maskot di Belakang Foto */}
                  <div
                    className={`w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full p-3 sm:p-3.5 flex items-center justify-center transition-all duration-300 shadow-2xl relative overflow-hidden ${
                      isSelected
                        ? 'bg-[#E78F81] border-4 border-white shadow-[0_0_45px_rgba(231,143,129,0.85)]'
                        : 'bg-[#185343] border-4 border-[#277561] group-hover:border-white/60'
                    }`}
                  >
                    {/* Siluet Maskot Elang */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
                      <Image src="/maskot_pemira.png" alt="Siluet" width={180} height={180} className="object-contain" />
                    </div>

                    <div className="w-full h-full rounded-full bg-[#204238]/90 relative z-10 flex items-center justify-center text-stone-200">
                      <span className="text-5xl sm:text-6xl drop-shadow-md">👤</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <span className="font-baskerville text-xl sm:text-2xl md:text-3xl font-bold text-white">
                      Nomor Urut {cand.orderNumber}
                    </span>
                    <span className="font-baskerville text-xs sm:text-sm md:text-base text-stone-200 mt-1 max-w-[200px] sm:max-w-[240px]">
                      {cand.candidateName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tombol Aksi Bawah */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-6 sm:pt-8 w-full sm:w-auto">
            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-lato text-xs sm:text-sm px-6 py-3 rounded-2xl transition-colors"
            >
              Batal Memilih
            </button>
            <button
              disabled={!selectedBem}
              onClick={() => setStep(2)}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 font-lato font-bold text-xs sm:text-sm px-8 py-3.5 rounded-2xl shadow-lg transition-all ${
                selectedBem
                  ? 'bg-[#E78F81] hover:bg-[#d87c6e] text-white hover:scale-105'
                  : 'bg-stone-400/50 text-stone-300 cursor-not-allowed'
              }`}
            >
              Lanjut ke BPM FF UI <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* STEP 2: BILIK SUARA BPM FF UI (KANDIDAT VS KOTAK KOSONG) */}
      {/* ============================================================ */}
      {step === 2 && (
        <section className="flex flex-col items-center text-center gap-8 md:gap-10 w-full animate-fadeIn">
          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-6xl font-bold tracking-wider text-white drop-shadow-md">
            BILIK SUARA <br />
            <span className="text-stone-100">BPM FF UI</span>
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-20 w-full">
            {/* Opsi Calon Nomor Urut 1 */}
            {bpmCandidates.map((cand) => {
              const isSelected = selectedBpm === cand.id;
              return (
                <div
                  key={cand.id}
                  onClick={() => setSelectedBpm(cand.id)}
                  className={`flex flex-col items-center gap-4 cursor-pointer group transition-all duration-300 p-2 sm:p-4 rounded-3xl ${
                    isSelected ? 'scale-105' : 'hover:-translate-y-2'
                  }`}
                >
                  <div
                    className={`w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full p-3 sm:p-3.5 flex items-center justify-center transition-all duration-300 shadow-2xl relative overflow-hidden ${
                      isSelected
                        ? 'bg-[#E78F81] border-4 border-white shadow-[0_0_45px_rgba(231,143,129,0.85)]'
                        : 'bg-[#185343] border-4 border-[#277561] group-hover:border-white/60'
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
                      <Image src="/maskot_pemira.png" alt="Siluet" width={180} height={180} className="object-contain" />
                    </div>

                    <div className="w-full h-full rounded-full bg-[#204238]/90 relative z-10 flex items-center justify-center text-stone-200">
                      <span className="text-5xl sm:text-6xl drop-shadow-md">👤</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <span className="font-baskerville text-xl sm:text-2xl md:text-3xl font-bold text-white">
                      Nomor Urut {cand.orderNumber}
                    </span>
                    <span className="font-baskerville text-xs sm:text-sm md:text-base text-stone-200 mt-1 max-w-[200px] sm:max-w-[240px]">
                      {cand.candidateName}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Opsi Kotak Kosong (1:1 dengan Mockup Figma) */}
            <div
              onClick={() => setSelectedBpm('KOTAK_KOSONG')}
              className={`flex flex-col items-center gap-4 cursor-pointer group transition-all duration-300 p-2 sm:p-4 rounded-3xl ${
                selectedBpm === 'KOTAK_KOSONG' ? 'scale-105' : 'hover:-translate-y-2'
              }`}
            >
              <div
                className={`w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full p-3 sm:p-3.5 flex items-center justify-center transition-all duration-300 shadow-2xl relative overflow-hidden ${
                  selectedBpm === 'KOTAK_KOSONG'
                    ? 'bg-[#E78F81] border-4 border-white shadow-[0_0_45px_rgba(231,143,129,0.85)]'
                    : 'bg-[#185343] border-4 border-[#277561] group-hover:border-white/60'
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
                  <Image src="/maskot_pemira.png" alt="Siluet" width={180} height={180} className="object-contain" />
                </div>

                <div className="w-full h-full rounded-full bg-[#185343] relative z-10 flex items-center justify-center">
                  <span className="font-cinzel font-bold text-2xl sm:text-3xl md:text-4xl text-white -rotate-12 tracking-widest text-center leading-tight drop-shadow-lg">
                    KOTAK <br /> KOSONG
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-baskerville text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  Kotak Kosong
                </span>
              </div>
            </div>
          </div>

          {/* Tombol Konfirmasi Pilihan Khas Desain */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-6 sm:pt-8 w-full sm:w-auto">
            <button
              onClick={() => setStep(1)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-lato text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition-colors"
            >
              <ArrowLeft size={16} /> Kembali ke BEM
            </button>
            <button
              disabled={!selectedBpm}
              onClick={() => setShowConfirmModal(true)}
              className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 rounded-2xl shadow-2xl transition-all border border-stone-200 ${
                selectedBpm
                  ? 'bg-[#FBF8EE] text-slate-800 hover:bg-white hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]'
                  : 'bg-stone-300/40 text-stone-400 cursor-not-allowed border-transparent'
              }`}
            >
              <Vote size={22} className="text-[#2D6A75]" />
              <span className="font-baskerville italic text-base sm:text-lg md:text-xl font-bold text-slate-900">
                Konfirmasi Pilihan
              </span>
            </button>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: SUDAH YAKIN? */}
      {/* ============================================================ */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#FBF8EE] text-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 md:p-10 shadow-2xl relative flex flex-col items-center text-center border border-stone-200 animate-pop-in">
            <div className="absolute right-4 bottom-4 w-32 h-32 opacity-15 pointer-events-none">
              <Image src="/maskot_pemira.png" alt="Maskot" width={128} height={128} className="object-contain" />
            </div>

            <h2 className="font-baskerville italic text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
              Sudah Yakin?
            </h2>
            <p className="font-lato font-bold text-slate-700 text-sm md:text-base mt-2 sm:mt-3">
              Apakah Anda sudah yakin?
            </p>
            <p className="font-lato font-semibold text-rose-600 text-xs sm:text-sm mt-1">
              Anda tidak bisa kembali ke halaman ini!
            </p>

            <div className="flex flex-col gap-2.5 sm:gap-3 w-full mt-6 sm:mt-8">
              <button
                disabled={submitting}
                onClick={handleFinalVote}
                className="w-full bg-[#E78F81] hover:bg-[#d87c6e] text-white font-lato font-bold py-3.5 rounded-2xl shadow-md transition-all hover:scale-105 disabled:opacity-50 text-sm md:text-base"
              >
                {submitting ? 'Menyimpan Suara...' : 'Ya, Saya Sudah Yakin'}
              </button>
              <button
                disabled={submitting}
                onClick={() => setShowConfirmModal(false)}
                className="w-full bg-white hover:bg-stone-50 text-slate-800 border border-stone-300 font-lato font-semibold py-3 rounded-2xl transition-colors text-sm md:text-base"
              >
                Tidak, Saya Masih Berpikir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: BATAL MEMILIH? */}
      {/* ============================================================ */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn rounded-3xl">
          <div className="bg-[#FBF8EE] text-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 md:p-10 shadow-2xl relative flex flex-col items-center text-center border border-stone-200 animate-pop-in">
            <h2 className="font-baskerville italic text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
              Batal Memilih?
            </h2>
            <p className="font-lato font-bold text-slate-700 text-sm md:text-base mt-2 sm:mt-3">
              Apakah Anda tidak jadi memilih?
            </p>
            <p className="font-lato text-slate-500 text-xs sm:text-sm mt-1">
              (Pilihan Anda akan terhapus, namun Anda masih dapat memilih nanti selama bilik suara dibuka)
            </p>

            <div className="flex flex-col gap-2.5 sm:gap-3 w-full mt-6 sm:mt-8">
              <button
                onClick={() => {
                  setSelectedBem(null);
                  setSelectedBpm(null);
                  setStep(1);
                  setShowCancelModal(false);
                  router.push('/');
                }}
                className="w-full bg-[#E78F81] hover:bg-[#d87c6e] text-white font-lato font-bold py-3.5 rounded-2xl shadow-md transition-all hover:scale-105 text-sm md:text-base"
              >
                Ya, Kembali ke Halaman Utama
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="w-full bg-white hover:bg-stone-50 text-slate-800 border border-stone-300 font-lato font-semibold py-3 rounded-2xl transition-colors text-sm md:text-base"
              >
                Tidak, Lanjutkan Memilih
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}