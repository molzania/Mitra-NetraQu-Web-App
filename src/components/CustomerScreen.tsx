import React, { useState } from "react";
import {
  BookingDraft,
  MAX_PARTICIPANTS,
  OUTLET_ADDRESS,
  OrderRecord,
  SERVICES,
  TIME_SLOTS,
  TRANSPORT_FEE,
  UserProfile,
  buildWhatsAppMessage,
  formatRupiah,
  getStatusObj,
  isDemoOrAdminUser
} from "../data/constants";
import { MITRA_ICON_IMAGE, UserAvatar } from "./BrandMark";
import {
  Volume2,
  Calendar,
  MapPin,
  Copy,
  MessageCircle,
  User,
  ClipboardList,
  Sparkles,
  LogOut,
  Camera,
  Check,
  X,
  Lock,
  KeyRound
} from "lucide-react";

interface CustomerScreenProps {
  currentUser: UserProfile;
  orders: OrderRecord[];
  csWhatsApp: string;
  ttsEnabled: boolean;
  ttsGender: "pria" | "wanita";
  ttsSpeed: "lambat" | "sedang" | "cepat";
  onChangeTtsGender: (gender: "pria" | "wanita") => void;
  onChangeTtsSpeed: (speed: "lambat" | "sedang" | "cepat") => void;
  onToggleTts: () => void;
  onSpeak: (text: string) => void;
  onStopSpeak: () => void;
  onCopyText: (text: string, label?: string) => void;
  onCreateOrder: (newOrder: OrderRecord) => void;
  onUpdateUser: (
    updated: UserProfile,
    toastMsg?: string,
    previousPhone?: string
  ) => void;
  onLogout: () => void;
}

function normalizeGenderLabel(
  g?: string
): "Pria" | "Wanita" {
  if (g === "Wanita" || g === "Perempuan") return "Wanita";
  return "Pria";
}

