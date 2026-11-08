import React, { useState } from "react";
import {
  ADMIN_PHONE,
  ORDER_STATUSES,
  OrderRecord,
  OrderStatusCode,
  UserProfile,
  formatRupiah,
  getStatusObj
} from "../data/constants";
import { MITRA_ICON_IMAGE, UserAvatar } from "./BrandMark";
import {
  Search,
  Copy,
  LogOut,
  Volume2,
  Calendar,
  Users,
  ClipboardCheck,
  Wallet,
  Settings,
  MessageCircle,
  Lock
} from "lucide-react";

interface AdminScreenProps {
  orders: OrderRecord[];
  users: UserProfile[];
  csWhatsApp: string;
  ttsGender: "pria" | "wanita";
  ttsSpeed: "lambat" | "sedang" | "cepat";
  onChangeTtsGender: (gender: "pria" | "wanita") => void;
  onChangeTtsSpeed: (speed: "lambat" | "sedang" | "cepat") => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatusCode) => void;
  onUpdateCsWhatsApp: (newWa: string) => void;
  onCopyText: (text: string, label?: string) => void;
  onSpeak: (text: string) => void;
  onStopSpeak: () => void;
  onLogout: () => void;
}

export function AdminScreen({
  orders,
  users,
  csWhatsApp,
  ttsGender,
  ttsSpeed,
  onChangeTtsGender,
  onChangeTtsSpeed,
  onUpdateOrderStatus,
  onUpdateCsWhatsApp,
  onCopyText,
  onSpeak,
  onStopSpeak,
  onLogout
}: AdminScreenProps) {
  const [adminTab, setAdminTab] = useState<0 | 1 | 2>(0);
  const [dateFilter, setDateFilter] = useState<"ALL" | "TODAY" | "SPECIFIC">("ALL");
  const [specificDate, setSpecificDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [waInput, setWaInput] = useState(csWhatsApp);

  const todayIso = new Date().toISOString().split("T")[0];

  const filteredOrders = orders.filter((o) => {
    if (dateFilter === "TODAY" && o.bookingDate !== todayIso) return false;
    if (dateFilter === "SPECIFIC" && specificDate && o.bookingDate !== specificDate) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.orderId.toLowerCase().includes(q) ||
        o.servicesSummary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalRevenue = filteredOrders.reduce(
    (acc, o) => acc + Number(o.totalPayment || 0),
    0
  );
  const completedCount = filteredOrders.filter((o) => o.status === "COMPLETED").length;

  const handleSaveWa = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = waInput.replace(/\D/g, "");
    if (cleaned.length >= 9) {
      onUpdateCsWhatsApp(cleaned);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-[#0D5C91] text-white border-b border-[#4C9A2A]/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Title with Icon Image */}
          <div className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <div className="w-14 h-11 rounded-xl overflow-hidden bg-white shrink-0 flex items-center justify-center">
              <img
                src={MITRA_ICON_IMAGE}
                alt="Logo Mitra NetraQu"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center scale-[1.12]"
              />
            </div>
            <div className="leading-tight">
              <div className="font-extrabold text-base sm:text-lg tracking-tight leading-none text-white">
                Mitra <span className="text-[#EAF6E5]">NetraQu</span>{" "}
                <span className="text-xs font-bold text-white/80">Admin</span>
              </div>
              <div className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide text-[#EAF6E5] mt-0.5">
                JASA PIJAT TERAPIS DISABILITAS NETRA
              </div>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-white/85">
            <button
              type="button"
              onClick={() => setAdminTab(0)}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                adminTab === 0
                  ? "border-[#EAF6E5] text-white"
                  : "border-transparent hover:text-white"
              }`}
            >
              Pesanan Masuk ({filteredOrders.length})
            </button>
            <button
              type="button"
              onClick={() => setAdminTab(1)}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                adminTab === 1
                  ? "border-[#EAF6E5] text-white"
                  : "border-transparent hover:text-white"
              }`}
            >
              Data Pengguna ({users.length})
            </button>
            <button
              type="button"
              onClick={() => setAdminTab(2)}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                adminTab === 2
                  ? "border-[#EAF6E5] text-white"
                  : "border-transparent hover:text-white"
              }`}
            >
              Pengaturan CS
            </button>
          </nav>

          {/* Zone 3: Primary Action (Logout) */}
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap shrink-0 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Aplikasi</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 bg-white">
        {/* Admin Identity Strip & Screen Reader */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#0D5C91]/25 rounded-2xl p-4 shadow-xs">
          <div>
            <h1 className="font-extrabold text-base sm:text-lg text-[#0D5C91]">
              Dashboard Administrator Mitra NetraQu Palembang
            </h1>
            <p className="text-xs text-[#4C9A2A] font-semibold">
              Akun Administrator Aktif: <span className="font-mono font-bold text-[#0D5C91]">{ADMIN_PHONE}</span> · Kelola 7 tahapan status pesanan & data pelanggan
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Pilihan Gender Suara TTS (Pria / Wanita) */}
            <div
              className="inline-flex items-center bg-[#E6F2FA] border border-[#0D5C91]/20 rounded-xl p-0.5 text-xs font-bold"
              role="group"
              aria-label="Pilih Gender Suara Pembaca Layar"
            >
              <button
                type="button"
                onClick={() => onChangeTtsGender("pria")}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap ${
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
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap ${
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
              className="inline-flex items-center bg-[#EAF6E5] border border-[#4C9A2A]/25 rounded-xl p-0.5 text-xs font-bold"
              role="group"
              aria-label="Pilih Kecepatan Suara Pembaca Layar"
            >
              {(["lambat", "sedang", "cepat"] as const).map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => onChangeTtsSpeed(spd)}
                  className={`px-2.5 py-1.5 rounded-lg capitalize transition cursor-pointer whitespace-nowrap ${
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
                  `Dashboard Administrator Mitra NetraQu. Saat ini terdapat ${
                    filteredOrders.length
                  } pesanan dengan total nilai transaksi ${formatRupiah(
                    totalRevenue
                  )}, dan ${users.length} pengguna terdaftar.`
                )
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0D5C91] text-white text-xs font-bold hover:bg-[#4C9A2A] transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Bacakan Ringkasan Admin</span>
            </button>
            <button
              type="button"
              onClick={onStopSpeak}
              className="px-3 py-2 rounded-xl bg-[#E6F2FA] text-[#0D5C91] text-xs font-bold hover:bg-[#0D5C91]/20 transition cursor-pointer"
            >
              Stop
            </button>
          </div>
        </div>

        {/* 4-Column KPI Summary Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-[#E6F2FA] p-4 rounded-2xl border border-[#0D5C91]/25">
            <div className="flex items-center justify-between text-xs font-bold text-[#0D5C91] mb-1">
              <span>Pesanan Masuk</span>
              <ClipboardCheck className="w-4 h-4 text-[#0D5C91]" />
            </div>
            <div className="text-2xl font-extrabold text-[#0D5C91] font-mono tabular-nums">
              {filteredOrders.length}
            </div>
          </div>

          <div className="bg-[#EAF6E5] p-4 rounded-2xl border border-[#4C9A2A]/30">
            <div className="flex items-center justify-between text-xs font-bold text-[#4C9A2A] mb-1">
              <span>Total Transaksi</span>
              <Wallet className="w-4 h-4 text-[#4C9A2A]" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-[#4C9A2A] font-mono tabular-nums">
              {formatRupiah(totalRevenue)}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#4C9A2A]/30">
            <div className="flex items-center justify-between text-xs font-bold text-[#4C9A2A] mb-1">
              <span>Pesanan Selesai</span>
              <Calendar className="w-4 h-4 text-[#4C9A2A]" />
            </div>
            <div className="text-2xl font-extrabold text-[#4C9A2A] font-mono tabular-nums">
              {completedCount}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#0D5C91]/25">
            <div className="flex items-center justify-between text-xs font-bold text-[#0D5C91] mb-1">
              <span>Total Pengguna</span>
              <Users className="w-4 h-4 text-[#0D5C91]" />
            </div>
            <div className="text-2xl font-extrabold text-[#0D5C91] font-mono tabular-nums">
              {users.length}
            </div>
          </div>
        </div>

        {/* Mobile Segmented Tab Switcher */}
        <div className="grid grid-cols-3 bg-[#E6F2FA] p-1 rounded-xl md:hidden">
          <button
            type="button"
            onClick={() => setAdminTab(0)}
            className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              adminTab === 0 ? "bg-[#0D5C91] text-white shadow-xs" : "text-[#0D5C91]"
            }`}
          >
            Pesanan ({filteredOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setAdminTab(1)}
            className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              adminTab === 1 ? "bg-[#0D5C91] text-white shadow-xs" : "text-[#0D5C91]"
            }`}
          >
            Pengguna ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setAdminTab(2)}
            className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              adminTab === 2 ? "bg-[#0D5C91] text-white shadow-xs" : "text-[#0D5C91]"
            }`}
          >
            Pengaturan CS
          </button>
        </div>

        {adminTab === 0 && (
          <div className="space-y-4">
            {/* Filter Tanggal & Pencarian */}
            <div className="bg-white border border-[#0D5C91]/25 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#0D5C91] mr-1">
                  Filter Tanggal:
                </span>
                <button
                  type="button"
                  onClick={() => setDateFilter("ALL")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    dateFilter === "ALL"
                      ? "bg-[#0D5C91] text-white"
                      : "bg-[#E6F2FA] text-[#0D5C91] hover:bg-[#0D5C91]/20"
                  }`}
                >
                  Semua Tanggal
                </button>
                <button
                  type="button"
                  onClick={() => setDateFilter("TODAY")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    dateFilter === "TODAY"
                      ? "bg-[#4C9A2A] text-white"
                      : "bg-[#EAF6E5] text-[#4C9A2A] hover:bg-[#4C9A2A]/20"
                  }`}
                >
                  Hari Ini ({todayIso})
                </button>
                <input
                  type="date"
                  value={specificDate}
                  onChange={(e) => {
                    setDateFilter("SPECIFIC");
                    setSpecificDate(e.target.value);
                  }}
                  aria-label="Filter tanggal spesifik"
                  className="bg-white border border-[#0D5C91]/30 rounded-lg px-2.5 py-1 text-xs text-[#0D5C91] font-mono"
                />
              </div>

              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#0D5C91] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama pelanggan, nomor HP, atau ID pesanan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#0D5C91]/30 rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#0D5C91] focus:outline-none focus:border-[#4C9A2A]"
                />
              </div>
            </div>

            {/* Daftar Pesanan Masuk */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white border border-[#0D5C91]/25 rounded-2xl p-12 text-center space-y-2">
                <div className="font-bold text-sm text-[#0D5C91]">
                  Tidak ada pesanan yang cocok dengan filter
                </div>
                <p className="text-xs text-[#4C9A2A]">
                  Ubah filter tanggal atau kata kunci pencarian untuk melihat seluruh pesanan.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOrders.map((o) => {
                  const st = getStatusObj(o.status);
                  const cleanCustomerPhone = o.customerPhone.replace(/^0/, "62");
                  return (
                    <div
                      key={o.orderId}
                      className="bg-white border border-[#0D5C91]/25 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-start gap-2 border-b border-[#0D5C91]/15 pb-2.5">
                          <div>
                            <span className="font-bold text-sm text-[#0D5C91] font-mono">
                              {o.orderId}
                            </span>
                            <div className="text-xs font-bold text-[#0D5C91] mt-0.5">
                              {o.customerName} ·{" "}
                              <span className="font-mono text-[#4C9A2A]">{o.customerPhone}</span>
                            </div>
                          </div>
                          <div className={`text-xs font-bold ${st.textColor} text-right`}>
                            <span>{st.label}</span>
                            <span className="mx-1">·</span>
                            <span className="font-mono tabular-nums">{st.step}</span>
                          </div>
                        </div>

                        <div className="text-xs text-[#0D5C91] space-y-1">
                          <div>
                            <strong>Jadwal:</strong>{" "}
                            <span className="font-mono tabular-nums font-semibold">
                              {o.bookingDate} · {o.timeSlot}
                            </span>
                          </div>
                          <div>
                            <strong>Layanan:</strong> {o.servicesSummary}
                          </div>
                          <div>
                            <strong>Peserta:</strong> {o.totalParticipants} Orang (
                            {o.maleCount} Pria, {o.femaleCount} Wanita)
                          </div>
                          <div>
                            <strong>Lokasi:</strong> {o.locationType} —{" "}
                            {o.serviceAddress}
                          </div>
                          {o.customMessage && (
                            <div className="bg-[#E6F2FA]/60 border border-[#0D5C91]/15 rounded-lg p-2 mt-1">
                              <strong>Pesan Tambahan:</strong> {o.customMessage}
                            </div>
                          )}
                        </div>

                        <div className="pt-1 flex items-center justify-between">
                          <span className="text-sm font-extrabold text-[#4C9A2A] font-mono tabular-nums">
                            {formatRupiah(o.totalPayment)}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                onCopyText(
                                  `${o.orderId} | ${o.customerName} (${o.customerPhone}) | ${o.bookingDate} ${o.timeSlot} | ${o.servicesSummary} | ${o.serviceAddress}`,
                                  "Data pesanan"
                                )
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1 border border-[#0D5C91]/30 rounded-lg text-[11px] font-bold text-[#0D5C91] hover:bg-[#E6F2FA] cursor-pointer"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Salin</span>
                            </button>
                            <a
                              href={`https://wa.me/${cleanCustomerPhone}?text=${encodeURIComponent(
                                `Halo ${o.customerName}, kami dari Admin Mitra NetraQu Palembang mengonfirmasi pesanan Anda (${o.orderId}) untuk jadwal ${o.bookingDate} jam ${o.timeSlot}. Status saat ini: ${st.label}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EAF6E5] text-[#4C9A2A] rounded-lg text-[11px] font-bold hover:bg-[#4C9A2A] hover:text-white transition"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>Hubungi Pelanggan</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Kontrol Ubah 7 Status Pesanan Khusus Admin */}
                      <div className="pt-3 border-t border-[#0D5C91]/15">
                        <label className="block text-[11px] font-bold text-[#0D5C91] mb-1.5">
                          Ubah Status Pesanan (7 Tahapan Khusus Admin):
                        </label>
                        <select
                          value={o.status}
                          onChange={(e) =>
                            onUpdateOrderStatus(
                              o.orderId,
                              e.target.value as OrderStatusCode
                            )
                          }
                          className="w-full border border-[#0D5C91]/40 rounded-xl px-3 py-2 text-xs font-bold bg-[#E6F2FA]/60 text-[#0D5C91] focus:outline-none focus:border-[#4C9A2A] cursor-pointer"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s.code} value={s.code}>
                              {s.step} - {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {adminTab === 1 && (
          <div className="space-y-4">
            <h2 className="font-bold text-base text-[#0D5C91]">
              Daftar Pelanggan Terdaftar ({users.length} Pengguna)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map((u) => (
                <div
                  key={u.phone}
                  className="bg-white border border-[#0D5C91]/25 rounded-2xl p-4 shadow-xs flex justify-between items-start gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <UserAvatar photoUri={u.photoUri} name={u.fullName} size="sm" />
                    <div className="text-xs space-y-1">
                      <div className="font-bold text-sm text-[#0D5C91]">
                        {u.fullName}{" "}
                        {u.nickname ? (
                          <span className="text-xs font-semibold text-[#4C9A2A]">
                            ({u.nickname})
                          </span>
                        ) : null}
                      </div>
                      <div className="text-[#4C9A2A] font-bold font-mono">
                        {u.phone} ·{" "}
                        <span className="font-sans">
                          {u.gender === "Perempuan" ? "Wanita" : u.gender === "Laki-laki" ? "Pria" : u.gender || "Pria"}
                        </span>
                      </div>
                      {u.email && (
                        <div className="text-[#0D5C91]/80">
                          <strong>Email:</strong> {u.email}
                        </div>
                      )}
                      <div className="text-[#0D5C91]/90">
                        <strong>Alamat:</strong> {u.address || "-"}
                      </div>
                      {u.landmark && (
                        <div className="text-[#0D5C91]/80">
                          <strong>Patokan:</strong> {u.landmark}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onCopyText(
                        `Nama: ${u.fullName} (${u.nickname || "-"}) | HP: ${u.phone} | Gender: ${u.gender || "-"} | Email: ${u.email || "-"} | Alamat: ${u.address || "-"} | Patokan: ${u.landmark || "-"}`,
                        "Data pengguna"
                      )
                    }
                    className="px-3 py-2 border border-[#0D5C91]/30 rounded-xl text-xs font-bold text-[#0D5C91] hover:bg-[#E6F2FA] shrink-0 cursor-pointer"
                  >
                    Salin
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {adminTab === 2 && (
          <div className="max-w-xl space-y-5">
            <div className="bg-white border border-[#0D5C91]/25 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-[#0D5C91] font-bold text-base">
                <Settings className="w-5 h-5 text-[#4C9A2A]" />
                <h2>Pengaturan Nomor WhatsApp Customer Service</h2>
              </div>
              <p className="text-xs text-[#0D5C91] leading-relaxed">
                Nomor WhatsApp ini digunakan sebagai tujuan otomatis saat pelanggan menekan tombol <strong>Pesan & Konfirmasi ke WhatsApp CS</strong>. Gunakan awalan kode negara <code className="font-mono font-bold text-[#4C9A2A]">62</code>.
              </p>
              <form onSubmit={handleSaveWa} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#0D5C91] mb-1">
                    Nomor WhatsApp CS (Format 628xxx)
                  </label>
                  <input
                    type="tel"
                    value={waInput}
                    onChange={(e) => setWaInput(e.target.value)}
                    className="w-full bg-white border border-[#0D5C91]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#0D5C91] font-mono focus:outline-none focus:border-[#4C9A2A]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#4C9A2A] hover:bg-[#0D5C91] text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Simpan Nomor WhatsApp CS
                </button>
              </form>
            </div>

            <div className="bg-white border border-[#0D5C91]/25 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[#0D5C91] font-bold text-base">
                  <Lock className="w-5 h-5 text-[#0D5C91]" />
                  <h2>Keamanan Akun Administrator</h2>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E6F2FA] border border-[#0D5C91]/25 text-[#0D5C91] text-xs font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Terkunci Permanen</span>
                </span>
              </div>
              <p className="text-xs text-[#0D5C91]/85 leading-relaxed">
                Sesuai kebijakan keamanan sistem <strong>Mitra NetraQu</strong>, kredensial Email dan Password untuk akun <strong>Administrator</strong> dan <strong>Akun Demo</strong> dikunci dan tidak dapat diubah.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0D5C91] mb-1">
                    Email Administrator :
                  </label>
                  <input
                    type="email"
                    value="admin@mitranetraqu.id"
                    disabled
                    className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0D5C91] mb-1">
                    Password / PIN Administrator :
                  </label>
                  <input
                    type="password"
                    value="198006"
                    disabled
                    className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
