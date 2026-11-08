import React, { useState, useEffect } from "react";
import {
  ADMIN_PASS,
  ADMIN_PHONE,
  OUTLET_ADDRESS,
  SERVICES,
  UserProfile,
  formatRupiah
} from "../data/constants";
import { MitraNetraFullLogo, MitraNetraLogo, TherapyBackdropPattern } from "./BrandMark";
import {
  Volume2,
  VolumeX,
  Phone,
  Globe,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const CAROUSEL_SLIDES = [
  {
    src: "/assets/aistudio/pexels-larysa-stratiichuk-1606923648-29821658_37a2d73e.jpg",
    title: "Terapi Pijat Punggung & Bahu",
    caption: "Meredakan ketegangan otot punggung dan pegal linu dengan teknik akupresur terapis berpengalaman."
  },
  {
    src: "/assets/aistudio/pexels-gustavo-fring-5888078_42a12f4e.jpg",
    title: "Pijat Kebugaran Seluruh Tubuh (Full Body)",
    caption: "Layanan pijat menyeluruh oleh terapis tuna netra bersertifikat untuk memulihkan stamina tubuh."
  },
  {
    src: "/assets/aistudio/pexels-olia-danilevich-9335967_0287185c.jpg",
    title: "Relaksasi Kepala & Redakan Stres",
    caption: "Sentuhan titik saraf kepala dan wajah untuk membantu tidur lebih nyenyak serta meredakan sakit kepala."
  },
  {
    src: "/assets/aistudio/pexels-koolshooters-6628697_7b4d34b2.jpg",
    title: "Pijat Refleksi Titik Saraf Kaki",
    caption: "Melancarkan peredaran darah dan metabolisme melalui terapi titik refleksi telapak kaki."
  }
];

interface AuthScreenProps {
  users: UserProfile[];
  ttsGender: "pria" | "wanita";
  ttsSpeed: "lambat" | "sedang" | "cepat";
  onChangeTtsGender: (gender: "pria" | "wanita") => void;
  onChangeTtsSpeed: (speed: "lambat" | "sedang" | "cepat") => void;
  onLoginSuccess: (user: UserProfile, welcomeMessage: string) => void;
  onRegisterUser: (newUser: UserProfile) => void;
  onShowToast: (msg: string) => void;
  onSpeak: (text: string) => void;
  onStopSpeak: () => void;
}

export function AuthScreen({
  users,
  ttsGender,
  ttsSpeed,
  onChangeTtsGender,
  onChangeTtsSpeed,
  onLoginSuccess,
  onRegisterUser,
  onShowToast,
  onSpeak,
  onStopSpeak
}: AuthScreenProps) {
  const [authTab, setAuthTab] = useState<0 | 1>(0);
  const [isRegister, setIsRegister] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  // Login form state
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPin, setLoginPin] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPin, setRegPin] = useState("");
  const [regGender, setRegGender] = useState<"Laki-laki" | "Perempuan">("Laki-laki");
  const [regAddress, setRegAddress] = useState("");

  // Google quick login selection
  const [selectedGoogleUserPhone, setSelectedGoogleUserPhone] = useState<string>(
    users[0]?.phone || "081271829911"
  );

  const handlePhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = loginPhone.trim();
    const pin = loginPin.trim();

    if (!phone || !pin) {
      onShowToast("Mohon masukkan Nomor HP dan PIN/Password Anda.");
      return;
    }

    if (phone === ADMIN_PHONE && pin === ADMIN_PASS) {
      const adminUser: UserProfile = {
        fullName: "Administrator Mitra NetraQu",
        phone: ADMIN_PHONE,
        isAdmin: true
      };
      onLoginSuccess(adminUser, "Selamat datang di Dashboard Administrator");
      return;
    }

    if (phone === ADMIN_PHONE && pin !== ADMIN_PASS) {
      onShowToast("Password Administrator salah!");
      return;
    }

    const found = users.find((u) => u.phone === phone && u.pin === pin);
    if (found) {
      onLoginSuccess(found, "Berhasil masuk sebagai " + found.fullName);
    } else {
      onShowToast("Nomor HP atau PIN tidak ditemukan. Silakan Daftar Akun Baru.");
    }
  };

  const handlePhoneRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = regName.trim();
    const phone = regPhone.trim();
    const pin = regPin.trim();
    const address = regAddress.trim();

    if (!fullName || phone.length < 8 || pin.length < 4 || !address) {
      onShowToast("Mohon lengkapi seluruh kolom pendaftaran dengan benar (PIN min. 4 digit).");
      return;
    }

    const newUser: UserProfile = {
      fullName,
      phone,
      pin,
      gender: regGender === "Perempuan" ? "Wanita" : "Pria",
      address,
      email: regEmail.trim(),
      photoUri: "",
      isDemo: false
    };

    onRegisterUser(newUser);
  };

  const handleGoogleQuickLogin = () => {
    const chosen = users.find((u) => u.phone === selectedGoogleUserPhone) || users[0];
    if (chosen) {
      onLoginSuccess(chosen, "Berhasil masuk dengan Akun Google (" + chosen.fullName + ")");
    }
  };

  const handleQuickDemoLogin = (role: "hendra" | "siti" | "admin") => {
    if (role === "admin") {
      setAuthTab(0);
      setIsRegister(false);
      setLoginPhone(ADMIN_PHONE);
      setLoginPin(ADMIN_PASS);
      onLoginSuccess(
        {
          fullName: "Administrator Mitra NetraQu",
          phone: ADMIN_PHONE,
          isAdmin: true
        },
        "Selamat datang di Dashboard Administrator"
      );
      return;
    }
    const targetPhone = role === "hendra" ? "081271829911" : "082199887766";
    const found = users.find((u) => u.phone === targetPhone) || users[0];
    if (found) {
      onLoginSuccess(found, "Berhasil masuk sebagai " + found.fullName);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-white">
      <TherapyBackdropPattern />

      {/* Top Accessibility & Brand Header */}
      <header className="relative z-10 w-full border-b border-[#0D5C91]/15 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <MitraNetraLogo />
          <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
            {/* Pilihan Gender Suara TTS (Pria / Wanita) */}
            <div
              className="inline-flex items-center bg-[#E6F2FA] border border-[#0D5C91]/20 rounded-lg p-0.5 text-xs font-bold"
              role="group"
              aria-label="Pilih Gender Suara Pembaca Layar"
            >
              <button
                type="button"
                onClick={() => onChangeTtsGender("pria")}
                className={`px-2.5 py-1.5 rounded-md transition cursor-pointer whitespace-nowrap ${
                  ttsGender === "pria"
                    ? "bg-[#0D5C91] text-white shadow-2xs"
                    : "text-[#0D5C91] hover:bg-[#0D5C91]/10"
                }`}
              >
                Suara Pria
              </button>
              <button
                type="button"
                onClick={() => onChangeTtsGender("wanita")}
                className={`px-2.5 py-1.5 rounded-md transition cursor-pointer whitespace-nowrap ${
                  ttsGender === "wanita"
                    ? "bg-[#4C9A2A] text-white shadow-2xs"
                    : "text-[#0D5C91] hover:bg-[#4C9A2A]/10"
                }`}
              >
                Suara Wanita
              </button>
            </div>

            {/* Pilihan Kecepatan Suara TTS (Lambat / Sedang / Cepat) */}
            <div
              className="inline-flex items-center bg-[#EAF6E5] border border-[#4C9A2A]/25 rounded-lg p-0.5 text-xs font-bold"
              role="group"
              aria-label="Pilih Kecepatan Suara Pembaca Layar"
            >
              {(["lambat", "sedang", "cepat"] as const).map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => onChangeTtsSpeed(spd)}
                  className={`px-2 py-1.5 rounded-md capitalize transition cursor-pointer whitespace-nowrap ${
                    ttsSpeed === spd
                      ? "bg-[#4C9A2A] text-white shadow-2xs"
                      : "text-[#0D5C91] hover:bg-[#4C9A2A]/15"
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                onSpeak(
                  "Selamat datang di aplikasi Mitra NetraQu Palembang. Layanan pemesanan terapis pijat tuna netra profesional. Silakan masuk menggunakan Nomor HP dan PIN, atau gunakan Akun Google."
                )
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-[#0D5C91] text-white hover:bg-[#4C9A2A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Bacakan Layar</span>
            </button>
            <button
              type="button"
              onClick={onStopSpeak}
              className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-bold text-[#0D5C91] bg-[#E6F2FA] hover:bg-[#0D5C91]/20 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Hentikan Suara"
            >
              <VolumeX className="w-4 h-4" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Split Grid */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Brand Value Proposition & Service Catalog Preview */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-white border border-[#0D5C91]/20 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="space-y-5">
              <div className="text-xs font-extrabold text-[#4C9A2A] tracking-wider uppercase">
                JASA PIJAT TERAPIS DISABILITAS NETRA · PALEMBANG
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D5C91] tracking-tight leading-tight">
                Solusi Kebugaran & Relaksasi Bersama Terapis Profesional
              </h1>
              <p className="text-sm sm:text-base text-[#0D5C91]/80 leading-relaxed">
                Mitra NetraQu menghadirkan layanan pijat kebugaran oleh terapis tuna netra terlatih di Palembang. Tersedia untuk kunjungan langsung ke outlet maupun panggilan ke rumah atau hotel.
              </p>

              {/* Image Carousel Below Description */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#0D5C91]/20 bg-white shadow-sm group">
                <div className="relative h-52 sm:h-64 w-full overflow-hidden bg-[#E6F2FA]">
                  {CAROUSEL_SLIDES.map((slide, idx) => (
                    <div
                      key={slide.src}
                      className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                        idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                      }`}
                    >
                      <img
                        src={slide.src}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D5C91]/90 via-[#0D5C91]/30 to-transparent" />
                      <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#4C9A2A] text-white mb-1">
                          Galeri Layanan {idx + 1}/{CAROUSEL_SLIDES.length}
                        </span>
                        <h3 className="text-sm sm:text-base font-extrabold leading-snug">
                          {slide.title}
                        </h3>
                        <p className="text-xs text-white/90 line-clamp-2 mt-0.5">
                          {slide.caption}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Prev / Next Navigation Buttons */}
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    aria-label="Gambar Sebelumnya"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-[#0D5C91] text-[#0D5C91] hover:text-white flex items-center justify-center shadow-md transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    aria-label="Gambar Berikutnya"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-[#0D5C91] text-[#0D5C91] hover:text-white flex items-center justify-center shadow-md transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Carousel Indicator Dots & Thumbnails */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-white border-t border-[#0D5C91]/15">
                  <div className="flex items-center gap-1.5">
                    {CAROUSEL_SLIDES.map((slide, idx) => (
                      <button
                        key={slide.src}
                        type="button"
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Pilih slide ${idx + 1}`}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          idx === currentSlide
                            ? "w-6 bg-[#4C9A2A]"
                            : "w-2 bg-[#0D5C91]/25 hover:bg-[#0D5C91]/50"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[11px] font-bold text-[#0D5C91]">
                    Terapis Profesional & Bersertifikat
                  </div>
                </div>
              </div>

              {/* Key Service Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#E6F2FA]/60 border border-[#0D5C91]/20">
                  <div className="flex items-center gap-2 text-[#0D5C91] font-bold text-xs mb-1">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>Jam Operasional</span>
                  </div>
                  <div className="text-xs text-[#0D5C91] font-bold">Senin – Sabtu</div>
                  <div className="text-xs text-[#4C9A2A] font-semibold font-mono tabular-nums">
                    09.00 – 20.00 WIB
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#EAF6E5]/70 border border-[#4C9A2A]/25">
                  <div className="flex items-center gap-2 text-[#4C9A2A] font-bold text-xs mb-1">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>Lokasi Outlet</span>
                  </div>
                  <div className="text-xs text-[#0D5C91] font-bold">{OUTLET_ADDRESS}</div>
                  <div className="text-xs text-[#4C9A2A] font-medium">Gratis biaya transport</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#E6F2FA]/60 border border-[#0D5C91]/20">
                  <div className="flex items-center gap-2 text-[#0D5C91] font-bold text-xs mb-1">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Etika Terapis</span>
                  </div>
                  <div className="text-xs text-[#0D5C91] font-bold">Sesuai Jenis Kelamin</div>
                  <div className="text-xs text-[#4C9A2A] font-medium">Maks. 3 Pria & 3 Wanita</div>
                </div>
              </div>

              {/* Tarif Ringkas */}
              <div className="pt-2">
                <h2 className="text-xs font-bold text-[#0D5C91] mb-2.5">
                  Daftar Tarif Layanan Pijat (Per Jam):
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SERVICES.map((srv) => (
                    <div
                      key={srv.id}
                      className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-white border border-[#0D5C91]/20 text-xs"
                    >
                      <span className="font-semibold text-[#0D5C91] leading-snug">
                        {srv.name}
                      </span>
                      <span className="font-bold text-[#4C9A2A] font-mono tabular-nums shrink-0">
                        {formatRupiah(srv.rate)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Demo Login Bar for Instant Testing */}
            <div className="mt-6 pt-5 border-t border-[#0D5C91]/15">
              <div className="text-xs font-bold text-[#0D5C91] mb-2">
                Akses Cepat Akun Demo (Satu Klik):
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("hendra")}
                  className="px-3 py-2 rounded-lg text-xs font-bold bg-[#E6F2FA] text-[#0D5C91] hover:bg-[#0D5C91] hover:text-white transition-colors cursor-pointer"
                >
                  Pelanggan: Bpk. Hendra (081271829911)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("siti")}
                  className="px-3 py-2 rounded-lg text-xs font-bold bg-[#EAF6E5] text-[#4C9A2A] hover:bg-[#4C9A2A] hover:text-white transition-colors cursor-pointer"
                >
                  Pelanggan: Ibu Siti (082199887766)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("admin")}
                  className="px-3 py-2 rounded-lg text-xs font-bold bg-[#0D5C91] text-white hover:bg-[#4C9A2A] transition-colors cursor-pointer"
                >
                  Admin Dashboard (081212345678)
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Login & Registration Card */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="bg-white border border-[#0D5C91]/25 rounded-2xl shadow-sm p-6 sm:p-7 w-full">
              {/* Official Mitra NetraQu Logo Banner */}
              <div className="bg-white border border-[#0D5C91]/20 rounded-2xl px-3 py-4 mb-5 flex justify-center items-center shadow-2xs">
                <MitraNetraFullLogo className="w-[88%] sm:w-[90%]" />
              </div>

              {/* Segmented Auth Tabs */}
              <div className="grid grid-cols-2 w-full bg-[#E6F2FA] rounded-xl p-1 mb-5">
                <button
                  type="button"
                  onClick={() => setAuthTab(0)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap ${
                    authTab === 0
                      ? "bg-[#0D5C91] text-white shadow-xs"
                      : "text-[#0D5C91] hover:bg-[#0D5C91]/10"
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>No. HP + PIN</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab(1)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap ${
                    authTab === 1
                      ? "bg-[#4C9A2A] text-white shadow-xs"
                      : "text-[#0D5C91] hover:bg-[#0D5C91]/10"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Akun Google</span>
                </button>
              </div>

              {authTab === 0 ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-bold text-[#0D5C91]">
                      {isRegister ? "Daftar Akun Pelanggan" : "Masuk Akun No. HP"}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setIsRegister(!isRegister)}
                      className="text-xs font-bold text-[#4C9A2A] hover:underline cursor-pointer"
                    >
                      {isRegister ? "Sudah ada akun? Masuk" : "Daftar Akun Baru"}
                    </button>
                  </div>

                  {!isRegister ? (
                    <form onSubmit={handlePhoneLogin} className="space-y-4">
                      <div>
                        <label
                          htmlFor="loginPhone"
                          className="block text-xs font-bold text-[#0D5C91] mb-1.5"
                        >
                          Nomor WhatsApp / HP
                        </label>
                        <input
                          id="loginPhone"
                          type="tel"
                          value={loginPhone}
                          onChange={(e) => setLoginPhone(e.target.value)}
                          placeholder="Contoh: 081271829911"
                          className="w-full bg-white border border-[#0D5C91]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#0D5C91] font-mono focus:outline-none focus:border-[#4C9A2A]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="loginPin"
                          className="block text-xs font-bold text-[#0D5C91] mb-1.5"
                        >
                          PIN / Password
                        </label>
                        <input
                          id="loginPin"
                          type="password"
                          value={loginPin}
                          onChange={(e) => setLoginPin(e.target.value)}
                          placeholder="Masukkan PIN (contoh: 123456)"
                          className="w-full bg-white border border-[#0D5C91]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#0D5C91] focus:outline-none focus:border-[#4C9A2A]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#0D5C91] hover:bg-[#4C9A2A] text-white font-bold py-3 rounded-xl shadow-xs transition cursor-pointer"
                      >
                        Masuk Sekarang
                      </button>

                      <div className="pt-2 text-[11px] text-[#0D5C91] space-y-1 bg-[#E6F2FA]/60 p-3 rounded-xl border border-[#0D5C91]/20">
                        <div className="font-bold text-[#0D5C91]">Petunjuk Login:</div>
                        <div>
                          • Pelanggan Contoh: <span className="font-mono font-bold">081271829911</span> / PIN:{" "}
                          <span className="font-mono font-bold text-[#4C9A2A]">123456</span>
                        </div>
                        <div>
                          • Admin: <span className="font-mono font-bold">{ADMIN_PHONE}</span> / Pass:{" "}
                          <span className="font-mono font-bold text-[#4C9A2A]">{ADMIN_PASS}</span>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handlePhoneRegister} className="space-y-3">
                      <div>
                        <label
                          htmlFor="regName"
                          className="block text-xs font-bold text-[#0D5C91] mb-1"
                        >
                          Nama Lengkap
                        </label>
                        <input
                          id="regName"
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Nama lengkap Anda"
                          className="w-full bg-white border border-[#0D5C91]/30 rounded-xl px-3.5 py-2 text-sm text-[#0D5C91] focus:outline-none focus:border-[#4C9A2A]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="regPhone"
                          className="block text-xs font-bold text-[#0D5C91] mb-1"
                        >
                          Nomor WhatsApp / HP
                        </label>
                        <input
                          id="regPhone"
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="Contoh: 081234567890"
                          className="w-full bg-white border border-[#0D5C91]/30 rounded-xl px-3.5 py-2 text-sm text-[#0D5C91] font-mono focus:outline-none focus:border-[#4C9A2A]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="regEmail"
                          className="block text-xs font-bold text-[#0D5C91] mb-1"
                        >
                          Email (Opsional)
                        </label>
                        <input
                          id="regEmail"
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="Contoh: nama@gmail.com"
                          className="w-full bg-white border border-[#0D5C91]/30 rounded-xl px-3.5 py-2 text-sm text-[#0D5C91] focus:outline-none focus:border-[#4C9A2A]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="regPin"
                          className="block text-xs font-bold text-[#0D5C91] mb-1"
                        >
                          Buat PIN (4–6 Digit)
                        </label>
                        <input
                          id="regPin"
                          type="password"
                          maxLength={6}
                          value={regPin}
                          onChange={(e) => setRegPin(e.target.value)}
                          placeholder="Contoh: 123456"
                          className="w-full bg-white border border-[#0D5C91]/30 rounded-xl px-3.5 py-2 text-sm text-[#0D5C91] focus:outline-none focus:border-[#4C9A2A]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="regGender"
                          className="block text-xs font-bold text-[#0D5C91] mb-1"
                        >
                          Jenis Kelamin (Untuk Penugasan Terapis)
                        </label>
                        <select
                          id="regGender"
                          value={regGender}
                          onChange={(e) =>
                            setRegGender(e.target.value as "Laki-laki" | "Perempuan")
                          }
                          className="w-full border border-[#0D5C91]/30 rounded-xl px-3.5 py-2 text-sm text-[#0D5C91] bg-white focus:outline-none focus:border-[#4C9A2A]"
                        >
                          <option value="Laki-laki">Laki-laki (Terapis Pria)</option>
                          <option value="Perempuan">Perempuan (Terapis Wanita)</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="regAddress"
                          className="block text-xs font-bold text-[#0D5C91] mb-1"
                        >
                          Alamat Domisili Palembang
                        </label>
                        <textarea
                          id="regAddress"
                          rows={2}
                          value={regAddress}
                          onChange={(e) => setRegAddress(e.target.value)}
                          placeholder="Nama jalan, kelurahan, kecamatan di Palembang"
                          className="w-full bg-white border border-[#0D5C91]/30 rounded-xl px-3.5 py-2 text-sm text-[#0D5C91] focus:outline-none focus:border-[#4C9A2A]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#4C9A2A] hover:bg-[#0D5C91] text-white font-bold py-3 rounded-xl shadow-xs transition cursor-pointer"
                      >
                        Daftar Akun Sekarang
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center space-y-1.5">
                    <h3 className="text-base font-bold text-[#0D5C91]">
                      Masuk Cepat dengan Google
                    </h3>
                    <p className="text-xs text-[#0D5C91]/80">
                      Pilih akun Google Anda untuk masuk dengan satu ketukan dan memesan layanan terapis pijat tuna netra.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {users.map((u) => {
                      const isSelected = selectedGoogleUserPhone === u.phone;
                      return (
                        <button
                          key={u.phone}
                          type="button"
                          onClick={() => setSelectedGoogleUserPhone(u.phone)}
                          className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? "border-[#4C9A2A] bg-[#EAF6E5]/70"
                              : "border-[#0D5C91]/20 bg-white hover:bg-[#E6F2FA]/40"
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold text-[#0D5C91]">
                              {u.fullName}
                            </div>
                            <div className="text-[11px] text-[#4C9A2A] font-medium">
                              {u.email || `${u.phone}@gmail.com`} · {u.phone}
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-[#4C9A2A] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleQuickLogin}
                    className="w-full bg-[#4C9A2A] hover:bg-[#0D5C91] text-white font-bold py-3 rounded-xl shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Lanjutkan dengan Google</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="relative z-10 w-full py-4 text-center text-xs font-medium text-[#0D5C91] border-t border-[#0D5C91]/15 bg-white">
        Mitra NetraQu Palembang · {OUTLET_ADDRESS} · Senin–Sabtu (09.00–20.00 WIB)
      </footer>
    </div>
  );
}
