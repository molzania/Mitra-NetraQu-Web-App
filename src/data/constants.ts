export const ADMIN_PHONE = "081212345678";
export const ADMIN_PASS = "198006";
export const MAX_PARTICIPANTS = 3;
export const OUTLET_ADDRESS = "Jalan Sukahati No. 90 Palembang";
export const TRANSPORT_FEE = 100000;
export const DEFAULT_CS_WHATSAPP = "6281278901234";

export interface ServiceItem {
  id: string;
  name: string;
  rate: number;
  desc: string;
  focusArea: string;
}

export const SERVICES: ServiceItem[] = [
  {
    id: "srv_body",
    name: "Pijat Seluruh Tubuh (Full Body)",
    rate: 100000,
    desc: "Relaksasi menyeluruh seluruh tubuh oleh terapis tuna netra profesional.",
    focusArea: "Seluruh Tubuh"
  },
  {
    id: "srv_back_foot",
    name: "Pijat Punggung + Kaki",
    rate: 75000,
    desc: "Kombinasi terapi pijat punggung dan refleksi titik saraf kaki.",
    focusArea: "Punggung & Kaki"
  },
  {
    id: "srv_back_hand",
    name: "Pijat Punggung + Tangan",
    rate: 75000,
    desc: "Fokus meredakan pegal area punggung, bahu, dan lengan/tangan.",
    focusArea: "Punggung & Tangan"
  },
  {
    id: "srv_single_area",
    name: "Pijat Tangan / Kaki / Kepala / Kerokan Only",
    rate: 50000,
    desc: "Pilihan terapi fokus satu area (Tangan, Kaki, Kepala, atau Kerokan saja).",
    focusArea: "Tangan / Kaki / Kepala / Kerokan"
  }
];

export const TIME_SLOTS = [
  "09.00 WIB", "10.00 WIB", "11.00 WIB", "12.00 WIB",
  "13.00 WIB", "14.00 WIB", "15.00 WIB", "16.00 WIB",
  "17.00 WIB", "18.00 WIB", "19.00 WIB"
];

export type OrderStatusCode =
  | "PENDING_CONFIRMATION"
  | "CONFIRMED"
  | "WAITING_PAYMENT"
  | "PAYMENT_COMPLETED"
  | "THERAPIST_CONFIRMATION"
  | "THERAPIST_ON_THE_WAY"
  | "COMPLETED";