export function CustomerScreen({
  currentUser,
  orders,
  csWhatsApp,
  ttsEnabled,
  ttsGender,
  ttsSpeed,
  onChangeTtsGender,
  onChangeTtsSpeed,
  onToggleTts,
  onSpeak,
  onStopSpeak,
  onCopyText,
  onCreateOrder,
  onUpdateUser,
  onLogout
}: CustomerScreenProps) {
  const [customerTab, setCustomerTab] = useState<0 | 1 | 2>(0);
  const [activeWhatsAppOrder, setActiveWhatsAppOrder] = useState<OrderRecord | null>(null);

  const isFemaleInitial = normalizeGenderLabel(currentUser.gender) === "Wanita";

  const [booking, setBooking] = useState<BookingDraft>(() => ({
    services: { srv_body: 1 },
    maleCount: isFemaleInitial ? 0 : 1,
    femaleCount: isFemaleInitial ? 1 : 0,
    bookingDate: new Date().toISOString().split("T")[0],
    timeSlot: "09.00 WIB",
    locationType: "Datang ke Lokasi Pijat",
    customAddress: currentUser.address || "",
    customMessage: ""
  }));

  // Profile editable fields (7 fields requested)
  const [editName, setEditName] = useState(currentUser.fullName || "");
  const [editNickname, setEditNickname] = useState(
    currentUser.nickname ||
      currentUser.fullName
        .replace(/^(bpk\.?|bapak|ibu|bu\.?|sdr\.?|sdri\.?)\s+/i, "")
        .split(/\s+/)[0] ||
      ""
  );
  const [editAddress, setEditAddress] = useState(currentUser.address || "");
  const [editLandmark, setEditLandmark] = useState(currentUser.landmark || "");
  const [editEmail, setEditEmail] = useState(currentUser.email || "");
  const [editPhone, setEditPhone] = useState(currentUser.phone || "");
  const [editGender, setEditGender] = useState<"Pria" | "Wanita">(
    normalizeGenderLabel(currentUser.gender)
  );

  // Password / PIN change state
  const isLockedCredentials = isDemoOrAdminUser(currentUser);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  // Calculate booking costs
  const totalParticipants = booking.maleCount + booking.femaleCount;
  let costPerPerson = 0;
  const selectedServiceSummaries: string[] = [];

  Object.entries(booking.services).forEach(([id, dur]) => {
    const srv = SERVICES.find((x) => x.id === id);
    if (srv) {
      costPerPerson += srv.rate * dur;
      selectedServiceSummaries.push(`${srv.name} (${dur} Jam)`);
    }
  });

  const serviceCost = costPerPerson * totalParticipants;
  const transport = booking.locationType === "Panggilan ke Rumah" ? TRANSPORT_FEE : 0;
  const totalPayment = serviceCost + transport;

  const toggleService = (srvId: string) => {
    setBooking((prev) => {
      const nextServices = { ...prev.services };
      if (nextServices[srvId]) {
        if (Object.keys(nextServices).length > 1) {
          delete nextServices[srvId];
        }
      } else {
        nextServices[srvId] = 1;
      }
      return { ...prev, services: nextServices };
    });
  };

  const setServiceDur = (srvId: string, dur: number) => {
    setBooking((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [srvId]: dur
      }
    }));
  };

  const updateParticipant = (type: "male" | "female", delta: number) => {
    setBooking((prev) => {
      const m = prev.maleCount;
      const f = prev.femaleCount;
      if (type === "male") {
        const nextM = m + delta;
        if (nextM >= 0 && nextM <= MAX_PARTICIPANTS && nextM + f >= 1) {
          return { ...prev, maleCount: nextM };
        }
      } else {
        const nextF = f + delta;
        if (nextF >= 0 && nextF <= MAX_PARTICIPANTS && m + nextF >= 1) {
          return { ...prev, femaleCount: nextF };
        }
      }
      return prev;
    });
  };

  const submitBookingOrder = () => {
    const orderId =
      "MNQ-" +
      booking.bookingDate.replaceAll("-", "") +
      "-" +
      Math.floor(1000 + Math.random() * 9000);

    const address =
      booking.locationType === "Datang ke Lokasi Pijat"
        ? OUTLET_ADDRESS
        : (booking.customAddress.trim() || currentUser.address || "Palembang");

    const newOrder: OrderRecord = {
      orderId,
      customerName: currentUser.fullName,
      customerPhone: currentUser.phone,
      bookingDate: booking.bookingDate,
      timeSlot: booking.timeSlot,
      servicesSummary: selectedServiceSummaries.join(", "),
      maleCount: booking.maleCount,
      femaleCount: booking.femaleCount,
      totalParticipants,
      locationType: booking.locationType,
      serviceAddress: address,
      customMessage: booking.customMessage.trim(),
      totalPayment,
      status: "PENDING_CONFIRMATION"
    };

    onCreateOrder(newOrder);
    setActiveWhatsAppOrder(newOrder);
    setCustomerTab(1);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result as string;
      if (result) {
        onUpdateUser({ ...currentUser, photoUri: result }, "Foto profil berhasil diperbarui");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfileDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedPhone = editPhone.trim() || currentUser.phone;
    onUpdateUser(
      {
        ...currentUser,
        fullName: editName.trim() || currentUser.fullName,
        nickname: editNickname.trim(),
        address: editAddress.trim(),
        landmark: editLandmark.trim(),
        email: isLockedCredentials ? currentUser.email || "" : editEmail.trim(),
        phone: cleanedPhone,
        gender: editGender,
        isDemo: isLockedCredentials && !currentUser.isAdmin ? true : currentUser.isDemo
      },
      "Data profil pelanggan berhasil disimpan",
      currentUser.phone
    );
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (isLockedCredentials) {
      setPasswordStatus({
        type: "error",
        text: "Akun Demo dan Administrator tidak dapat mengubah Password/PIN."
      });
      return;
    }

    const currentPin = currentUser.pin || "";
    if (currentPin && oldPassword.trim() !== currentPin) {
      setPasswordStatus({
        type: "error",
        text: "Password / PIN lama yang Anda masukkan tidak sesuai."
      });
      return;
    }

    if (newPassword.trim().length < 4) {
      setPasswordStatus({
        type: "error",
        text: "Password / PIN baru minimal harus terdiri dari 4 karakter/digit."
      });
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      setPasswordStatus({
        type: "error",
        text: "Konfirmasi Password / PIN baru tidak cocok."
      });
      return;
    }

    onUpdateUser(
      {
        ...currentUser,
        pin: newPassword.trim()
      },
      "Password / PIN akun berhasil diperbarui!",
      currentUser.phone
    );

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordStatus({
      type: "success",
      text: "Password / PIN Anda berhasil diperbarui!"
    });
  };

  const myOrders = orders.filter((o) => o.customerPhone === currentUser.phone);

  const summaryText =
    customerTab === 0
      ? `Halaman Pemesanan Layanan Mitra NetraQu Palembang. Layanan dipilih: ${selectedServiceSummaries.join(
          ", "
        )}. Jumlah peserta ${totalParticipants} orang. Jadwal tanggal ${
          booking.bookingDate
        } jam ${booking.timeSlot}. Lokasi: ${
          booking.locationType
        }. Total biaya ${formatRupiah(totalPayment)}.`
      : customerTab === 1
      ? `Halaman Riwayat Pesanan Anda. Terdapat ${myOrders.length} pesanan tercatat atas nama ${currentUser.fullName}.`
      : `Halaman Profil Pengguna dan Pengaturan Aksesibilitas Mitra NetraQu untuk ${currentUser.fullName}, nomor telepon ${currentUser.phone}.`;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Bar Contract (Desktop & Mobile) */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#0D5C91]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Title with Uploaded Icon Image */}
          <button
            type="button"
            onClick={() => setCustomerTab(0)}
            className="inline-flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 cursor-pointer"
          >
            <div className="w-14 h-11 rounded-xl overflow-hidden bg-white border border-[#0D5C91]/25 shrink-0 flex items-center justify-center">
              <img
                src={MITRA_ICON_IMAGE}
                alt="Logo Mitra NetraQu"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center scale-[1.12]"
              />
            </div>
            <div className="leading-tight">
              <div className="text-base sm:text-lg font-extrabold tracking-tight leading-none">
                <span className="text-[#0D5C91]">Mitra</span>{" "}
                <span className="text-[#4C9A2A]">NetraQu</span>
              </div>
              <div className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide text-slate-900 mt-0.5">
                JASA PIJAT TERAPIS DISABILITAS NETRA
              </div>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-[#0D5C91]/70">
            <button
              type="button"
              onClick={() => setCustomerTab(0)}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                customerTab === 0
                  ? "border-[#4C9A2A] text-[#0D5C91]"
                  : "border-transparent hover:text-[#4C9A2A]"
              }`}
            >
              Pesan Layanan
            </button>
            <button
              type="button"
              onClick={() => setCustomerTab(1)}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                customerTab === 1
                  ? "border-[#4C9A2A] text-[#0D5C91]"
                  : "border-transparent hover:text-[#4C9A2A]"
              }`}
            >
              Riwayat Pesanan ({myOrders.length})
            </button>
            <button
              type="button"
              onClick={() => setCustomerTab(2)}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                customerTab === 2
                  ? "border-[#4C9A2A] text-[#0D5C91]"
                  : "border-transparent hover:text-[#4C9A2A]"
              }`}
            >
              Profil Pelanggan
            </button>
          </nav>

          {/* Zone 3: Primary Action (Logout / Keluar dari Aplikasi) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Aplikasi</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dedicated Accessibility Screen Reader Bar */}
      <div className="bg-[#0D5C91] text-white px-4 py-2 border-b border-[#4C9A2A]/30">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 shrink-0 text-[#EAF6E5]" />
            <span>
              <strong>Pembaca Layar (TTS Bahasa Indonesia)</strong> · Membantu aksesibilitas pelanggan & terapis tuna netra
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Pilihan Gender Suara TTS (Pria / Wanita) */}
            <div
              className="inline-flex items-center bg-white/15 rounded-md p-0.5 text-xs font-bold"
              role="group"
              aria-label="Pilih Gender Suara Pembaca Layar"
            >
              <button
                type="button"
                onClick={() => onChangeTtsGender("pria")}
                className={`px-2.5 py-1 rounded transition cursor-pointer whitespace-nowrap ${
                  ttsGender === "pria"
                    ? "bg-white text-[#0D5C91] shadow-2xs"
                    : "text-white hover:bg-white/10"
                }`}
              >
                Suara Pria
              </button>
              <button
                type="button"
                onClick={() => onChangeTtsGender("wanita")}
                className={`px-2.5 py-1 rounded transition cursor-pointer whitespace-nowrap ${
                  ttsGender === "wanita"
                    ? "bg-[#4C9A2A] text-white shadow-2xs"
                    : "text-white hover:bg-white/10"
                }`}
              >
                Suara Wanita
              </button>
            </div>

            {/* Pilihan Kecepatan Suara TTS (Lambat / Sedang / Cepat) */}
            <div
              className="inline-flex items-center bg-white/15 rounded-md p-0.5 text-xs font-bold"
              role="group"
              aria-label="Pilih Kecepatan Suara Pembaca Layar"
            >
              {(["lambat", "sedang", "cepat"] as const).map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => onChangeTtsSpeed(spd)}
                  className={`px-2 py-1 rounded capitalize transition cursor-pointer whitespace-nowrap ${
                    ttsSpeed === spd
                      ? "bg-[#4C9A2A] text-white shadow-2xs"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onSpeak(summaryText)}
              className="px-2.5 py-1 rounded-md bg-white text-[#0D5C91] hover:bg-[#EAF6E5] font-bold transition cursor-pointer whitespace-nowrap"
            >
              🔊 Bacakan Layar
            </button>
            <button
              type="button"
              onClick={onToggleTts}
              className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer whitespace-nowrap ${
                ttsEnabled
                  ? "bg-[#4C9A2A] text-white"
                  : "bg-white/15 hover:bg-white/25 text-white"
              }`}
            >
              Suara Otomatis: {ttsEnabled ? "Aktif" : "Nonaktif"}
            </button>
            <button
              type="button"
              onClick={onStopSpeak}
              className="px-2.5 py-1 rounded-md bg-white/15 hover:bg-white/25 text-white font-semibold transition cursor-pointer whitespace-nowrap"
            >
              Stop
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 bg-white">
        {customerTab === 0 && (
          <div className="space-y-6">
            {/* Banner Header */}
            <div className="bg-[#E6F2FA] border border-[#0D5C91]/25 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <UserAvatar
                  photoUri={currentUser.photoUri}
                  name={currentUser.fullName}
                  size="md"
                />
                <div>
                  <h1 className="font-extrabold text-[#0D5C91] text-base sm:text-lg">
                    Halo, {currentUser.fullName}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#4C9A2A] font-semibold">
                    Layanan Terapis Pijat Tuna Netra Bersertifikat · Senin–Sabtu (09.00–20.00 WIB)
                  </p>
                </div>
              </div>
              <div className="text-xs text-[#0D5C91] sm:text-right">
                <div className="font-medium">Outlet Utama:</div>
                <div className="font-extrabold text-[#0D5C91]">{OUTLET_ADDRESS}</div>
              </div>
            </div>

            {/* 2-Column Booking Workspace on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 7 Columns: 1. Pilih Layanan & 2. Komposisi Peserta */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Pilih Layanan & Durasi Pijat */}
                <section className="bg-white border border-[#0D5C91]/25 rounded-2xl p-5 shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-sm sm:text-base text-[#0D5C91]">
                      01. Pilih Layanan & Durasi Pijat
                    </h2>
                    <span className="text-xs font-semibold text-[#4C9A2A]">
                      Bisa pilih lebih dari 1 layanan
                    </span>
                  </div>

                  <div className="space-y-3">
                    {SERVICES.map((s) => {
                      const selectedDur = booking.services[s.id];
                      return (
                        <div
                          key={s.id}
                          className={`border rounded-xl p-3.5 transition ${
                            selectedDur
                              ? "border-[#4C9A2A] bg-[#EAF6E5]/50"
                              : "border-[#0D5C91]/20 bg-white hover:border-[#0D5C91]/50"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-3">
                            <label className="flex items-start gap-3 cursor-pointer flex-1">
                              <input
                                type="checkbox"
                                checked={Boolean(selectedDur)}
                                onChange={() => toggleService(s.id)}
                                className="mt-1 accent-[#4C9A2A] w-4 h-4 cursor-pointer"
                              />
                              <div className="flex-1">
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                  <span className="font-bold text-sm text-[#0D5C91]">
                                    {s.name}
                                  </span>
                                  <span className="text-xs font-bold text-[#4C9A2A] font-mono tabular-nums">
                                    {formatRupiah(s.rate)} / Jam
                                  </span>
                                </div>
                                <p className="text-xs text-[#0D5C91]/80 mt-1">{s.desc}</p>
                              </div>
                            </label>
                          </div>

                          {selectedDur && (
                            <div className="mt-3 pt-2.5 border-t border-[#4C9A2A]/25 flex items-center justify-between text-xs">
                              <span className="font-bold text-[#0D5C91]">
                                Pilih Durasi Layanan:
                              </span>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setServiceDur(s.id, 1)}
                                  className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${
                                    selectedDur === 1
                                      ? "bg-[#0D5C91] text-white"
                                      : "bg-white border border-[#0D5C91]/30 text-[#0D5C91] hover:bg-[#E6F2FA]"
                                  }`}
                                >
                                  1 Jam ({formatRupiah(s.rate)})
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setServiceDur(s.id, 2)}
                                  className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${
                                    selectedDur === 2
                                      ? "bg-[#4C9A2A] text-white"
                                      : "bg-white border border-[#0D5C91]/30 text-[#0D5C91] hover:bg-[#EAF6E5]"
                                  }`}
                                >
                                  2 Jam ({formatRupiah(s.rate * 2)})
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* 2. Komposisi Peserta */}
                <section className="bg-white border border-[#0D5C91]/25 rounded-2xl p-5 shadow-xs space-y-3.5">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <h2 className="font-bold text-sm sm:text-base text-[#0D5C91]">
                      02. Komposisi Peserta
                    </h2>
                    <span className="text-xs font-bold text-[#4C9A2A]">
                      Total Peserta: {totalParticipants} Orang
                    </span>
                  </div>
                  <p className="text-xs text-[#0D5C91]/80 leading-relaxed">
                    Sesuai standar etika layanan Mitra NetraQu: Peserta laki-laki maksimal {MAX_PARTICIPANTS} orang (ditangani Terapis Pria), dan peserta perempuan maksimal {MAX_PARTICIPANTS} orang (ditangani Terapis Wanita).
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between border border-[#0D5C91]/25 bg-[#E6F2FA]/30 rounded-xl p-3.5">
                      <div>
                        <div className="text-sm font-bold text-[#0D5C91]">
                          Peserta Laki-laki
                        </div>
                        <div className="text-xs text-[#4C9A2A] font-semibold">
                          Maksimal {MAX_PARTICIPANTS} orang (Terapis Pria)
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateParticipant("male", -1)}
                          aria-label="Kurangi peserta laki-laki"
                          className="w-10 h-10 rounded-lg bg-white border border-[#0D5C91]/30 hover:bg-[#E6F2FA] font-bold text-lg text-[#0D5C91] transition cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-bold text-base w-6 text-center text-[#0D5C91] font-mono tabular-nums">
                          {booking.maleCount}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateParticipant("male", 1)}
                          disabled={booking.maleCount >= MAX_PARTICIPANTS}
                          aria-label="Tambah peserta laki-laki"
                          className="w-10 h-10 rounded-lg bg-[#0D5C91] hover:bg-[#4C9A2A] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-lg transition cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border border-[#4C9A2A]/30 bg-[#EAF6E5]/40 rounded-xl p-3.5">
                      <div>
                        <div className="text-sm font-bold text-[#0D5C91]">
                          Peserta Perempuan
                        </div>
                        <div className="text-xs text-[#4C9A2A] font-semibold">
                          Maksimal {MAX_PARTICIPANTS} orang (Terapis Wanita)
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateParticipant("female", -1)}
                          aria-label="Kurangi peserta perempuan"
                          className="w-10 h-10 rounded-lg bg-white border border-[#4C9A2A]/30 hover:bg-[#EAF6E5] font-bold text-lg text-[#4C9A2A] transition cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-bold text-base w-6 text-center text-[#0D5C91] font-mono tabular-nums">
                          {booking.femaleCount}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateParticipant("female", 1)}
                          disabled={booking.femaleCount >= MAX_PARTICIPANTS}
                          aria-label="Tambah peserta perempuan"
                          className="w-10 h-10 rounded-lg bg-[#4C9A2A] hover:bg-[#0D5C91] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-lg transition cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right 5 Columns: 3. Jadwal & Lokasi + 4. Ringkasan Biaya */}
              <div className="lg:col-span-5 space-y-6">
                {/* 3. Jadwal & Lokasi Layanan */}
                <section className="bg-white border border-[#0D5C91]/25 rounded-2xl p-5 shadow-xs space-y-4">
                  <h2 className="font-bold text-sm sm:text-base text-[#0D5C91]">
                    03. Jadwal & Lokasi Layanan
                  </h2>

                  <div>
                    <label
                      htmlFor="bookingDate"
                      className="block text-xs font-bold text-[#0D5C91] mb-1.5"
                    >
                      Tanggal Layanan (Senin – Sabtu)
                    </label>
                    <input
                      id="bookingDate"
                      type="date"
                      value={booking.bookingDate}
                      onChange={(e) =>
                        setBooking((prev) => ({ ...prev, bookingDate: e.target.value }))
                      }
                      className="w-full bg-white border border-[#0D5C91]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#0D5C91] font-mono focus:outline-none focus:border-[#4C9A2A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0D5C91] mb-1.5">
                      Jam Mulai Sesi Pijat
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() =>
                            setBooking((prev) => ({ ...prev, timeSlot: slot }))
                          }
                          className={`py-2.5 rounded-lg text-xs font-bold border font-mono tabular-nums transition cursor-pointer whitespace-nowrap ${
                            booking.timeSlot === slot
                              ? "bg-[#0D5C91] text-white border-[#0D5C91]"
                              : "bg-white text-[#0D5C91] border-[#0D5C91]/25 hover:bg-[#E6F2FA]"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1">
                    <label className="block text-xs font-bold text-[#0D5C91] mb-1.5">
                      Pilihan Lokasi Pijat
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          setBooking((prev) => ({
                            ...prev,
                            locationType: "Datang ke Lokasi Pijat"
                          }))
                        }
                        className={`p-3 rounded-xl text-xs font-bold border text-left transition cursor-pointer ${
                          booking.locationType === "Datang ke Lokasi Pijat"
                            ? "bg-[#E6F2FA] border-[#0D5C91] text-[#0D5C91]"
                            : "bg-white border-[#0D5C91]/20 text-[#0D5C91]/70 hover:bg-[#E6F2FA]/40"
                        }`}
                      >
                        <div className="font-bold">Datang ke Outlet</div>
                        <div className="font-semibold text-[11px] text-[#4C9A2A] mt-0.5">
                          Gratis Biaya Transport
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setBooking((prev) => ({
                            ...prev,
                            locationType: "Panggilan ke Rumah"
                          }))
                        }
                        className={`p-3 rounded-xl text-xs font-bold border text-left transition cursor-pointer ${
                          booking.locationType === "Panggilan ke Rumah"
                            ? "bg-[#EAF6E5] border-[#4C9A2A] text-[#4C9A2A]"
                            : "bg-white border-[#0D5C91]/20 text-[#0D5C91]/70 hover:bg-[#EAF6E5]/40"
                        }`}
                      >
                        <div className="font-bold">Panggilan Rumah</div>
                        <div className="font-semibold text-[11px] mt-0.5 font-mono tabular-nums">
                          +Rp 100.000 PP
                        </div>
                      </button>
                    </div>
                  </div>

                  {booking.locationType === "Datang ke Lokasi Pijat" ? (
                    <div className="bg-[#E6F2FA]/50 p-3.5 rounded-xl text-xs text-[#0D5C91] border border-[#0D5C91]/20">
                      <div className="font-bold text-[#0D5C91] mb-0.5">
                        Alamat Outlet Mitra NetraQu:
                      </div>
                      <div className="font-medium">{OUTLET_ADDRESS}</div>
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor="customAddress"
                        className="block text-xs font-bold text-[#0D5C91] mb-1"
                      >
                        Alamat Rumah / Hotel Tujuan di Palembang
                      </label>
                      <textarea
                        id="customAddress"
                        rows={2}
                        value={booking.customAddress}
                        onChange={(e) =>
                          setBooking((prev) => ({
                            ...prev,
                            customAddress: e.target.value
                          }))
                        }
                        className="w-full bg-white border border-[#0D5C91]/30 rounded-xl p-2.5 text-sm text-[#0D5C91] focus:outline-none focus:border-[#4C9A2A]"
                        placeholder="Masukkan alamat lengkap rumah / nomor kamar hotel di Palembang"
                      />
                    </div>
                  )}
                </section>

                {/* 4. Ringkasan Biaya & Submit */}
                <section className="bg-[#E6F2FA] border border-[#0D5C91]/30 rounded-2xl p-5 space-y-3">
                  <h2 className="font-bold text-sm sm:text-base text-[#0D5C91]">
                    04. Ringkasan Biaya Pemesanan
                  </h2>

                  <div className="space-y-2 text-xs text-[#0D5C91]">
                    <div className="flex justify-between">
                      <span>Layanan Dipilih</span>
                      <span className="font-bold text-right max-w-[60%]">
                        {selectedServiceSummaries.join(", ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biaya per Peserta</span>
                      <span className="font-bold font-mono tabular-nums">
                        {formatRupiah(costPerPerson)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        Subtotal Layanan ({totalParticipants} Orang: {booking.maleCount} Pria,{" "}
                        {booking.femaleCount} Wanita)
                      </span>
                      <span className="font-bold font-mono tabular-nums">
                        {formatRupiah(serviceCost)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biaya Transportasi Terapis (PP)</span>
                      <span className="font-bold font-mono tabular-nums">
                        {formatRupiah(transport)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-[#0D5C91]/20 pt-3 flex justify-between items-center">
                    <span className="font-bold text-sm text-[#0D5C91]">
                      Total Pembayaran
                    </span>
                    <span className="font-extrabold text-lg text-[#4C9A2A] font-mono tabular-nums">
                      {formatRupiah(totalPayment)}
                    </span>
                  </div>

                  {/* Kolom Custom Message pada Bagian No. 4 */}
                  <div className="pt-2 border-t border-[#0D5C91]/15">
                    <label
                      htmlFor="customMessage"
                      className="block text-xs font-bold text-[#0D5C91] mb-1.5"
                    >
                      Pesan / Catatan Tambahan (Custom Message) :
                    </label>
                    <textarea
                      id="customMessage"
                      rows={2}
                      value={booking.customMessage}
                      onChange={(e) =>
                        setBooking((prev) => ({
                          ...prev,
                          customMessage: e.target.value
                        }))
                      }
                      placeholder="Tuliskan keluhan pegal, tekanan pijatan yang diinginkan, patokan lokasi, atau pesan khusus untuk terapis..."
                      className="w-full bg-white border border-[#0D5C91]/30 rounded-xl p-2.5 text-xs sm:text-sm text-[#0D5C91] focus:outline-none focus:border-[#4C9A2A]"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onSpeak(
                          `Ringkasan pesanan Anda: ${selectedServiceSummaries.join(
                            ", "
                          )} untuk ${totalParticipants} peserta pada tanggal ${
                            booking.bookingDate
                          } pukul ${booking.timeSlot}. Lokasi: ${
                            booking.locationType
                          }.${
                            booking.customMessage.trim()
                              ? ` Pesan tambahan: ${booking.customMessage.trim()}.`
                              : ""
                          } Total pembayaran ${formatRupiah(totalPayment)}.`
                        )
                      }
                      className="px-3.5 py-3 rounded-xl border border-[#0D5C91]/30 bg-white text-[#0D5C91] font-bold text-xs hover:bg-[#EAF6E5] transition cursor-pointer whitespace-nowrap"
                    >
                      🔊 Dengarkan Rincian
                    </button>
                    <button
                      type="button"
                      onClick={submitBookingOrder}
                      className="flex-1 bg-[#4C9A2A] hover:bg-[#0D5C91] text-white font-bold py-3.5 px-4 rounded-xl shadow-xs transition text-sm cursor-pointer"
                    >
                      Pesan & Konfirmasi ke WhatsApp CS
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {customerTab === 1 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-extrabold text-lg text-[#0D5C91]">
                  Riwayat Pesanan Anda
                </h2>
                <p className="text-xs text-[#4C9A2A] font-semibold">
                  Pantau 7 tahapan status pesanan terapis pijat Anda secara langsung.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCustomerTab(0)}
                className="px-4 py-2 rounded-xl bg-[#0D5C91] text-white text-xs font-bold hover:bg-[#4C9A2A] transition cursor-pointer"
              >
                + Buat Pesanan Baru
              </button>
            </div>

            {myOrders.length === 0 ? (
              <div className="bg-white border border-[#0D5C91]/25 rounded-2xl text-center py-16 px-4 space-y-3">
                <ClipboardList className="w-10 h-10 text-[#0D5C91] mx-auto" />
                <h3 className="font-bold text-base text-[#0D5C91]">
                  Belum Ada Riwayat Pesanan
                </h3>
                <p className="text-xs text-[#0D5C91]/75 max-w-sm mx-auto">
                  Pesanan terapis pijat yang Anda buat akan muncul di sini beserta status konfirmasi dari Admin.
                </p>
                <button
                  type="button"
                  onClick={() => setCustomerTab(0)}
                  className="px-4 py-2.5 rounded-xl bg-[#4C9A2A] text-white text-xs font-bold hover:bg-[#0D5C91] transition cursor-pointer"
                >
                  Pesan Terapis Sekarang
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myOrders.map((o) => {
                  const st = getStatusObj(o.status);
                  return (
                    <div
                      key={o.orderId}
                      className="bg-white border border-[#0D5C91]/25 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        {/* Top Header: Order ID + Unboxed Status Text */}
                        <div className="flex justify-between items-start gap-2 border-b border-[#0D5C91]/15 pb-2.5">
                          <div>
                            <span className="font-bold text-sm text-[#0D5C91] font-mono">
                              {o.orderId}
                            </span>
                            <div className="text-[11px] text-[#0D5C91]/70">
                              Pemesan: {o.customerName}
                            </div>
                          </div>
                          <div className={`text-xs font-bold ${st.textColor} text-right`}>
                            <span>{st.label}</span>
                            <span className="mx-1">·</span>
                            <span className="font-mono tabular-nums">Tahap {st.step}</span>
                          </div>
                        </div>

                        {/* 7-Step Progress Bar */}
                        <div className="w-full bg-[#E6F2FA] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#4C9A2A] h-full transition-all"
                            style={{ width: `${(st.stepNumber / 7) * 100}%` }}
                          />
                        </div>

                        <div className="space-y-1.5 text-xs text-[#0D5C91]">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-[#0D5C91] shrink-0" />
                            <span className="font-mono tabular-nums font-semibold">
                              {o.bookingDate} · {o.timeSlot}
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-[#4C9A2A] shrink-0 mt-0.5" />
                            <span className="font-medium">{o.servicesSummary}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-[#0D5C91] shrink-0" />
                            <span>
                              {o.totalParticipants} Peserta ({o.maleCount} Pria, {o.femaleCount}{" "}
                              Wanita)
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#4C9A2A] shrink-0 mt-0.5" />
                            <span>
                              {o.locationType} ({o.serviceAddress})
                            </span>
                          </div>
                          {o.customMessage && (
                            <div className="flex items-start gap-2 pt-1 text-[#0D5C91] bg-[#E6F2FA]/50 p-2 rounded-lg border border-[#0D5C91]/15">
                              <MessageCircle className="w-3.5 h-3.5 text-[#4C9A2A] shrink-0 mt-0.5" />
                              <span>
                                <strong>Pesan Tambahan:</strong> {o.customMessage}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#0D5C91]/15 flex flex-wrap justify-between items-center gap-2">
                        <span className="font-extrabold text-base text-[#4C9A2A] font-mono tabular-nums">
                          {formatRupiah(o.totalPayment)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              onSpeak(
                                `Pesanan ${o.orderId}. Status saat ini: ${st.label}, tahap ${
                                  st.step
                                }. Jadwal ${o.bookingDate} jam ${o.timeSlot}. Layanan ${
                                  o.servicesSummary
                                }. Total biaya ${formatRupiah(o.totalPayment)}.`
                              )
                            }
                            className="px-2.5 py-1.5 border border-[#0D5C91]/30 rounded-lg text-xs font-bold text-[#0D5C91] hover:bg-[#E6F2FA] cursor-pointer"
                            title="Bacakan pesanan ini"
                          >
                            🔊
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onCopyText(
                                `${o.orderId} - ${o.servicesSummary} - ${formatRupiah(
                                  o.totalPayment
                                )}`,
                                "Rincian pesanan"
                              )
                            }
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#0D5C91]/30 rounded-lg text-xs font-bold text-[#0D5C91] hover:bg-[#E6F2FA] cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveWhatsAppOrder(o)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#4C9A2A] hover:bg-[#0D5C91] text-white rounded-lg text-xs font-bold cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Kirim WA</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {customerTab === 2 && (
          <div className="max-w-2xl mx-auto space-y-5">
            {/* Kartu Profil & Foto */}
            <div className="bg-white border border-[#0D5C91]/25 rounded-2xl p-6 shadow-xs flex flex-col items-center text-center">
              <UserAvatar
                photoUri={currentUser.photoUri}
                name={currentUser.fullName}
                size="lg"
              />
              <label className="mt-3 inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold text-[#4C9A2A] hover:underline">
                <Camera className="w-3.5 h-3.5" />
                <span>Ganti Foto Profil</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>

              <h2 className="mt-2 font-extrabold text-lg text-[#0D5C91]">
                {currentUser.fullName}
                {currentUser.nickname ? ` (${currentUser.nickname})` : ""}
              </h2>
              <p className="text-xs text-[#4C9A2A] font-bold font-mono">
                {currentUser.phone} · {normalizeGenderLabel(currentUser.gender)}
              </p>
              {currentUser.email && (
                <p className="text-xs text-[#0D5C91]/80 mt-0.5">{currentUser.email}</p>
              )}
            </div>

            {/* Form Update Data Profil Pelanggan Lengkap */}
            <form
              onSubmit={handleSaveProfileDetails}
              className="bg-white border border-[#0D5C91]/25 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
            >
              <div className="border-b border-[#0D5C91]/15 pb-2.5">
                <h3 className="font-extrabold text-sm sm:text-base text-[#0D5C91]">
                  Perbarui Data Profil Pelanggan
                </h3>
                <p className="text-xs text-[#4C9A2A] font-medium mt-0.5">
                  Lengkapi data diri dan patokan lokasi untuk memudahkan terapis menuju lokasi Anda
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0D5C91] mb-1">
                    Nama Lengkap :
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Contoh: Bpk. Hendra Wijaya"
                    className="w-full bg-white border border-[#0D5C91]/30 rounded-xl px-3.5 py-2 text-sm text-[#0D5C91] focus:outline-none focus:border-[#4C9A2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D5C91] mb-1">
                    Nama Panggilan :
                  </label>
                  <input
                    type="text"
                    value={editNickname}
                    onChange={(e) => setEditNickname(e.target.value)}
                    placeholder="Contoh: Hendra"
                    className="w-full bg-white border border-[#0D5C91]/30 rounded-xl px-3.5 py-2 text-sm text-[#0D5C91] focus:outline-none focus:border-[#4C9A2A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D5C91] mb-1">
                  Alamat :
                </label>
                <textarea
                  rows={2}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan di Palembang"
                  className="w-full bg-white border border-[#0D5C91]/30 rounded-xl px-3.5 py-2 text-sm text-[#0D5C91] focus:outline-none focus:border-[#4C9A2A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D5C91] mb-1">
                  Patokan :
                </label>
                <input
                  type="text"
                  value={editLandmark}
                  onChange={(e) => setEditLandmark(e.target.value)}
                  placeholder="Contoh: Pagar hitam samping Masjid / Seberang Indomaret"
                  className="w-full bg-white border border-[#0D5C91]/30 rounded-xl px-3.5 py-2 text-sm text-[#0D5C91] focus:outline-none focus:border-[#4C9A2A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center justify-between text-xs font-bold text-[#0D5C91] mb-1">
                    <span>Email :</span>
                    {isLockedCredentials && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0D5C91] bg-[#E6F2FA] px-2 py-0.5 rounded-md">
                        <Lock className="w-3 h-3" />
                        <span>Terkunci (Akun Demo)</span>
                      </span>
                    )}
                  </label>
                  <input
                    type="email"
                    value={isLockedCredentials ? currentUser.email || "" : editEmail}
                    onChange={(e) => {
                      if (!isLockedCredentials) setEditEmail(e.target.value);
                    }}
                    disabled={isLockedCredentials}
                    placeholder="Contoh: nama@gmail.com"
                    className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none ${
                      isLockedCredentials
                        ? "bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed"
                        : "bg-white border-[#0D5C91]/30 text-[#0D5C91] focus:border-[#4C9A2A]"
                    }`}
                  />
                  {isLockedCredentials && (
                    <p className="text-[11px] text-[#0D5C91]/75 mt-1">
                      Email pada akun demo & administrator dikunci dan tidak dapat diubah.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D5C91] mb-1">
                    No. Hp :
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Contoh: 081271829911"
                    className="w-full bg-white border border-[#0D5C91]/30 rounded-xl px-3.5 py-2 text-sm text-[#0D5C91] font-mono focus:outline-none focus:border-[#4C9A2A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D5C91] mb-1.5">
                  Jenis Kelamin :
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditGender("Pria")}
                    className={`py-2.5 px-4 rounded-xl border-2 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      editGender === "Pria"
                        ? "bg-[#0D5C91] border-[#0D5C91] text-white shadow-2xs"
                        : "bg-white border-[#0D5C91]/25 text-[#0D5C91] hover:bg-[#E6F2FA]"
                    }`}
                  >
                    <span>Pria</span>
                    {editGender === "Pria" && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditGender("Wanita")}
                    className={`py-2.5 px-4 rounded-xl border-2 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      editGender === "Wanita"
                        ? "bg-[#4C9A2A] border-[#4C9A2A] text-white shadow-2xs"
                        : "bg-white border-[#4C9A2A]/30 text-[#0D5C91] hover:bg-[#EAF6E5]"
                    }`}
                  >
                    <span>Wanita</span>
                    {editGender === "Wanita" && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 bg-[#4C9A2A] hover:bg-[#0D5C91] text-white rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer"
              >
                Simpan Perubahan Profil
              </button>
            </form>

            {/* Form Pengaturan Perubahan Password / PIN */}
            <form
              onSubmit={handleChangePassword}
              className="bg-white border border-[#0D5C91]/25 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#0D5C91]/15 pb-2.5">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-[#0D5C91] flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#4C9A2A]" />
                    <span>Pengaturan Perubahan Password / PIN</span>
                  </h3>
                  <p className="text-xs text-[#4C9A2A] font-medium mt-0.5">
                    Perbarui Password atau PIN keamanan untuk masuk ke akun Anda
                  </p>
                </div>
                {isLockedCredentials && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E6F2FA] border border-[#0D5C91]/25 text-[#0D5C91] text-xs font-bold">
                    <Lock className="w-3.5 h-3.5 text-[#0D5C91]" />
                    <span>Akun Demo / Admin Terkunci</span>
                  </span>
                )}
              </div>

              {isLockedCredentials && (
                <div className="p-3.5 rounded-xl bg-[#E6F2FA]/80 border border-[#0D5C91]/25 text-xs text-[#0D5C91] flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-[#0D5C91] shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong>Perhatian:</strong> Hanya akun pelanggan baru/reguler yang dapat mengubah Email dan Password/PIN. Untuk menjaga ketersediaan akses publik, <strong>Akun Demo</strong> dan <strong>Administrator</strong> tidak dapat diubah Email maupun Password-nya.
                  </div>
                </div>
              )}

              {passwordStatus && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold border ${
                    passwordStatus.type === "success"
                      ? "bg-[#EAF6E5] border-[#4C9A2A]/40 text-[#4C9A2A]"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  {passwordStatus.text}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0D5C91] mb-1">
                    Password / PIN Lama :
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    disabled={isLockedCredentials}
                    placeholder={isLockedCredentials ? "••••••" : "Masukkan PIN lama"}
                    className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none ${
                      isLockedCredentials
                        ? "bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed"
                        : "bg-white border-[#0D5C91]/30 text-[#0D5C91] focus:border-[#4C9A2A]"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D5C91] mb-1">
                    Password / PIN Baru :
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLockedCredentials}
                    placeholder={isLockedCredentials ? "••••••" : "Minimal 4 digit/karakter"}
                    className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none ${
                      isLockedCredentials
                        ? "bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed"
                        : "bg-white border-[#0D5C91]/30 text-[#0D5C91] focus:border-[#4C9A2A]"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D5C91] mb-1">
                    Konfirmasi Password Baru :
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLockedCredentials}
                    placeholder={isLockedCredentials ? "••••••" : "Ulangi PIN baru"}
                    className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none ${
                      isLockedCredentials
                        ? "bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed"
                        : "bg-white border-[#0D5C91]/30 text-[#0D5C91] focus:border-[#4C9A2A]"
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLockedCredentials}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                  isLockedCredentials
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-[#0D5C91] hover:bg-[#4C9A2A] text-white cursor-pointer"
                }`}
              >
                {isLockedCredentials
                  ? "Perubahan Password Dikunci (Akun Demo)"
                  : "Simpan Password / PIN Baru"}
              </button>
            </form>

            <button
              type="button"
              onClick={onLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar dari Aplikasi</span>
            </button>
          </div>
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#0D5C91]/20 grid grid-cols-4 h-16 z-30">
        <button
          type="button"
          onClick={() => setCustomerTab(0)}
          className={`flex flex-col items-center justify-center gap-1 cursor-pointer ${
            customerTab === 0 ? "text-[#4C9A2A] font-bold" : "text-[#0D5C91]/70"
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[11px]">Pesan</span>
        </button>
        <button
          type="button"
          onClick={() => setCustomerTab(1)}
          className={`flex flex-col items-center justify-center gap-1 cursor-pointer ${
            customerTab === 1 ? "text-[#4C9A2A] font-bold" : "text-[#0D5C91]/70"
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[11px]">Riwayat ({myOrders.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setCustomerTab(2)}
          className={`flex flex-col items-center justify-center gap-1 cursor-pointer ${
            customerTab === 2 ? "text-[#4C9A2A] font-bold" : "text-[#0D5C91]/70"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[11px]">Profil</span>
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="flex flex-col items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[11px]">Keluar</span>
        </button>
      </nav>

      {/* WhatsApp Confirmation Modal / Drawer */}
      {activeWhatsAppOrder && (
        <div className="fixed inset-0 z-50 bg-[#0D5C91]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#0D5C91] rounded-2xl max-w-md w-full p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#0D5C91]/15 pb-3">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#4C9A2A]" />
                <h3 className="font-bold text-base text-[#0D5C91]">
                  Konfirmasi WhatsApp CS
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveWhatsAppOrder(null)}
                className="p-1 rounded-lg text-[#0D5C91] hover:bg-[#E6F2FA] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#0D5C91]">
              Pesanan <strong className="font-mono text-[#4C9A2A]">{activeWhatsAppOrder.orderId}</strong> telah tercatat. Kirimkan rincian berikut ke WhatsApp Customer Service Mitra NetraQu ({csWhatsApp}):
            </p>

            <pre className="bg-[#E6F2FA]/50 border border-[#0D5C91]/25 rounded-xl p-3 text-xs text-[#0D5C91] whitespace-pre-wrap font-sans leading-relaxed">
              {buildWhatsAppMessage(activeWhatsAppOrder)}
            </pre>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                type="button"
                onClick={() =>
                  onCopyText(
                    buildWhatsAppMessage(activeWhatsAppOrder),
                    "Format pesan WhatsApp"
                  )
                }
                className="flex-1 py-2.5 px-3 border border-[#0D5C91]/30 rounded-xl text-xs font-bold text-[#0D5C91] hover:bg-[#E6F2FA] cursor-pointer"
              >
                Salin Teks WA
              </button>
              <a
                href={`https://wa.me/${csWhatsApp}?text=${encodeURIComponent(
                  buildWhatsAppMessage(activeWhatsAppOrder)
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActiveWhatsAppOrder(null)}
                className="flex-1 py-2.5 px-4 bg-[#4C9A2A] hover:bg-[#0D5C91] text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Buka WhatsApp CS</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