export interface OrderStatusMeta {
  code: OrderStatusCode;
  label: string;
  step: string;
  stepNumber: number;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

export const ORDER_STATUSES: OrderStatusMeta[] = [
  {
    code: "PENDING_CONFIRMATION",
    label: "Menunggu Dikonfirmasi",
    step: "1/7",
    stepNumber: 1,
    bgColor: "bg-[#E6F2FA]",
    textColor: "text-[#0D5C91]",
    borderColor: "border-[#0D5C91]/30"
  },
  {
    code: "CONFIRMED",
    label: "Dikonfirmasi",
    step: "2/7",
    stepNumber: 2,
    bgColor: "bg-[#E6F2FA]",
    textColor: "text-[#0D5C91]",
    borderColor: "border-[#0D5C91]/40"
  },
  {
    code: "WAITING_PAYMENT",
    label: "Menunggu Pembayaran",
    step: "3/7",
    stepNumber: 3,
    bgColor: "bg-[#E6F2FA]",
    textColor: "text-[#0D5C91]",
    borderColor: "border-[#0D5C91]/40"
  },
  {
    code: "PAYMENT_COMPLETED",
    label: "Pembayaran Lunas",
    step: "4/7",
    stepNumber: 4,
    bgColor: "bg-[#EAF6E5]",
    textColor: "text-[#4C9A2A]",
    borderColor: "border-[#4C9A2A]/40"
  },
  {
    code: "THERAPIST_CONFIRMATION",
    label: "Konfirmasi Terapis",
    step: "5/7",
    stepNumber: 5,
    bgColor: "bg-[#E6F2FA]",
    textColor: "text-[#0D5C91]",
    borderColor: "border-[#0D5C91]/40"
  },
  {
    code: "THERAPIST_ON_THE_WAY",
    label: "Terapis On The Way",
    step: "6/7",
    stepNumber: 6,
    bgColor: "bg-[#EAF6E5]",
    textColor: "text-[#4C9A2A]",
    borderColor: "border-[#4C9A2A]/40"
  },
  {
    code: "COMPLETED",
    label: "Pesanan Selesai",
    step: "7/7",
    stepNumber: 7,
    bgColor: "bg-[#EAF6E5]",
    textColor: "text-[#4C9A2A]",
    borderColor: "border-[#4C9A2A]/50"
  }
];

export interface UserProfile {
  fullName: string;
  phone: string;
  pin?: string;
  gender?: "Laki-laki" | "Perempuan";
  email?: string;
  address?: string;
  photoUri?: string;
  isAdmin?: boolean;
}

export interface OrderRecord {
  orderId: string;
  customerName: string;
  customerPhone: string;
  bookingDate: string;
  timeSlot: string;
  servicesSummary: string;
  maleCount: number;
  femaleCount: number;
  totalParticipants: number;
  locationType: "Datang ke Lokasi Pijat" | "Panggilan ke Rumah";
  serviceAddress: string;
  totalPayment: number;
  status: OrderStatusCode;
}

export interface BookingDraft {
  services: Record<string, number>; // serviceId -> duration in hours (1 or 2)
  maleCount: number;
  femaleCount: number;
  bookingDate: string;
  timeSlot: string;
  locationType: "Datang ke Lokasi Pijat" | "Panggilan ke Rumah";
  customAddress: string;
}

export function getInitialOrders(todayIso: string): OrderRecord[] {
  return [
    {
      orderId: "MNQ-20261102-1081",
      customerName: "Bpk. Hendra Wijaya",
      customerPhone: "081271829911",
      bookingDate: todayIso,
      timeSlot: "09.00 WIB",
      servicesSummary: "Pijat Seluruh Tubuh (Full Body) (1 Jam)",
      maleCount: 1,
      femaleCount: 0,
      totalParticipants: 1,
      locationType: "Panggilan ke Rumah",
      serviceAddress: "Jl. Sudirman No. 45, Ilir Timur I, Palembang",
      totalPayment: 200000,
      status: "PENDING_CONFIRMATION"
    },
    {
      orderId: "MNQ-20261102-1082",
      customerName: "Ibu Siti Nurhaliza",
      customerPhone: "082199887766",
      bookingDate: todayIso,
      timeSlot: "13.00 WIB",
      servicesSummary: "Pijat Seluruh Tubuh (Full Body) (2 Jam)",
      maleCount: 0,
      femaleCount: 2,
      totalParticipants: 2,
      locationType: "Datang ke Lokasi Pijat",
      serviceAddress: OUTLET_ADDRESS,
      totalPayment: 400000,
      status: "CONFIRMED"
    }
  ];
}

export const INITIAL_USERS: UserProfile[] = [
  {
    fullName: "Bpk. Hendra Wijaya",
    phone: "081271829911",
    pin: "123456",
    gender: "Laki-laki",
    email: "hendra.wijaya@gmail.com",
    address: "Jl. Sudirman No. 45, Ilir Timur I, Palembang",
    photoUri: ""
  },
  {
    fullName: "Ibu Siti Nurhaliza",
    phone: "082199887766",
    pin: "123456",
    gender: "Perempuan",
    email: "sitinurhaliza.plg@gmail.com",
    address: "Jl. Demang Lebar Daun No. 88, Palembang",
    photoUri: ""
  }
];

export function formatRupiah(num: number): string {
  return "Rp " + Number(num || 0).toLocaleString("id-ID");
}

export function getStatusObj(code: string): OrderStatusMeta {
  return ORDER_STATUSES.find((s) => s.code === code) || ORDER_STATUSES[0];
}

export function buildWhatsAppMessage(order: OrderRecord): string {
  return `Halo CS Mitra NetraQu Palembang, saya ingin konfirmasi pemesanan pijat:
• No. Pesanan: ${order.orderId}
• Nama Pemesan: ${order.customerName}
• No. HP: ${order.customerPhone}
• Jadwal: ${order.bookingDate} jam ${order.timeSlot}
• Layanan: ${order.servicesSummary}
• Peserta: ${order.maleCount} Pria, ${order.femaleCount} Wanita
• Lokasi: ${order.locationType} (${order.serviceAddress})
• Total Biaya: ${formatRupiah(order.totalPayment)}`;
}
